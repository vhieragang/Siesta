StartTest(function (t) {
    t.it('Should get date from position', function (t) {
        var timeAxis = t.getTimeAxis('week', {
            start   : new Date(2014, 8, 22),
            end     : new Date(2014, 8, 29),
            mode    : 'calendar'
        });
        
        var viewModel = new Sch.view.model.TimeAxis({
            viewPreset  : 'week',
            mode        : 'calendar',
            timeAxis    : timeAxis
        });
        
        t.is(viewModel.getDateFromPosition([150, 50]), new Date(2014, 8, 22, 1, 15), 'Date is correct');
       
        t.is(viewModel.getDateFromPosition([164, 40]), new Date(2014, 8, 23, 1), 'Date is correct');
    });
    
    t.it('Should get position from date', function (t) {
        var timeAxis = t.getTimeAxis('week', {
            start   : new Date(2014, 8, 22),
            end     : new Date(2014, 8, 29),
            mode    : 'calendar'
        });
        
        var viewModel = new Sch.view.model.TimeAxis({
            viewPreset  : 'week',
            mode        : 'calendar',
            calendarRowsAmount  : 24,
            timeAxis    : timeAxis
        });
        
        t.is(viewModel.getPositionFromDate(new Date(2014, 8, 22, 1)), 40, 'Vertical position is correct');
        
        t.is(viewModel.getPositionFromDate(new Date(2014, 8, 23)), 0, 'Received top of the column');
        t.is(viewModel.getPositionFromDate(new Date(2014, 8, 23), true), 960, 'Received bottom of the column');
        
    });
});