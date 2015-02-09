StartTest(function(t) {
    t.waitForSelector('.sch-event', function() {
        // refresh the view one more time, in case the example finished the rendering before the 
        // "expiration.js" was preloaded
        t.cq1('schedulerpanel').getSchedulingView().refresh()
        
        t.pass('Scheduler trial example rendered without exception');

        t.selectorExists('.bryntum-trial', 'Should find trial logo after render')
    });
});
