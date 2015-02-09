StartTest(function (t) {
    t.it('View should return correct date for coordinate in filtered timeaxis', function (t) {
        var sched = Ext.create("Sch.panel.SchedulerGrid", {
            height     : 300,
            width      : 1000,
            renderTo   : Ext.getBody(),
            border     : true,
            startDate  : new Date(2011, 1, 14),
            endDate    : new Date(2011, 1, 29),
            viewPreset : 'weekAndDayLetter',
            margin     : '10 0 0 0',
            forceFit   : true,

            resourceStore : t.getResourceStore(),
            eventStore    : t.getEventStore()
        });
        
        sched.getTimeAxis().filterBy(function (tick) {
            return tick.start.getDay() !== 6 && tick.start.getDay() !== 0;
        });
        
        var view        = sched.getSchedulingView();
        var tickWidth   = sched.timeAxisViewModel.getTickWidth();
        var correctDate = new Date(2011, 2, 4);
        
        t.chain(
            { waitForRowsVisible : sched },
            function (next) {
                t.isDateEqual(view.getDateFromX(tickWidth * 14.1, 'floor'), correctDate, 'Date in last tick is correct');
                t.isDateEqual(view.getDateFromX(tickWidth * 14.4, 'floor'), correctDate, 'Date in last tick is correct');
                t.isDateEqual(view.getDateFromX(tickWidth * 14.8, 'floor'), correctDate, 'Date in last tick is correct');
            }
        );
    });
});