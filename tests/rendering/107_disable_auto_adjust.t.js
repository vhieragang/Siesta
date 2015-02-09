StartTest(function (t) {
    
    var scheduler, schedulingView
    
    var setup = function (done) {
        if (scheduler) scheduler.destroy()
        
        scheduler = new Sch.panel.SchedulerGrid({
            autoAdjustTimeAxis  : false,
            
            columns     : [ { width : 50 } ],
            
            startDate   : new Date(2013, 8, 1),
            endDate     : new Date(2013, 9, 1),
            
            renderTo    : document.body,
            height      : 300,
            width       : 600,
        
            resourceStore   : new Sch.data.ResourceStore({ data : [ { Id : 1 } ] }),
            eventStore      : new Sch.data.EventStore({ 
                data : [ 
                    { Id : 1, ResourceId : 1, StartDate : new Date(2013, 8, 1), EndDate : new Date(2013, 9, 1) } 
                ] 
            })
        });
        
        schedulingView  = scheduler.getSchedulingView()
        
        t.waitForEventsToRender(scheduler, done)
    }
    
    t.it('Disabling the auto adjust should render the scheduler with exact provided start/end dates', function (t) {
        t.chain(
            setup,
            function () {
                var ticks       = scheduler.timeAxis.getTicks()
                
                t.is(ticks[ 0 ].start, new Date(2013, 8, 1), 'Correct start tick')
                t.is(ticks[ ticks.length - 1 ].end, new Date(2013, 9, 1), 'Correct end tick')
                
                t.is(schedulingView.getDateFromCoordinate(0, null, true), new Date(2013, 8, 1), "Correctly rendererd start tick")
                t.is(schedulingView.getDateFromCoordinate(schedulingView.el.dom.scrollWidth, null, true), new Date(2013, 9, 1), "Correctly rendererd start tick")
            }
        )
    })
});
