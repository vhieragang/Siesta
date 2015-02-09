StartTest(function (t) {

    var scheduler = t.getScheduler({
        forceFit : true,
        renderTo : Ext.getBody()
    });
    var eventSM = scheduler.getEventSelectionModel();

    t.isInstanceOf(eventSM, Sch.selection.EventModel, 'Correct sel model found');
    t.is(eventSM.getStore(), scheduler.eventStore, 'selection model bound to eventStore');
    t.is(scheduler.getEventSelectionModel(), eventSM, 'Correct sel model found #2');

    t.waitForEventsToRender(scheduler, function () {
        var firstTaskEl = t.getFirstEventEl(scheduler),
            secondTaskEl = scheduler.getSchedulingView().getElementFromEventRecord(scheduler.eventStore.last());

        eventSM.on('selectionchange', function (sm, selected) {
            t.is(selected.length, 1, 'Just one event model selected');
        });

        eventSM.on('select', function (sm, record) {
            t.is(sm, eventSM, 'correct arguments passed to "select" listener');
            t.ok(record instanceof Sch.model.Event, 'correct arguments passed to "select" listener');
        });

        eventSM.on('deselect', function (sm, record) {
            t.is(sm, eventSM, 'correct arguments passed to "select" listener');
            t.ok(record instanceof Sch.model.Event, 'correct arguments passed to "deselect" listener');
        });

        t.willFireNTimes(eventSM, 'select', 2);
        t.willFireNTimes(eventSM, 'deselect', 1);
        t.willFireNTimes(scheduler, 'eventselect', 2);
        t.willFireNTimes(scheduler, 'eventdeselect', 1);
        t.willFireNTimes(scheduler, 'eventselectionchange', 2);

        t.chain(
            { click : firstTaskEl },

            function (next) {

                t.hasCls(firstTaskEl, 'sch-event-hover', 'Should keep hover state after being selected, mouse is still over the element')
                next();
            },

            { click : secondTaskEl },

            function (next) {

                t.hasCls(secondTaskEl, 'sch-event-hover', 'Should keep hover state after being selected, mouse is still over the element')

                scheduler.setOrientation('vertical');
                t.is(eventSM.getStore(), scheduler.eventStore, 'selection model bound to eventStore');
                scheduler.setOrientation('horizontal');
                t.is(eventSM.getStore(), scheduler.eventStore, 'selection model bound to eventStore');
            }
        );
    });
})    
