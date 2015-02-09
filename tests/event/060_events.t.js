StartTest(function(t) {

    var scheduler = t.getScheduler({ forceFit : true, renderTo : Ext.getBody(), width : 400 }, 1);

    t.waitForEventsToRender(scheduler, function() {
        var taskEl = t.getFirstEventEl(scheduler),
            firstTimeCellEl = t.getFirstScheduleCellEl(scheduler),
            task = scheduler.getSchedulingView().resolveEventRecord(taskEl);

        function verifyEventSignature() {
            /**
             * @event event_xxx
             * Fires when xxx
             * @param {SchedulerView}    scheduler The scheduler view object
             * @param {Sch.model.Event}  eventRecord The event record
             * @param {Ext.EventObject}  e The event object
             */
            t.is(arguments[0], scheduler.getSchedulingView(), 'Correct 1st argument');
            t.is(arguments[1], task, 'Correct 2nd argument');
            t.ok(!!arguments[2].getTarget, 'Correct 3rd argument');
        }

        function verifyScheduleEventSignature() {

            /**
             * @event scheduledblclick
             * Fires after a doubleclick on the schedule area
             * @param {SchedulerView} scheduler The scheduler object
             * @param {Date} clickedDate The clicked date
             * @param {Int} rowIndex The row index
             * @param {Ext.EventObject} e The event object
             */
            t.is(arguments[0], scheduler.getSchedulingView(), 'Correct 1st argument');
            t.ok(arguments[1] instanceof Date, 'Correct 2nd argument');
            t.is(arguments[2], 0, 'Correct 3rd argument');
            t.isaOk(arguments[3], Sch.model.Resource, 'Correct 3rd argument');
            t.ok(!!arguments[4].getTarget, 'Correct 4th argument');
        }

        scheduler.on({
            'eventclick'            : verifyEventSignature,
            'eventdblclick'         : verifyEventSignature,
            'eventcontextmenu'      : verifyEventSignature,

            'scheduleclick'         : verifyScheduleEventSignature,
            'scheduledblclick'      : verifyScheduleEventSignature,
            'schedulecontextmenu'   : verifyScheduleEventSignature,

            'eventmouseenter'       : verifyEventSignature,
            'eventmouseleave'       : verifyEventSignature

        });

        Ext.each(["eventdblclick", "eventcontextmenu", "eventkeydown", "eventkeyup", "scheduledblclick", "schedulecontextmenu"], function(evName) {
            t.willFireNTimes(scheduler, evName, 1);
        });

        Ext.each(["eventmouseenter", "eventmouseleave"], function(evName) {
            // These events bubble in IE8
            t.firesAtLeastNTimes(scheduler, evName, 1);
        });

        Ext.each(["eventclick", "scheduleclick"], function(evName) {
            t.willFireNTimes(scheduler, evName, 3);
        });

        t.ok(firstTimeCellEl, 'Time cell found');

        t.chain(
            { click : taskEl },
            { doubleClick : taskEl },
            { rightClick : taskEl },
            { type : '[ENTER]', target : taskEl },

            { moveCursorTo : '.x-column-header' },

            function(next) {
                Ext.select('.sch-event').remove();
                next();
            },

            { click : firstTimeCellEl, offset : [5, 5] },
            { doubleClick : firstTimeCellEl, offset : [5, 5] },
            { rightClick : firstTimeCellEl, offset : [5, 5] }
        )
    });
})
