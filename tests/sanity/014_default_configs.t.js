StartTest(function(t) {
    
    //======================================================================================================================================================================================================================================================
    t.diag('Make sure all the defaults have been properly applied through the various mixins');
    
    var scheduler = t.getScheduler({ renderTo : Ext.getBody() }),
        view = scheduler.getSchedulingView();

    t.notOk(view.overItemCls, 'overItemCls is blank');
    t.notOk(view.trackOver, 'trackOver not enabled for the scheduling view');
    t.is(view.loadingText, 'Loading events...', 'Correct loading text');


    t.hasCls(scheduler.el, 'sch-schedulerpanel', 'Found "sch-schedulerpanel" on panel el');
    t.hasCls(view.el, 'sch-timelineview', 'Found "sch-timelineview" on view el');
    t.hasCls(view.el, 'sch-schedulerview', 'Found "sch-schedulerview" on view el');

    if (Ext.isIE) t.expectGlobal('schedulerDebugWin')

    Sch.util.Debug.runDiagnostics();
    t.pass('Should be able to run diagnostics without any exceptions or errors');

    scheduler.destroy();
})
