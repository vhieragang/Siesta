StartTest(function(t) {
    //======================================================================================================================================================================================================================================================
    t.diag('Sanity')

    window.top.Function.prototype.bind = Function.prototype.bind;

        // bypass alert warning since we're not loading CSS
    window.alert = Ext.emptyFn;

    // http://www.sencha.com/forum/showthread.php?286448-Global-variable-leaks&p=1047477#post1047477
    t.expectGlobal('baseUrl', 'path');

    Ext.Loader.setConfig({
        enabled             : true, 
        disableCaching      : false 
    });
    
    var extFolder = t.getExtBundleFolder();

    if (!extFolder) {
        t.fail('Ext JS folder not found');
        return;
    }

    Ext.Loader.setPath('Sch', '../js/Sch')
    Ext.Loader.setPath('Ext', extFolder + '/src')
    Ext.Loader.setPath('Ext.core', extFolder + '/src/core/src')

    t.requireOk([
        'Sch.column.Summary',
        'Sch.plugin.CurrentTimeLine',
        'Sch.plugin.DragSelector',
        'Sch.plugin.EventEditor',
        'Sch.plugin.EventTools',
        'Sch.plugin.Export',
        'Sch.plugin.Lines',
        'Sch.plugin.Pan',
        'Sch.plugin.Printable',
        'Sch.plugin.ResourceZones',
        'Sch.plugin.SimpleEditor',
        'Sch.plugin.TimeGap',
        'Sch.plugin.TreeCellEditing',
        'Sch.plugin.Zones',
        'Sch.panel.SchedulerGrid'
    ], function () {
        // Required as of 4.1.1-rc2
        var as = t.beginAsync();
        Ext.onReady(function() {
            t.endAsync(as);
            t.ok(Sch.panel.SchedulerGrid, "Sch.panel.SchedulerGrid is here")

            var schedulerGrid = t.getScheduler();

            schedulerGrid.render(Ext.getBody());

            t.ok(schedulerGrid.getEl(), 'Scheduler grid has been rendered')
        })
    })
})    
