StartTest(function(t) {

    function getContext(t, config) {
        var fired;

        config = config || {};

        var scheduler = t.getScheduler(Ext.apply({
            multiSelect : true,
            renderTo : Ext.getBody(),
            rowHeight: 30,
            dragConfig : {
                showTooltip : false
            },
            eventStore : t.getEventStore({
                data: [
                    { Id: 'e10', ResourceId: 'r1', Name: 'Assignment 1', StartDate: "2011-01-04", EndDate: "2011-01-06" },
                    { Id: 'e11', ResourceId: 'r2', Name: 'Assignment 1', StartDate: "2011-01-05", EndDate: "2011-01-08" }
                ]
            })
        }, config));

        var fired = {
            'beforeeventdrag' : 0,
            'eventdragstart' : 0,
            'eventdrop' : 0,
            'aftereventdrop' : 0
        };

        var nbrEvents = scheduler.getEventStore().getCount();

        scheduler.on({
            'beforeeventdrag' : function() { 
                if (arguments[0] instanceof Sch.view.SchedulerGridView &&
                    arguments[1] instanceof Sch.model.Event &&
                    Ext.isFunction(arguments[2].getTarget))
                {
                    fired.beforeeventdrag++; 
                }
            },
            'eventdragstart' : function() { 
                if (arguments[0] instanceof Sch.view.SchedulerGridView &&
                    arguments[1] instanceof Array &&
                    arguments[1].length === nbrEvents &&
                    arguments[1][0] instanceof Sch.model.Event) 
                {   
                    fired.eventdragstart++; 
                }
            },
            'eventdrop' : function() { 
                if (arguments[0] instanceof Sch.view.SchedulerGridView &&
                    arguments[1] instanceof Array &&
                    arguments[1].length === nbrEvents &&
                    arguments[1][0] instanceof Sch.model.Event && 
                    arguments[2] === false)  // The 'isCopy' argument, copying is not yet supported
                {   
                    fired.eventdrop++;  
                }
            },
            'aftereventdrop' : function() { 
                if (arguments[0] instanceof Sch.view.SchedulerGridView)
                {   
                    fired.aftereventdrop++;  
                }
            }
        });

        var testSteps = [
            { waitFor : 'eventsToRender' },

            function(next) {
                scheduler.getEventSelectionModel().select(scheduler.getEventStore().getRange());
                next();
            },
                                                           // should increase date, and move to new resource
            { 
                action  : 'drag', 
                target  : '.sch-event', 
                by      : function() {
                    return scheduler.orientation === 'horizontal' ? [100, 30] : [100, 50];
                }
            },

            function(next, el) {
                var draggedRecord = scheduler.getSchedulingView().resolveEventRecord(el);
                var diff = draggedRecord.getStartDate() - draggedRecord.modified.StartDate;

                for (var o in fired) {
                    t.ok(fired[o] === 1, Ext.String.format("'{0}' event fired", o));
                }

                scheduler.getEventStore().each(function(ev, all, i) {
                    t.is(ev.getStartDate() - ev.modified.StartDate, diff, 'StartDate ' + i + ' changed');
                    t.is(ev.getEndDate() - ev.modified.EndDate, diff, 'EndDate ' + i + ' changed');
                });

                t.is(scheduler.getSchedulingView().getEventNodes().getCount(), 2, 'Still 2 events rendered');
                t.selectorCountIs('.sch-event-selected', 2, 'Events have selected cls applied after drop');
                
                next();
            },

            // Drag back again
            { action : 'drag', target : '.sch-event', by : function() { return scheduler.orientation === 'horizontal' ? [-100, -30] : [-100, -50]; } },

            function(next) {
                t.is(scheduler.getEventStore().getModifiedRecords().length, 0, 'No modified records');
                t.selectorCountIs('.sch-event-selected', 2, 'Events have selected cls applied after drop');
                next();
            }
        ];

        return {
            scheduler : scheduler,
            steps     : testSteps
        };
    }

    t.it('Should support drag drop in horizontal grid', function(t) {
        var ctx = getContext(t);
        var scheduler = ctx.scheduler;
        
        t.firesOk(scheduler.eventStore, {
            update  : 4
        }, "2 updates per drag and drop - 1 per event")
        
        t.chain(
            ctx.steps,

            function(next) {
                scheduler.destroy();
            }
        );
    });

    t.it('Should support drag drop in horizontal tree', function(t) {
        var ctx = getContext(t, {
            __tree : true
        });
        var scheduler = ctx.scheduler;
        
        t.firesOk(scheduler.eventStore, {
            update  : 4
        }, "2 updates per drag and drop - 1 per event")

        t.chain(
            ctx.steps,

            function(next) {
                scheduler.destroy();
            }
        );
    });

    t.it('Should support drag drop in vertical mode', function(t) {
        var ctx = getContext(t, {
            orientation : 'vertical'
        });

        var scheduler = ctx.scheduler;
        
        t.firesOk(scheduler.eventStore, {
            update  : 4
        }, "2 updates per drag and drop - 1 per event")

        t.chain(
            ctx.steps
        );
    });
})
