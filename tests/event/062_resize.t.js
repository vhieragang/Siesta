StartTest(function (t) {

    t.it('Basic use cases', function (t) {

        var scheduler = t.getScheduler({
            cls      : 'sched1',
            renderTo : Ext.getBody(),
            height   : 200
        }, 1);

        var fired = {
            'beforeeventresize'  : 0,
            'eventresizestart'   : 0,
            'eventpartialresize' : 0,
            'eventresizeend'     : 0
        };

        var record = scheduler.eventStore.first();

        scheduler.on({
            'beforeeventresize'  : function () {
                t.ok(arguments[0] instanceof Sch.view.SchedulerGridView &&
                    arguments[1] instanceof Sch.model.Event && !!arguments[2].getTarget, 'Correct event signature of `beforeeventresize`')

                fired.beforeeventresize++;
            },
            'eventresizestart'   : function () {
                t.ok(arguments[0] instanceof Sch.view.SchedulerGridView &&
                    arguments[1] instanceof Sch.model.Event, 'Correct event signature of `eventresizestart`')

                fired.eventresizestart++;
            },
            'eventpartialresize' : function () {
                if (fired.eventpartialresize === 0) {
                    t.ok(arguments[0] instanceof Sch.view.SchedulerGridView &&
                        arguments[1] instanceof Sch.model.Event &&
                        arguments[2] instanceof Date &&
                        arguments[3] instanceof Date &&
                        arguments[4] instanceof Ext.Element, 'Correct event signature of `eventpartialresize`')

                    fired.eventpartialresize = 1;
                }
            },
            'eventresizeend'     : function () {
                t.ok(arguments[0] instanceof Sch.view.SchedulerGridView &&
                    arguments[1] instanceof Sch.model.Event, 'Correct event signature of `eventresizeend`')

                fired.eventresizeend++;
            }
        });

        t.chain(
            { waitFor : 'eventsToRender', args : scheduler },

            // Drag end resize handle bar 100px to the right
            { action : 'drag', target : '.sched1 .sch-resizable-handle-end', by : [100, 0] },

            function (next, el) {

                for (var o in fired) {
                    if (o === 'eventpartialresize') {
                        t.ok(fired[o] > 0, Ext.String.format("'{0}' event fired", o));
                    } else {
                        t.ok(fired[o] === 1, Ext.String.format("'{0}' event fired", o));
                    }
                }

                t.isGreater(record.getEndDate(), record.modified.EndDate, 'Dragged end-handle, EndDate changed');
                t.notOk(record.modified.StartDate, 'StartDate unchanged');
                record.setResizable('start');

                next();
            },

            // Drag start resize handle bar 100px to the left
            { action : 'drag', target : '.sched1 .sch-resizable-handle-start', by : [-100, 0] },

            function (next, el) {

                t.isLess(record.getStartDate(), record.modified.StartDate, 'Dragged start-handle, StartDate changed, Resizable=start');
                record.set('Resizable', false);

                next();
            },

            { action : 'moveCursorTo', target : '.sched1 .sch-event' },

            function (next, el) {

                t.elementIsNotVisible(Ext.fly(el).down('.sch-resizable-handle-start'), 'Resize handle not visible when hovering an event with Resizable=false');
                record.reject();

                record.set('Resizable', 'end');
                record.commit();

                t.notOk(t.isElementVisible('.sched1 .sch-resizable-handle-start'), 'Starting resize handler is not visible, so no resize operations is possible')

                next();
            },

            function (next) {
                scheduler.on('beforeeventresize', function () {
                    return false;
                });

                for (var o in fired) {
                    fired[o] = 0;
                }
                next();
            },

            { action : 'drag', target : '.sched1 .sch-resizable-handle-end', by : [100, 0] },

            function (next, el) {
                delete fired.beforeeventresize;

                // Make sure no events were fired, e.g. operation didn't start
                for (var o in fired) {
                    t.is(fired[o], 0, Ext.String.format("'{0}' event not fired since false was returned by beforeeventresize handler", o));
                }

                t.wontFire(scheduler, 'beforeeventresize', 'Double clicking a resize handle should not trigger any resize activity');
                t.wontFire(scheduler, 'eventresizestart', 'Double clicking a resize handle should not trigger any resize activity');
                t.wontFire(scheduler, 'eventresizeend', 'Double clicking a resize handle should not trigger any resize activity');
                t.doubleClick('.sched1 .sch-resizable-handle-end', next);
            }
        );
    })

    t.it('Should finalize if mouse only moves a little', function (t) {
        var scheduler = t.getScheduler({ cls : 'sched2', renderTo : Ext.getBody(), height : 200 });

        t.firesOnce(scheduler, 'beforeeventresize')
        t.firesOnce(scheduler, 'eventresizestart')
        t.firesOnce(scheduler, 'eventresizeend')

        t.chain(
            { waitFor : 'eventsToRender', args : scheduler },

            { drag : '.sched2 .sch-resizable-handle-end', by : [3, 0] }
        );
    })
})
