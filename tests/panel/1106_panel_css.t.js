StartTest(function(t) {
    var scheduler = t.getScheduler({
        renderTo        : Ext.getBody()
    });
    
    t.waitForRowsVisible(scheduler, function() {
        // Verify CSS classes
        t.selectorNotExists('.sch-vertical', 'No vertical CSS class found');
        t.hasCls(scheduler.el, 'sch-horizontal', 'Panel has horizontal CSS class');

        scheduler.setOrientation('vertical');
        
        t.hasCls(scheduler.el, 'sch-vertical', 'Panel has vertical CSS class');
        t.selectorNotExists('.sch-horizontal', 'No horizontal CSS class found');
        
        scheduler.setOrientation('horizontal');
    })    
})    

