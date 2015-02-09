StartTest(function (t) {

    var scheduler = t.getScheduler({
        viewPreset         : 'weekAndDay',
        plugins            : new Sch.plugin.Pan({ enableVerticalPan : true }),
        renderTo           : Ext.getBody(),
        height             : 300,
        enableDragCreation : false
    }, 1);

    var event = scheduler.eventStore.first();
    var view = scheduler.getSchedulingView();

    t.chain(
        { waitForRowsVisible : scheduler },

        function (next) {

            t.is(scheduler.normalGrid.headerCt.items.first().getWidth(),
                scheduler.getSchedulingView().getEl().down('table').getWidth(),
                'Should find same width on header el as on table view el');

            next()
        },

        { moveCursorTo : '.sch-event' },

        // drag resizer 100px to the right
        { drag : '.sch-event .sch-resizable-handle', by : [100, 0] },

        function (next) {
            t.notOk("StartDate" in event.modified, "Event's start date not changed");
            t.isGreater(event.getEndDate(), event.modified.EndDate, "Event's end date has increased");

            // Clear events
            view.el.select(scheduler.getSchedulingView().eventSelector).remove();

            t.is(view.getScroll().left, 0, 'Scroll 0 before drag');

            next()
        },

        { drag : '.sch-schedulerview', by : [-30, 0], offset : [50, '50%'] },

        function (next) {

            // HACK, really weird bug in latest chrome
            if (Ext.isChrome) {
                t.isGreater(view.getScroll().left, 10, 'Scroll increased after drag');
            } else {
                t.is(view.getScroll().left, 30, 'Scroll increased after drag');
            }
            next()
        },

        { drag : '.sch-schedulerview', by : [30, 0], offset : [50, '50%'] },

        function () {
            t.is(view.getScroll().left, 0, 'Scroll 0 after drag back');
        }
    )
})
