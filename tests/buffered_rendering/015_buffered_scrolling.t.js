StartTest(function(t) {
    // In this test we'll gradually scroll through the whole grid content, with 
    // random scroll intervals
    // on every step we verify, that rows are synchronized
    
    var createFakeData = function (count) {
        var resources = [];
        
        for (var i = 0; i < count; i++)
            resources.push({
                Id          : i, 
                Name        : 'BuffRow' + i,
                leaf        : true,
                children    : []
            });
        
        var events = [];
        
        for (var i = 0; i < count; i++) {
            events.push({
                Id          : i, 
                Name        : 'Event' + i,
                ResourceId  : i,
                StartDate   : new Date(2011, 0, 4),
                EndDate     : new Date(2011, 0, 5)
            });
            
            events.push({
                Id          : i + '-2', 
                Name        : 'Event' + i + '-2',
                ResourceId  : i,
                StartDate   : new Date(2011, 0, 4),
                EndDate     : new Date(2011, 0, 5)
            });

        }
        
        return {
            resources   : resources,
            events      : events
        }
    };
    
    t.it('Scrolling should work with scheduler grid', function (t) {
        var data            = createFakeData(1000);
    
        var resourceStore   = new Sch.data.ResourceStore({
            data    : data.resources
        });
        
        var eventsStore     = new Sch.data.EventStore({
            data    : data.events
        });
        
        var scheduler = t.getScheduler({
            eventStore      : eventsStore,
            resourceStore   : resourceStore,
            width           : 500,
            renderTo        : Ext.getBody()
        });
    
        var schedulingView      = scheduler.getSchedulingView();
        var normalView          = schedulingView;
        var lockedView          = scheduler.lockedGrid.getView();
        var el                  = schedulingView.el;
        
        t.chain(
            {
                waitFor     : 'rowsVisible',
                args        : [ scheduler ]
            },
            {
                // it seems shortly after initial rendering, the "scrollTop" position of the buffered schedulingView will be reset to 0
                // need to wait some time before modifiying it
                waitFor     : 500
            },
            // here we scroll to the bottom of the grid
            function (next) {
                t.bufferedRowsAreSync(scheduler, "Rows are synchronized");
                
                var steps               = [];
                
                var el                  = schedulingView.el;
                var increment           = 700;
                var height              = el.dom.scrollHeight;
                
                var points              = [];
                
                // every 3rd scroll is 2 times bigger
                for (var i = 0; i < height; i += increment * (0.7 + Math.random() * 2)) {
                    points.push(Math.floor(i));
                }
                
                points.push(height);
                // remove point 0
                points.shift();
                    
                Ext.Array.each(points, function (point) {
                    steps.push(
                        function (next) {
                            t.scrollVerticallyTo(el, point, 300, function () {
                                t.bufferedRowsAreSync(scheduler, "Rows are synchronized");
                                
                                next();
                            })
                        }
                    )
                })
                
                t.chain(steps)
            }
        );
    });
    
    t.it('Scrolling should work with scheduler tree', function (t) {
        var data = {
            resources   : (function () {
                var data = [];
                
                for (var i = 1; i < 500; i++) {
                    data.push({
                        "Id": i,
                        "Name": i,
                        "children": [],
                        "leaf": true
                    });
                }
                
                return [{
                    "Id": 't',
                    "Name": 't',
                    "children": data
                }];
            })(),
            events      : (function () {
                var data = [];
                
                for (var i = 0; i < 1000; i = i + 2) {
                    data.push({
                        "Id": i - 1,
                        "Name": i / 2,
                        "StartDate": "2014-04-24T00:00:00-04:00",
                        "EndDate": "2014-04-25T23:59:59.999-04:00",
                        "ResourceId": i / 2
                    }, {
                        "Id": i,
                        "Name": i / 2,
                        "StartDate": "2014-04-25T00:00:00-04:00",
                        "EndDate": "2014-04-25T23:59:59.999-04:00",
                        "ResourceId": i / 2
                    });
                }
                
                return data;
                
            })()
        }
        
        var resourceStore = new Sch.data.ResourceTreeStore({
            model: "Sch.model.Resource",
            proxy: { type: "memory"}
        });
        
        var eventStore = new Sch.data.EventStore({
            model: "Sch.model.Event",
            proxy: { type: "memory"}
        });
        
        var scheduler = Ext.create("Sch.panel.SchedulerTree", {
            width: 500,
            height: 400,
            title: 'Buffered view',
            renderTo: Ext.getBody(),
            startDate: new Date(2014, 3, 24),
            endDate: new Date(2014, 4, 1),
            viewPreset: 'dayAndWeek',
            columns: [{ dataIndex : 'Name'}],
            plugins: [
                {
                    ptype: "bufferedrenderer",
                    trailingBufferZone: 5,
                    leadingBufferZone: 5
                }
            ],
            
            rowLines    : true,
            
            resourceStore: resourceStore,
            eventStore: eventStore,
            beforerefresh: function () { return false; }
        });
        
        eventStore.loadData(data.events);
        resourceStore.getRoot().appendChild(data.resources);
        
        resourceStore.hideNodesBy(function (resource) {
            var isGroup = !!(resource.get("depth") == 1);
            
            if (isGroup) {
                resource.set("expanded", true);
                resource.wasAutoCollapsed = true;
            }
            return false;
        });
        
        var schedulingView      = scheduler.getSchedulingView();
        var normalView          = schedulingView;
        var lockedView          = scheduler.lockedGrid.getView();
        var el                  = schedulingView.el;
        
        t.chain(
            {
                waitFor     : 'rowsVisible',
                args        : [ scheduler ]
            },
            {
                // it seems shortly after initial rendering, the "scrollTop" position of the buffered schedulingView will be reset to 0
                // need to wait some time before modifiying it
                waitFor     : 500
            },
            // here we scroll to the bottom of the grid
            function (next) {
                t.bufferedRowsAreSync(scheduler, "Rows are synchronized");
                
                var steps               = [];
                
                var el                  = schedulingView.el;
                var increment           = 700;
                var height              = el.dom.scrollHeight;
                
                var points              = [];
                
                // every 3rd scroll is 2 times bigger
                for (var i = 0; i < height; i += increment * (0.7 + Math.random() * 2)) {
                    points.push(Math.floor(i));
                }
                
                points.push(height);
                // remove point 0
                points.shift();
                    
                Ext.Array.each(points, function (point) {
                    steps.push(
                        function (next) {
                            t.scrollVerticallyTo(el, point, 300, function () {
                                t.bufferedRowsAreSync(scheduler, "Rows are synchronized");
                                
                                next();
                            });
                        }
                    );
                })
                
                t.chain(steps);
            }
        );
    });

    t.it('Scrolling should work with scheduler grid', function (t) {
        var data            = createFakeData(1000);

        var resourceStore   = new Sch.data.ResourceStore({
            data    : data.resources
        });

        var eventsStore     = new Sch.data.EventStore({
            data    : data.events
        });

        var scheduler = t.getScheduler({
            eventStore      : eventsStore,
            resourceStore   : resourceStore,
            width           : 500,
            renderTo        : Ext.getBody()
        });

        var schedulingView      = scheduler.getSchedulingView();
        var normalView          = schedulingView;
        var lockedView          = scheduler.lockedGrid.getView();
        var el                  = schedulingView.el;

        t.chain(
            {
                waitFor     : 'rowsVisible',
                args        : [ scheduler ]
            },
            {
                // it seems shortly after initial rendering, the "scrollTop" position of the buffered schedulingView will be reset to 0
                // need to wait some time before modifiying it
                waitFor     : 500
            },
            // here we scroll to the bottom of the grid
            function (next) {

                var el                  = schedulingView.el;
                var top                 = 3700;

                t.scrollVerticallyTo(el, 22000, 300, function () {

                    t.scrollVerticallyTo(el, 0, 300, function () {
                        t.bufferedRowsAreSync(scheduler, "Rows are synchronized");
                        next();
                    });

                });
            }
        );
    });

})    

