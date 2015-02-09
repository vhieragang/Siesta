StartTest(function(t) {

    // http://www.sencha.com/forum/showthread.php?286575-Crash-when-subclassing-treestore&p=1047848#post1047848

    var resourceStore = new Sch.data.ResourceTreeStore({
        root : {},
        proxy : {
            type    : 'ajax',
            reader  : 'json',
            url     : 'tree/123_treeview_rowheight.data.js'
        }
    });

    var eventStore  = new Sch.data.EventStore({
        data    : [
            // 2 overlapping tasks
            {ResourceId: 4, Name : 'event 1', StartDate : "2011-12-02 08:20", EndDate : "2011-12-02 11:25"},
            {ResourceId: 4, Name : 'event 2', StartDate : "2011-12-02 08:20", EndDate : "2011-12-02 11:25"}
        ]
    })
    
    var scheduler = t.getSchedulerTree({
        startDate       : new Date(2011, 11, 2, 7),
        endDate         : new Date(2011, 11, 2, 9),
        resourceStore   : resourceStore,
        eventStore      : eventStore,
        
        renderTo        : Ext.getBody()
    });
    
    t.chain(
        { waitFor : 'eventsToRender' },

        function (next) {
            t.is(scheduler.lockedGrid.getView().el.select('tr').getCount(),
                 scheduler.normalGrid.getView().el.select('tr').getCount(),
                'Should find equal amount of rows in both trees');

            t.rowHeightsAreInSync(scheduler, 'Row height synced ok after rendering');

            resourceStore.getNodeById(3).collapse();

            t.rowHeightsAreInSync(scheduler, 'Row height synced ok after collapsing a parent node');

            resourceStore.getNodeById(3).expand();

            t.rowHeightsAreInSync(scheduler, 'Row height synced ok after expanding a parent node');
            
            next()
        },
        function (next) {
            resourceStore.reload({
                callback : next
            })
            eventStore.loadData([
                { ResourceId: 4, Name : 'event 1', StartDate : "2011-12-02 08:20", EndDate : "2011-12-02 11:25" }
            ])
        },
        function () {
            t.rowHeightsAreInSync(scheduler, 'Row height synced ok after loading new date in the event store');
        }
    );
})
