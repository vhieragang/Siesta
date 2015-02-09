StartTest(function(t) {
    var scheduler, view, isVertical, tickWidth;

    function setup(config) {
        config      = config || {};
        
        if (scheduler) scheduler.destroy()

        scheduler   = t.getScheduler(Ext.apply({
            width                   : 800,
            heigh                   : 600,
            
            startDate               : new Date(2010, 0, 1),
            endDate                 : new Date(2010, 2, 1),
            
            eventStore              : t.getEventStore({
                data        : [
                    {
                        Id          : 1,
                        Name        : 'Test event',
                        ResourceId  : 'r1',
                        StartDate   : new Date(2009, 11, 1),
                        EndDate     : new Date(2010, 3, 1)
                    }
                ]
            }),
            
            resourceStore           : config.__tree ? t.getResourceTreeStore() : t.getResourceStore(),
            
            enableDragCreation      : false,
            renderTo                : Ext.getBody(),
            dragConfig              : { showTooltip : false }
        }, config));
        
        view            = scheduler.getSchedulingView()
        isVertical      = scheduler.getOrientation() === 'vertical'
        tickWidth       = scheduler.timeAxisViewModel.getTickWidth()
    }

    var testSteps = [
        { waitFor : 'eventsToRender' }, 
        
        // moving forward in time
        { 
            drag    : '.sch-event', 
            offset  : [ 30, 10 ], 
            by      : function () { 
                return isVertical ? [ view.resourceColumnWidth, tickWidth ] : [ tickWidth, scheduler.getRowHeight() ]
            } 
        }, 

        function (next, el) {
            var event   = scheduler.getSchedulingView().resolveEventRecord(el);
            
            t.isApprox(
                Sch.util.Date.getDurationInUnit(event.modified.StartDate, event.get('StartDate'), scheduler.timeAxis.mainUnit),
                1,
                'Event moved approximately on 1 unit'
            )
            
            t.isApprox(
                Sch.util.Date.getDurationInUnit(event.modified.EndDate, event.get('EndDate'), scheduler.timeAxis.mainUnit),
                1,
                'Event moved approximately on 1 unit'
            )
            
            t.is(event.getResourceId(), 'r2', 'Event has been re-assigned to another resource')
            
            event.commit()
            
            next();
        },
        
        // moving backward in time
        { 
            drag    : '.sch-event', 
            offset  : function () {
                return isVertical ? [ 10, 300 ] : [ 300, 10 ]
            }, 
            by      : function () { 
                return isVertical ? [ -view.resourceColumnWidth, -tickWidth ] : [ -tickWidth, -scheduler.getRowHeight() ]
            } 
        }, 

        function (next, el) {
            var event   = scheduler.getSchedulingView().resolveEventRecord(el);
            
            t.isApprox(
                Sch.util.Date.getDurationInUnit(event.modified.StartDate, event.get('StartDate'), scheduler.timeAxis.mainUnit),
                -1,
                'Event moved approximately on 1 unit'
            )
            
            t.isApprox(
                Sch.util.Date.getDurationInUnit(event.modified.EndDate, event.get('EndDate'), scheduler.timeAxis.mainUnit),
                -1,
                'Event moved approximately on 1 unit'
            )
            
            t.is(event.getResourceId(), 'r1', 'Event has been re-assigned to another resource')
            
            next();
        }
    ]
    // eof test steps

    setup();
    t.diag('Plain horizontal scheduler');

    t.chain(
        testSteps,

        function(next) {
            t.diag('Tree scheduler');
            setup({ __tree : true });
            next()
        },
        testSteps,

        function(next) {
            t.diag('Vertical scheduler');
            setup({ orientation : 'vertical' });
            next()
        },
        testSteps
    );
})    