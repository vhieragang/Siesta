StartTest(function (t) {
    // in this test we verify, that it possible to resize the event with "snapToIncrement" enabled
    // to the left/right most edge of the scheduling area 
    
    var s = t.getScheduler({
        snapToIncrement     : true,
        startDate           : new Date(2011, 0, 3),
        endDate             : new Date(2011, 0, 10)
    });

    s.eventStore.removeAll();
    s.eventStore.add({
        ResourceId : s.resourceStore.first().getId(),
        StartDate  : new Date(2011, 0, 4),
        EndDate    : new Date(2011, 0, 6)
    });

    var evt = s.eventStore.first();

    s.render(Ext.getBody());

    t.chain(
        { waitFor : 'rowsVisible' },

        // moving to the center of event to show the resize handlers
        { moveCursorTo : '.sch-event' },
        { 
            drag    : '.sch-resizable-handle-start', 
            by      : function () {
                // dragging one tick + 10px to the left
                return [ -s.timeAxisViewModel.getTickWidth() - 10, 0 ] 
            }
        },

        function (next) {
            t.is(evt.getStartDate(), new Date(2011, 0, 3), 'Event resized precisely at the begining of the day');

            next();
        },

        { moveCursorTo : '.sch-event' },
        { 
            drag    : '.sch-resizable-handle-end', 
            by      : function () {
                // dragging 4 ticks + 10px to the left
                return [ s.timeAxisViewModel.getTickWidth() * 4 + 10, 0 ] 
            }
        },

        function () {
            t.is(evt.getEndDate(), new Date(2011, 0, 10), 'Event resized precisely at the begining of the day');
        }
    );
});
