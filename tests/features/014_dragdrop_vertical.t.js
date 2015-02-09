StartTest(function (t) {

    // https://www.assembla.com/spaces/bryntum/tickets/715

    t.describe('Should be able to drag drop normally in vertical view', function (t) {

        t.it('Should be possible to drag events without snapToIncrement', function (t) {
            var s = t.getScheduler({
                orientation   : 'vertical',
                renderTo      : document.body,
                viewPreset    : 'minuteAndHour',
                startDate     : new Date(2010, 1, 1),
                endDate       : new Date(2010, 1, 1, 3),
                resourceStore : t.getResourceStore(),
                eventStore    : new Sch.data.EventStore({
                    data : [
                        {
                            ResourceId : t.getResourceStore().first().getId(),
                            StartDate  : new Date(2010, 1, 1, 0),
                            EndDate    : new Date(2010, 1, 1, 1)
                        }
                    ]
                })
            });

            var model = s.eventStore.first();

            t.chain(
                { waitFor : 'rowsVisible', args : s },

                function (next) {
                    t.dragOneTickForward(model, next);
                },

                function (next) {
                    t.is(model.getStartDate(), s.timeAxis.getDateFromTick(1), 'Should find updated start date');
                    s.destroy();
                }
            );
        });



        t.it('snapToIncrement sanity test, should not move when dragging half a tick width', function (t) {

            var s = t.getScheduler({
                orientation     : 'vertical',
                renderTo        : document.body,
                viewPreset      : 'minuteAndHour',
                startDate       : new Date(2010, 1, 1),
                endDate         : new Date(2010, 1, 1, 3),
                resourceStore   : t.getResourceStore(),
                snapToIncrement : true,
                eventStore      : new Sch.data.EventStore({
                    data : [
                        {
                            ResourceId : t.getResourceStore().first().getId(),
                            StartDate  : new Date(2010, 1, 1, 0),
                            EndDate    : new Date(2010, 1, 1, 1)
                        }
                    ]
                })
            });

            var model = s.eventStore.first();

            t.wontFire(s.eventStore, 'update');

            t.chain(
                { waitFor : 'rowsVisible', args : s },

                { drag : '.sch-event', by : [0, (s.timeAxisViewModel.getTickWidth()/2)-2]},

                function() { s.destroy(); }
            );
        });

        t.it('Should be possible to drag events with snapToIncrement', function (t) {

            var s = t.getScheduler({
                orientation     : 'vertical',
                renderTo        : document.body,
                viewPreset      : 'minuteAndHour',
                startDate       : new Date(2010, 1, 1),
                endDate         : new Date(2010, 1, 1, 3),
                resourceStore   : t.getResourceStore(),
                snapToIncrement : true,
                eventStore      : new Sch.data.EventStore({
                    data : [
                        {
                            ResourceId : t.getResourceStore().first().getId(),
                            StartDate  : new Date(2010, 1, 1, 0),
                            EndDate    : new Date(2010, 1, 1, 1)
                        }
                    ]
                })
            });

            var model = s.eventStore.first();

            t.chain(
                { waitFor : 'rowsVisible', args : s },

                function (next) {
                    t.dragOneTickForward(model, next);
                },

                function (next) {
                    t.is(model.getStartDate(), s.timeAxis.getDateFromTick(1), 'Should find updated start date');
                }
            );
        });
    });
});
