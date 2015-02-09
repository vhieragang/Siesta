StartTest(function (t) {
    // in this test we'll first load the event store, then the resource store
    // row height sync should not break on any data (datasets are provided by the client)
    // #1091 - Broken row height synchronization between locked and normal grid.
    var resourceStore = new Sch.data.ResourceStore({
        proxy : {
            type   : 'ajax',
            reader : {
                type         : 'json',
                rootProperty : 'equipment'
            },
            url    : 'rendering/102_rowheight_3_resource_data.js'
        }
    })

    // Store holding all the events
    var eventStore = new Sch.data.EventStore({
        proxy : {
            type   : 'ajax',
            url    : "rendering/102_rowheight_3_events_data.js",
            reader : {
                type         : 'json',
                rootProperty : 'bookings'
            }
        }
    });

    var scheduler = t.getScheduler({
        viewPreset                  : 'hourAndDay',
        startDate                   : new Date(2009, 3, 25),
        endDate                     : new Date(2009, 5, 25),
        height                      : 450,
        lockedGridDependsOnSchedule : true,
        resourceStore               : resourceStore,
        eventStore                  : eventStore
    });

    scheduler.render(Ext.getBody());

    t.chain(
        function (next) {
            eventStore.load(next)
        },
        function (next) {
            resourceStore.load(next)
        },
        function (next) {
            t.rowHeightsAreInSync(scheduler, 'Row heights in sync after rendering');
        }
    );
})    
