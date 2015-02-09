StartTest(function(t) {
    /* global MyExport */
    t.expectGlobals('0', 'MyExport'); // We love IE

    // Here we check if Sch.plugin.Export calls template methods beforeExport and afterExport

    var scheduler,
        beforeExportCalled  = 0,
        afterExportCalled   = 0;

    Ext.define('MyExport', {
        extend          : 'Sch.plugin.Export',
        beforeExport    : function (comp, ticks) {
            beforeExportCalled++;
            t.ok(comp === scheduler, 'Scheduler provided');
            t.ok(ticks.length, 'Ticks array provided');
        },
        afterExport     : function (comp) {
            afterExportCalled++;
            t.ok(comp === scheduler, 'Scheduler provided');
        }
    });

    var plugin      = new MyExport({
        openAfterExport : false,
        printServer     : 'something',
        test            : true
    });

    scheduler       = t.getScheduler({
        renderTo    : Ext.getBody(),
        plugins     : plugin
    });

    t.waitForRowsVisible(scheduler, function () {

        var async = t.beginAsync(45000);

        plugin.doExport({
            format              : "Letter",
            orientation         : "portrait",
            range               : "complete",
            showHeader          : true,
            exporterId          : 'multipage'
        }, function (result) {

            var htmls = result.htmlArray;

            t.ok(htmls.length, "Some content exported");

            t.is(beforeExportCalled, 1, "beforeExport was called");
            t.is(afterExportCalled, 1, "afterExport was called");

            t.endAsync(async);
        });

    });

});
