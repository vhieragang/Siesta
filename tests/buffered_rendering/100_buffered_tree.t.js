StartTest(function(t) {
    // see #1129 - Problems with buffered renderer
    
    var createFakeData = function () {
        var getResourcesData = function() {
            var resourceId = 0;
            // generate groups
            var groups = [];
            for (var g=0; g<25; ++g) {
                // generate sub-groups
                var subGroups = [];
                for (var sg=0; sg<15; ++sg) {
                    // generate resources
                    var resources = [];
                    for (var r=0; r<40; ++r) {
                        resources.push({
                            Id: resourceId,
                            Name: "Gate " + (((g + 1) * (sg + 1)) + r),
                            leaf: true,
                            Capacity: 100
                        });
                        ++resourceId;
                    }
                    
                    subGroups.push({
                        Id: "g" + g + "sg" + sg,
                        Name: "Gates " + ((40 * sg) + 1) + " - " + (40 * (sg + 1)),
                        iconCls: "sch-gates-bundle",
                        expanded: true,
                        children: resources
                    });
                }
                
                
                groups.push({
                    Id: "g" + g,
                    Name: "Terminal " + (g + 1),
                    iconCls: "sch-gates-bundle",
                    expanded: true,
                    children: subGroups
                });
            }
    
            return {
                Id: "root",
                expanded    : true,
                children: [{
                    Id: "airport",
                    Name: "The Worst Airport Ever",
                    iconCls: "sch-airport",
                    expanded: true,
                    children: groups
                }]
            };
        };
        
        var getFlights = function() {
            var flights = [];
            for(var f=0; f<12000; ++f) {
                var resourceId = Math.floor(Math.random() * 15000);
                flights.push({
                    ResourceId: resourceId,
                    Name : "Flight " + ((f * 3) + 1),
                    StartDate : "2011-12-02 08:20",
                    EndDate : "2011-12-02 09:50"
                });
                flights.push({
                    ResourceId: resourceId,
                    Name : "Flight " + ((f * 3) + 2),
                    StartDate: "2011-12-02 14:30",
                    EndDate : "2011-12-02 16:10"
                });
                flights.push({
                    ResourceId: resourceId,
                    Name : "Flight " + ((f * 3) + 3),
                    StartDate : "2011-12-02 09:10",
                    EndDate : "2011-12-02 10:40"
                });
            }
            return flights;
        };
        
        
        return {
            resourceStore       : new Sch.data.ResourceTreeStore({
                root            : /*RESOURCE_DATA = */getResourcesData()
            }),
            
            eventsStore         : new Sch.data.EventStore({
                data            : /*EVENTS_DATA = */getFlights()
            })
        }
    };
    
    var data            = createFakeData()

    // create the Resource Store
    var resourceStore   = data.resourceStore
    var eventsStore     = data.eventsStore
    
    var scheduler = t.getSchedulerTree({
        eventStore      : eventsStore,
        resourceStore   : resourceStore,
        
        width           : 600,
        height          : 400,
        
        renderTo        : Ext.getBody(),
        
        viewPreset      : 'hourAndDay',
        startDate       : new Date(2011, 11, 2, 8),
        endDate         : new Date(2011, 11, 2, 18),
        
        columnLines     : false,
        rowLines        : true,
        
        lockedGridConfig : { width : 200 },
        
        columns       : [
            { header : 'Name', width : 150, dataIndex : 'Name', xtype : 'treecolumn' },
            { header : 'Id', width : 50, dataIndex : 'Id' }
        ],
        
        plugins         : [
            {
                ptype                   : 'bufferedrenderer',
                variableRowHeight       : true
            }
        ]
    });

    var schedulingView      = scheduler.getSchedulingView()
    var normalView          = schedulingView
    var lockedView          = scheduler.lockedGrid.getView()
    
    var resourceById        = function (id) { return resourceStore.getNodeById(id) }
    
    var el                  
    
    t.chain(
        { waitForRowsVisible : scheduler },
        {
            // it seems shortly after initial rendering, the "scrollTop" position of the buffered schedulingView will be reset to 0
            // need to wait some time before modifiying it
            waitFor     : 500
        },
//        // here we scroll to the bottom of the grid
//        function (next) {
//            t.bufferedRowsAreSync(scheduler, "Rows are synchronized")
//            
//            el                      = schedulingView.el;
//            
//            t.isLess(el.query(Ext.grid.View.prototype.itemSelector).length, 1000, "Only part of the dataset has been rendered")
//            
//            // scroll to bottom with 300ms delay
//            t.scrollVerticallyTo(el, el.dom.scrollHeight, 300, next)
//        },
        function (next) {
            el                      = schedulingView.el;
            
            t.bufferedRowsAreSync(scheduler, "Rows are synchronized")
            
            schedulingView.bufferedRenderer.scrollTo(resourceStore.nodeStore.indexOf(resourceById('g24sg14')) , false, next)
        },
        { waitFor : 500 },
        function (next) {
            t.bufferedRowsAreSync(scheduler, "Rows are synchronized")
            
            resourceById('g24sg14').collapse()
            
            next()
        },
        { waitFor : 300 },
        function (next) {
            t.bufferedRowsAreSync(scheduler, "Rows are synchronized")
            
            t.isApprox(el.dom.scrollTop, el.dom.scrollHeight - el.dom.clientHeight, 'View is scrolled to bottom-most position')
            
            next()
        }
        
        
        
//        ,
//        function (next) {
//            t.bufferedRowsAreSync(scheduler, "Rows are synchronized")
//            
//            var lastNormalRow       = el.down('tr:last-child');
//            var lastLockedRow       = lockedView.el.down('tr:last-child')
//            
//            t.is(schedulingView.getRecord(lastNormalRow.dom).getId(), 999, 'Found last record row in scheduler schedulingView');
//            
//            t.like(lastLockedRow.dom.innerHTML, 'BuffRow999', 'Found last record row in locked schedulingView');
//            
//            t.is(lastNormalRow.getY(), lastLockedRow.getY(), 'Both rows have the same vertical position')
//            
//            t.isApprox(el.down('.myZoneStyle').getBottom(), lastLockedRow.getBottom(), 1, 'Zones stretches on whole view height')
//            t.isApprox(el.down('.myLineStyle').getBottom(), lastLockedRow.getBottom(), 1, 'Line stretches on whole view height')
//            t.isApprox(el.down('.sch-column-line').getBottom(), lastLockedRow.getBottom(), 1, 'Column line stretches on whole view height')
//            
//            next()
//        },
//        // now we are trying to reproduce a row desynchronization regression
//        // 1st step is to scroll to the most bottom of the grid 
//        // (seems previous step causes the spacer element to appear and sligthly increase the scroll height
//        // of the view)
//        function (next) {
//            t.bufferedRowsAreSync(scheduler, "Rows are synchronized")
//            
//            // scroll to bottom with 300ms delay
//            t.scrollVerticallyTo(el, el.dom.scrollHeight, 300, next)
//        },
//        // now we scroll a significant distance to the top, imititating user moving the scrollbar quickly
//        // after this step the rows will be desynronized
//        function (next) {
//            t.bufferedRowsAreSync(scheduler, "Rows are synchronized")
//            
//            t.scrollVerticallyTo(el, el.dom.scrollHeight - el.getHeight() - 1150, 300, next)
//        },
//        function (next) {
//            // verify that we found the fix and rows are in sync
//            t.bufferedRowsAreSync(scheduler, "Rows are synchronized")
//            
//            // now we scroll almost to the top
//            t.scrollVerticallyTo(el, 1100, 300, next)
//        },
//        function (next) {
//            t.bufferedRowsAreSync(scheduler, "Rows are synchronized")
//            
//            // and imititate user scrolling gradually to the top-most position
//            t.scrollVerticallyTo(el, 0, 300, next)
//        },
//        function (next) {
//            t.bufferedRowsAreSync(scheduler, "Rows are synchronized")
//            
//            // the table can be slightly out of the view - need to verify it starts at the top
//            t.is(normalView.body.getLocalY(), 0, "Normal view should be precisely at the top")
//            t.is(lockedView.body.getLocalY(), 0, "Locked view should be precisely at the top")
//        }
        
    )
})    

