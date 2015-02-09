StartTest(function (t) {
    var scheduler;

    var setup = function (cfg) {
        scheduler && scheduler.destroy();

        scheduler = t.getScheduler({
            renderTo    : Ext.getBody(),
            startDate   : new Date(2010, 0, 1),
            endDate     : new Date(2010, 0, 7),
            viewPreset  : 'dayAndWeek',
            multiSelect : true,
            forceFit    : true,
            resourceStore   : new Sch.data.ResourceStore({
                data    : [
                    { Id : 1, Name : 'r1' },
                    { Id : 2, Name : 'r2' }
                ],
                proxy   : 'memory'
            }),
            eventStore  : new Sch.data.EventStore({
                data    :[
                    { Id : 1, ResourceId : 1, Cls : 'Foo', StartDate : new Date(2010, 0, 1), EndDate : new Date(2010, 0, 2) },
                    { Id : 2, ResourceId : 1, Cls : 'Bar', StartDate : new Date(2010, 0, 2), EndDate : new Date(2010, 0, 3) }
                ],
                proxy   : 'memory'
            })
        });
    }


    t.it('Should perform multiselect', function (t) {
        setup();

        var sm = scheduler.getEventSelectionModel();
        var view = scheduler.getSchedulingView();

        t.chain(
            { waitFor : 'EventsToRender' },

            { click : '.Foo' },

            function (next) {
                t.is(sm.selected.getCount(), 1, '1 event selected');
                t.selectorCountIs('.sch-event-selected', 1, 'A rendered event have a selected cls');

                scheduler.eventStore.first().setStartDate(new Date(2010, 0, 1, 1));

                t.selectorCountIs('.sch-event-selected', 1, 'A rendered event should keep its selected cls after being updated');
                next();
            },

            { click : '.Bar', options : { ctrlKey : true } },

            function (next) {
                t.is(sm.selected.getCount(), 2, '2 events selected');
                Ext.select('.sch-event').remove();
                next();
            },

            { action : 'click' },

            function (next) {
                t.is(sm.selected.getCount(), 0, 'Clicked on the schedule itself, no events selected');
            }
        );
    });

    t.it('Should clear selection on store reload', function (t) {
        setup();

        t.chain(
            { waitForEventsToRender : scheduler },
            function (next) {
                var sm = scheduler.getEventSelectionModel();
                sm.select(scheduler.eventStore.getRange());

                t.is(sm.selected.length, 2, 'Both events selected');

                scheduler.eventStore.load();

                t.is(sm.selected.length, 0, 'Selection removed');
                t.selectorNotExists('.sch-event-selected', 'Nothing is selected');
            }
        )
    });
})
