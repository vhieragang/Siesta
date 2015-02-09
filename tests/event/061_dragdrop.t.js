StartTest(function (t) {
    var scheduler;
    var fired;

    function getScheduler(config) {
        config = config || {};

        var s = t.getScheduler(Ext.apply({
            enableDragCreation : false,
            renderTo           : Ext.getBody(),
            dragConfig         : {
                showTooltip : false
            }
        }, config));

        fired = {
            'beforeeventdrag' : 0,
            'eventdragstart'  : 0,
            'eventdrop'       : 0,
            'aftereventdrop'  : 0
        };

        s.on({
            'beforeeventdrag' : function () {
                if (arguments[0] instanceof Sch.view.SchedulerGridView &&
                    arguments[1] instanceof Sch.model.Event && !!arguments[2].getTarget) {
                    fired.beforeeventdrag++;
                }
            },
            'eventdragstart'  : function () {
                if (arguments[0] instanceof Sch.view.SchedulerGridView &&
                    arguments[1] instanceof Array &&
                    arguments[1][0] instanceof Sch.model.Event) {
                    fired.eventdragstart++;
                }
            },
            'eventdrop'       : function () {
                if (arguments[0] instanceof Sch.view.SchedulerGridView &&
                    arguments[1] instanceof Array &&
                    arguments[1][0] instanceof Sch.model.Event &&
                    arguments[2] === false)  // The 'isCopy' argument
                {
                    fired.eventdrop++;
                }
            },
            'aftereventdrop'  : function () {
                if (arguments[0] instanceof Sch.view.SchedulerGridView) {
                    fired.aftereventdrop++;
                }
            }
        });

        return s;
    }

    var getDragOffset = function () {
        return scheduler.getOrientation() === 'horizontal' ? [50, 0] : [0, 50];
    }

    var getTestSteps = function (t) {
        return [
            { drag : '.sch-event', by : getDragOffset },

            function (next, el) {
                var draggedRecord = t.draggedRecord = scheduler.getSchedulingView().resolveEventRecord(el);

                for (var o in fired) {
                    t.ok(fired[o] === 1, Ext.String.format("'{0}' event fired", o));
                }

                t.ok(draggedRecord.get('StartDate') > draggedRecord.modified.StartDate, 'StartDate changed');
                t.ok(draggedRecord.get('EndDate') > draggedRecord.modified.EndDate, 'EndDate changed');

                t.diag('Prevent drag using Draggable = false');
                draggedRecord.set('Draggable', false);

                draggedRecord.commit();
                t.ok(!draggedRecord.dirty, 'Task not dirty after commit');

                for (var o in fired) {
                    fired[o] = 0;
                }

                next();
            },

            { action : 'drag', by : getDragOffset },

            function (next) {
                t.diag('Prevent drag using beforeeventdrag handler');
                t.draggedRecord.set('Draggable', true);
                t.draggedRecord.commit();

                scheduler.on('beforeeventdrag', function () {
                    return false;
                });
                next();
            },

            { action : 'drag', target : '.sch-event', by : getDragOffset },

            function (next) {
                delete fired.beforeeventdrag;

                // Make sure no events were fired, e.g. operation didn't start
                for (var o in fired) {
                    t.ok(fired[o] === 0, Ext.String.format("'{0}' event not fired since false was returned by beforeeventdrag handler", o));
                }
                t.is(scheduler.eventStore.getModifiedRecords(), 0, 'Task not dirty since task was not moved.');
                next();
            }
        ];
    }

    t.it('Plain horizontal scheduler', function (t) {

        scheduler = getScheduler();

        t.chain(
            getTestSteps(t),

            function (next) {
                scheduler.destroy();
            }
        )
    });

    t.it('Tree scheduler', function (t) {
        scheduler = getScheduler({
            __tree : true
        });

        t.chain(
            getTestSteps(t),

            function (next) {
                scheduler.destroy();
            }
        );
    });

    t.it('Vertical scheduler', function (t) {
        scheduler = getScheduler({
            orientation : 'vertical'
        });

        t.chain(
            getTestSteps(t),

            function (next) {
                scheduler.destroy();
            }
        );
    });
})    