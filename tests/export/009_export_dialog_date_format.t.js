StartTest(function(t) {
    /* global MyExportPlugin */
    t.expectGlobals('MyExportPlugin');

    Ext.define('MyExportPlugin', {
        extend              : 'Sch.plugin.Export',
        doExport            : function (config) {
            t.is(config.dateFrom, this.win.startDate, 'proper start date');
            t.is(config.dateTo, this.win.endDate, 'proper end date');
        }
    });

    // checks that ExportDialog properly converts range dates before passing them to Export.doExport (#1672)
    t.it('Should properly convert range dates at default before passing them to export', function (t) {

        var exportPlugin;

        exportPlugin    = new MyExportPlugin();

        var scheduler   = t.getScheduler({
            renderTo    : Ext.getBody(),
            plugins     : exportPlugin
        });

        t.chain(
            { waitForRowsVisible : scheduler },

            function (next) {
                scheduler.showExportDialog();

                next();
            },

            { waitForSelector : '.sch-exportdialog', desc : 'Export dialog visible' },
            { waitForSelector : '.sch-export-dialog-range' },
            { click : '.sch-export-dialog-range' },
            { click : function () { return Ext.select('.x-boundlist').first().select('.x-boundlist-item').item(1); } },
            { click : '>> button[text=Export]' },
            function () {
                scheduler.destroy();
            }
        );
    });

    t.it('Should properly convert range dates before passing them to export', function (t) {
        // checks that ExportDialog properly converts range dates before passing them to Export.doExport (#1506)

        var exportPlugin = new MyExportPlugin({
            exportDialogConfig  : {
                dateRangeFormat : 'd-m-Y'
            }
        });

        var scheduler   = t.getScheduler({
            renderTo    : Ext.getBody(),
            plugins     : exportPlugin
        });

        t.chain(
            { waitForRowsVisible : scheduler },

            function (next) {
                scheduler.showExportDialog();

                next();
            },

            { waitForSelector : '.sch-exportdialog', desc : 'Export dialog visible' },
            { waitForSelector : '.sch-export-dialog-range' },
            { click : '.sch-export-dialog-range' },
            { click : function () { return Ext.select('.x-boundlist').first().select('.x-boundlist-item').item(1); } },
            { click : '>> button[text=Export]' },
            function () {
                scheduler.destroy();
            }
        );
    });

    t.it('Should disable format and orientation fields in single page mode', function (t) {
        var scheduler   = t.getScheduler({
            renderTo    : Ext.getBody(),
            plugins     : new Sch.plugin.Export()
        });

        t.waitForRowsVisible(scheduler, function () {
            scheduler.showExportDialog();

            var plugin  = scheduler.plugins[0],
                form    = plugin.win.form;

            form.exportersField.setValue('singlepage');

            t.ok(form.formatField.disabled, 'Format field is disabled');
            t.ok(form.orientationField.disabled, 'Orientation field is disabled');

            form.exportersField.setValue('multipage');

            t.notOk(form.formatField.disabled, 'Format field is enabled');
            t.notOk(form.orientationField.disabled, 'Orientation field is enabled');
        });
    });
});
