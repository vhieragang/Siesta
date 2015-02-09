StartTest(function(t) {
    t.diag("Current timzone: " + t.getTimeZone())
    
    if (Ext.Date.isDST(new Date(2012, 9, 15, 0)) || 
        !Ext.Date.isDST(new Date(2012, 9, 14, 0))) {
        t.diag("Skipping the test because it's supposed to run in Chile timezone")
        return;
    }
    
    var DATE = Sch.util.Date;

    var ta = new Sch.data.TimeAxis();
    ta.reconfigure({
        unit: DATE.DAY,
        increment: 1,
        resolutionUnit: DATE.HOUR,
        resolutionIncrement: 1,
        weekStartDay: 1,
        mainUnit: DATE.DAY,
        shiftUnit: DATE.DAY,
        shiftIncrement: 1,
        defaultSpan: 1,

        start : new Date(2012, 9, 14),
        end : new Date(2012, 9, 15)
    });

    t.pass('Could generate DST crossing timeaxis');
    t.is(ta.getTicks().length, 2, 'Should generate 2 ticks');
})    
