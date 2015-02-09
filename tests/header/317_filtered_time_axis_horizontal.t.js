StartTest(function(t) {
    
    var scheduler = t.getScheduler({
        renderTo    : document.body,
        viewPreset  : 'dayAndWeek',
        startDate   : new Date(2012, 5, 4),
        endDate     : new Date(2012, 5, 11)
    });
    
    t.waitForRowsVisible(scheduler, function () {
        t.is(scheduler.el.select('.sch-column-header').getCount(), 8, '7 day cells found, + 1 week top row cell');
       
        scheduler.getTimeAxis().filterBy(function(tick) {
            return tick.start.getDay() === 6 || tick.start.getDay() === 0;
        });
        t.is(scheduler.el.select('.sch-column-header').getCount(), 3, '2 day cells found after filtering out weekdays, + 1 week top cell');

        t.is(scheduler.el.select('.sch-dayheadercell-6').getCount(), 1, '1 Saturday cell found');
        t.is(scheduler.el.select('.sch-dayheadercell-0').getCount(), 1, '1 Sunday cell found');
    });
})    
