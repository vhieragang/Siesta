StartTest(function(t) {
    
    // this test exersizes the case, when buffered store is loaded with small number of records 
    // (seems less than the view size)
    // In this case 1) it should be loaded after the grid with paging scroller is rendered
    // 2) stretcher height will be set to 0, breaking code that depends on its height
    // otherwise test is very similar to 2102_buffered_view.t.js
    
    var createFakeData = function (count) {
        var data = [];
        for (var i = 0; i < count; i++) {
            data.push({
                Id : i, 
                Name : 'BuffRow' + i
            });
        }
        return data;
    };

    // create the Resource Store
    var resourceStore = Ext.create('Sch.data.ResourceStore', {
        // buffered store must have a proxy
        proxy           : {
            type        : 'memory'
        }            
    });
    
    setTimeout(function () {
        resourceStore.proxy.data = createFakeData(20)
        resourceStore.load()
    }, 50)
    
    
    t.expectGlobal('Line')
    
    Ext.define('Line', {
        extend      : 'Ext.data.Model',
        fields      : [
            'Date',
            'Text',
            'Cls'
         ]
    });
    
    var lineStore = Ext.create('Ext.data.Store', {
        model       : 'Line',
        data        : [
            {
                Date    : new Date(2011, 0, 4, 12),
                Text    : 'Some important date',
                Cls     : 'myLineStyle'
            }
        ]
    });
    
    var zoneStore   = Ext.create('Ext.data.Store', {
        model   : 'Sch.model.Range',
        data    : [
            {
                StartDate   : new Date(2011, 0, 4),
                EndDate     : new Date(2011, 0, 5),
                Cls         : 'myZoneStyle'
            }
        ]
    });
    

    var scheduler = t.getScheduler({
        resourceStore   : resourceStore,
        width           : 500,
        height          : 300,
        renderTo        : Ext.getBody(),
        
        plugins         : [
            'bufferedrenderer',

            Ext.create("Sch.plugin.Zones", {
                store : zoneStore
            }),
            Ext.create("Sch.plugin.Lines", {
                store : lineStore
            })
        ]
    });

    var schedulingView    = scheduler.getSchedulingView()
    
    var el
    
    t.chain(
        {
            waitFor     : 'rowsVisible',
            args        : [ scheduler ]
        },
        {
            // it seems shortly after initial rendering, the "scrollTop" position of the buffered schedulingView will be reset to 0
            // need to wait some time before modifiying it
            waitFor     : 300
        },
        function (next) {
            el              = schedulingView.el;
            
            // scrolling bottom most, with 300ms delay
            t.scrollVerticallyTo(el, el.dom.scrollHeight, 300, next)
        },
        function (next) {
            var lastNormalRow   = t.safeSelect('.x-grid-item:last-child', el.dom);
            var lastLockedRow   = t.safeSelect('.x-grid-item:last-child', scheduler.lockedGrid.view.el.dom);
            
            t.is(schedulingView.getRecord(lastNormalRow.dom).getId(), 19, 'Found last record row in scheduler schedulingView');
            
            t.is(lastNormalRow.getY(), lastLockedRow.getY(), 'Both rows have the same vertical position')
            
            t.isApprox(el.down('.myZoneStyle').getBottom(), lastLockedRow.getBottom(), 1, 'Zones stretches on whole view height')
            t.isApprox(el.down('.myLineStyle').getBottom(), lastLockedRow.getBottom(), 1, 'Line stretches on whole view height')
            t.isApprox(el.down('.sch-column-line').getBottom(), lastLockedRow.getBottom(), 1, 'Column line stretches on whole view height')
        }
    )
})    

