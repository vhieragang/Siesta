StartTest(function(t) {
    var scheduler = t.getScheduler({
        renderTo : Ext.getBody()
    });

    var scheduler2 = t.getScheduler({
        renderTo : Ext.getBody()
    });

    t.pass('Two schedulers rendered ok');
    t.ok(scheduler2.getSchedulingView().eventPrefix !== scheduler.getSchedulingView().eventPrefix, 'Each scheduler has unique eventPrefix property');
})    
