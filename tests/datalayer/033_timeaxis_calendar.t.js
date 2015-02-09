StartTest(function (t) {
    var g;
    
    var setup = function (config) {
        g && g.destroy();
        g = t.getScheduler(Ext.apply({
            mode    : 'calendar'
        }, config));
        
        return g.timeAxis;
    }
    
    t.it('Time axis works correct with "week" preset', function (t) {
        var timeAxis = setup({
            calendarViewPreset  : 'week',
            startDate   : new Date(2014, 4, 28, 12)
        });
        
        t.it('Should round time span to week', function (t) {
            t.is(timeAxis.getStart(), new Date(2014, 4, 26), 'Start date is correct');
            t.is(timeAxis.getEnd(), new Date(2014, 5, 2), 'End date is correct');

            t.ok(timeAxis.dateInAxis(new Date(2014, 5, 1)), 'dateInAxis true');
        });
        
        t.it('Time axis should contain whole week when set with few days span', function (t) {
            timeAxis.setTimeSpan(new Date(2014, 4, 13), new Date(2014, 4, 16));
            
            t.is(timeAxis.getStart(), new Date(2014, 4, 12), 'Start date is correct');
            t.is(timeAxis.getEnd(), new Date(2014, 4, 19), 'End date is correct');
            
            t.ok(timeAxis.dateInAxis(new Date(2014, 4, 15)), 'dateInAxis true');
        });
        
        t.it('Time axis should contain only week that comprises first date of new time span', function (t) {
            timeAxis.setTimeSpan(new Date(2014, 4, 14), new Date(2014, 4, 21));
            
            t.is(timeAxis.getStart(), new Date(2014, 4, 12), 'Start date is correct');
            t.is(timeAxis.getEnd(), new Date(2014, 4, 19), 'End date is correct');
            
            t.ok(timeAxis.dateInAxis(new Date(2014, 4, 17)), 'dateInAxis true');
        });
    });
    
    t.it('Time axis works correct with "day" preset', function (t) {
        var timeAxis = setup({
            calendarViewPreset  : 'day',
            startDate   : new Date(2014, 4, 28, 12)
        });
        
        t.it('Should round time span to one day', function (t) {
            t.is(timeAxis.getStart(), new Date(2014, 4, 28), 'Start date is correct');
            t.is(timeAxis.getEnd(), new Date(2014, 4, 29), 'End date is correct');
            
            t.ok(timeAxis.dateInAxis(new Date(2014, 4, 28, 13)), 'dateInAxis true');
        });
        
        t.it('Time axis should contain whole day when set with few hours span', function (t) {
            timeAxis.setTimeSpan(new Date(2014, 4, 28, 23), new Date(2014, 4, 28, 23, 30));
            
            t.is(timeAxis.getStart(), new Date(2014, 4, 28), 'Start date is correct');
            t.is(timeAxis.getEnd(), new Date(2014, 4, 29), 'Start date is correct');
            
            t.ok(timeAxis.dateInAxis(new Date(2014, 4, 28, 12)), 'dateInAxis true');
        });
        
        t.it('Time axis should contain only first day of new time span', function (t) {
            timeAxis.setTimeSpan(new Date(2014, 4, 14, 23), new Date(2014, 4, 24, 23));
            
            t.is(timeAxis.getStart(), new Date(2014, 4, 14), 'Start date is correct');
            t.is(timeAxis.getEnd(), new Date(2014, 4, 15), 'Start date is correct');
            
            t.ok(timeAxis.dateInAxis(new Date(2014, 4, 14, 18)), 'dateInAxis true');
        });
    });
});