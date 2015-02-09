StartTest(
    {
        // to avoid waiting - seems somewhere in Ext code related to tooltips,
        // there is a "setTimeout" call
        overrideSetTimeout : false
    },
    function (t) {
        var scheduler = t.getScheduler({
            tooltipTpl  : new Ext.Template('{Name}{Id}'),
            renderTo    : Ext.getBody()
        }, 1);

        scheduler.setTimeSpan(Ext.Date.add(scheduler.getStart(), Sch.util.Date.DAY, -20),
                              Ext.Date.add(scheduler.getEnd(), Sch.util.Date.DAY, 20))

        var firstTask = scheduler.eventStore.first();
        t.willFireNTimes(scheduler, 'beforetooltipshow', 1)

        firstTask.setStartEndDate(scheduler.getStart(), scheduler.getEnd());

        t.chain(
            { waitFor : 'eventsToRender', args : scheduler },

            function (next) {
                var tip = scheduler.getSchedulingView().tip,
                    count = 0;

                t.ok(!tip, 'Tip not created before first event hover');

                scheduler.on('beforetooltipshow', function (schedView, record) {
                    t.is(schedView, scheduler.getSchedulingView(), '"beforetooltipshow" - correct 1st argument');
                    t.is(firstTask, record, '"beforetooltipshow" - correct 2nd argument');

                    var as = t.beginAsync();
                    // return false;
                    schedView.tip.on('show', function(tip) {
                        t.endAsync(as);

                        t.isApprox(tip.getX(), t.currentPosition[0], 20, 'Should find tooltip horizontally placed by the cursor');
                    }, null, { delay : 100 });

                }, null, { single : true });

                scheduler.scrollToDate(new Date(scheduler.getStart().getTime() - 10000000 + (scheduler.getEnd() - scheduler.getStart()) / 2));

                next();
            },

            // ENABLE AFTER EXT TIP BUG IS FIXED
            // First time the show is prevented
            // { action : 'moveCursorTo', target : '.sch-event' },
            // { waitFor : 1000 },
            // { action : 'moveCursor', by : [0, -30] },
            // { waitFor : 1000 },
            { action : 'moveCursorTo', target : '.sch-event' },

            { waitFor : 'componentVisible', args : '[cls=sch-tip]' }
        );
    })
