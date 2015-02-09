StartTest(function(t) {

    var scheduler = t.getScheduler({
        renderTo    : document.body,
        viewPreset  : 'dayAndWeek',
        startDate   : new Date(2012, 5, 2),
        endDate     : new Date(2012, 5, 11)
    });

    t.waitForRowsVisible(scheduler, function () {

        scheduler.eventStore.add({
            ResourceId  : scheduler.resourceStore.first().data.Id,
            StartDate   : new Date(2012, 5, 5),
            EndDate     : new Date(2012, 5, 6),
            Cls         : 'foo'
        });

        t.selectorExists('.foo', 'Should find event in normal state');

        scheduler.getTimeAxis().filterBy(function(tick) {
            return tick.start.getDay() === 6 || tick.start.getDay() === 0;
        });

        t.selectorNotExists('.foo', 'Should not find event in filtered state');

        scheduler.getTimeAxis().clearFilter();

        t.selectorExists('.foo', 'Should find event after clearing filter');
    });
})    
