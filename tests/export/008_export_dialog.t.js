StartTest({
    overrideSetTimeout  : false
},
function (t) {

    t.diag('Setup');
    t.expectGlobals('MyExportPlugin', 'MyExportDialog');
    t.defaultTimeout = 50000;

    Ext.define('MyExportDialog', {
        extend  : 'Sch.widget.ExportDialog',
        x       : 0,
        y       : 0,
        buildButtons : function (buttonsScope) {
            return [{
                xtype   : 'button',
                scale   : 'medium',
                cls     : 'test-export-button',
                text    : buttonsScope.exportButtonText,
                handler : function () {
                    if (this.form.isValid()) {
                        this.fireEvent('showprogressbar');
                        this.plugin.doExport(this.form.getValues());
                    }
                },
                scope   : buttonsScope
            },
            {
                xtype   : 'button',
                scale   : 'medium',
                cls     : 'test-cancel-button',
                text    : buttonsScope.cancelButtonText,
                handler : function () {
                    this.destroy();
                },
                scope   : buttonsScope
            }];
        }
    });

    Ext.define('MyExportPlugin', {
        extend                  : 'Sch.plugin.Export',
        exportDialogClassName   : 'MyExportDialog',
        onRequestSuccess : function (response) {
            var text = Ext.JSON.decode(response.responseText);

            t.pass('Request successfull.');

            if (text.success) {
                this.callParent(arguments);
            } else {
                t.fail('Export failed: ' + text.msg);
            }
        },
        onRequestFailure: function (response) {
            this.callParent(arguments);

            t.fail("Request failed.");
        }
    });

    var exportPlugin = Ext.create('MyExportPlugin', {
        printServer         : '../examples/export/server.php',
        openAfterExport     : false,
        exportDialogConfig  : {
            range : 'date'
        }
    });

    var scheduler = t.getScheduler({
        renderTo : Ext.getBody(),
        plugins  : exportPlugin
    });

    var columnWidth = null;

    t.chain(
        { waitForRowsVisible : scheduler },

        //Test default export
        function (next) {
            columnWidth = scheduler.getSchedulingView().timeAxisViewModel.getTickWidth();
            scheduler.showExportDialog();

            next();
        },
        { waitForSelector : '.sch-exportdialog', desc: 'Export dialog visible' },
        function (next) {
            t.is(Ext.select('.sch-export-dialog-range .x-form-field').first().getValue(), 'Date range', 'Default dialog field value changed' );
            next();
        },
        function (next) {
            t.waitForEvent(exportPlugin, 'hidedialogwindow', next, null, 150000);

            t.click('.test-export-button', function () {});
        },

        //Test date range export
        function (next) {
            scheduler.showExportDialog();
            next();
        },
        { waitForSelector : '.sch-export-dialog-range' },
        { click : '.sch-export-dialog-range' },
        { click : function () { return Ext.select('.x-boundlist').first().select('.x-boundlist-item').item(0); }},

        function (next) {
            t.waitForEvent(exportPlugin, 'hidedialogwindow', next, null, 150000);

            t.click('.test-export-button', function () {});
        },

        //Test current view export
        function (next) {
            scheduler.showExportDialog();
            next();
        },
        { waitForSelector : '.sch-export-dialog-range' },
        { click : '.sch-export-dialog-range' },
        { click : function () { return Ext.select('.x-boundlist').first().select('.x-boundlist-item').item(2); }},
        { drag : '.x-slider-thumb', by: [-30, 0] },

        function (next) {
            t.waitForEvent(exportPlugin, 'hidedialogwindow', next, null, 150000);

            t.click('.test-export-button', function () {});
        },

        function () {
            t.is(scheduler.getSchedulingView().timeAxisViewModel.getTickWidth(), columnWidth, 'Column width properly restored after export');
        }
    );
});
