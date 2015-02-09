StartTest(function (t) {

    t.diag('Setup');
    t.expectGlobals('MyExportPlugin', 'MyExportPluginError');

    var schedulerErrorAsync, schedulerAsync;

    Ext.define('MyExportPlugin', {
        extend  : 'Sch.plugin.Export',
        onRequestSuccess : function (response) {
            var text = Ext.JSON.decode(response.responseText);
            t.pass('Request successfull.');

            if (text.success) {
                this.callParent(arguments);
                checkFileExists(text.url);
            } else {
                t.fail('Export failed: ' + text.msg);
            }

            t.endAsync(schedulerAsync);
        },
        onRequestFailure : function (response) {
            this.callParent(arguments);

            t.fail("Request failed.");

            t.endAsync(schedulerAsync);
        }
    });

    Ext.define('MyExportPluginError', {
        extend  : 'Sch.plugin.Export',
        onRequestFailure : function (response) {
            t.isCalled('unmask', this, 'Body unmasked.');

            this.callParent(arguments);

            t.pass('Error caught after returning server error.');

            t.endAsync(schedulerErrorAsync);
        }
    });

    var scheduler       = t.getScheduler({
            renderTo    : Ext.getBody(),
            plugins     : Ext.create('MyExportPlugin', {
                printServer     : '../examples/export/server.php',
                openAfterExport : false
            })
        }),
        schedulerError  = t.getScheduler({
            renderTo    : Ext.getBody(),
            plugins     : Ext.create('MyExportPluginError', {
                printServer     : 'export/002_check_error_handling.php',
                openAfterExport : false
            })
        }),
        checkFileExists = function (url) {
            t.wait('xhrResponse');

            Ext.Ajax.request({
                method  : 'HEAD',
                url     : url,
                success : function (response, opts) {
                    t.pass('File created');
                    t.ok(response.getResponseHeader('Content-Length'), 'File has some size');

                    t.endWait('xhrResponse');
                },

                failure : function (response, opts) {
                    t.fail("Request failed");

                    t.endWait('xhrResponse');
                }
            });
        };

    t.waitForRowsVisible(scheduler, function (result) {
        schedulerErrorAsync = t.beginAsync();
        schedulerError.doExport();

        schedulerAsync      = t.beginAsync(45000);
        scheduler.doExport();
    });
});
