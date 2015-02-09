StartTest(function (t) {
    var doTest = function (t, orientation) {
        var eventStore = new Sch.data.EventStore();

        var scheduler = t.getScheduler({
            startDate     : new Date(2010, 1, 1),
            endDate       : new Date(2010, 2, 2),

            orientation   : orientation,
            eventStore    : eventStore,
            resourceStore : t.getResourceStore({
                data : [{ Id : 1 }]
            }),

            renderTo      : Ext.getBody()
        });

        var view = scheduler.getSchedulingView();


        t.chain(
            { waitForRowsVisible : scheduler },

            function (next) {

                t.it ('Should not render events outside the timeaxis', function(t) {
                    t.wontFire(view, 'itemupdate', 'Rows should not be repainted when modifying event records outside the timeaxis')

                    var event = eventStore.add({
                        StartDate  : new Date(1999, 1, 1, 10),
                        EndDate    : null,//new Date(1999, 1, 1, 12),
                        ResourceId : 1
                    });

                    event = event[0];

                    // testing complex condition checking case when resource and dates are changed simultaneously
                    event.beginEdit();
                    event.setEndDate(new Date(1999, 1, 1, 13));
                    event.setResourceId('r2');
                    event.endEdit();

                    event.setStartDate(null);

                    eventStore.remove(event);
                })

                t.it ('Moving event to/from time axis should repaint rows', function(t) {
                    eventStore.loadData([{
                        Id  : 1,
                        StartDate   : new Date(2010, 1, 1, 10),
                        EndDate     : new Date(2010, 1, 1, 12),
                        ResourceId  : 1
                    }])

                    var event = eventStore.getAt(0);

                    event.beginEdit();
                    event.setStartDate(new Date(2010, 0, 1));
                    event.setEndDate(new Date(2010, 0, 2));
                    event.endEdit();

                    t.selectorNotExists('.sch-event', 'Event is outside of timeaxis');

                    event.beginEdit();
                    event.setStartDate(new Date(2010, 1, 1, 10));
                    event.setEndDate(new Date(2010, 1, 1, 12));
                    event.endEdit();

                    t.selectorExists('.sch-event', 'Event is inside of timeaxis');
                });

                next()
            },

            // repaintEventsForResource is called in a callback after animation
            { waitFor : 1000 },

            function () {
                scheduler.destroy();
            }
        )
    };

    t.it('Events outside of timeaxis should not trigger rows repainting', function (t) {
        t.it('Horizontal orientation', function (t) {
            doTest(t, 'horizontal');
        });
    
        t.it('Vertical orientation', function (t) {
            doTest(t, 'vertical');
        });
    });
});