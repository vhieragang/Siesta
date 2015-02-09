StartTest(function(t) {
    t.expectGlobal('0'); // We love IE

    var plugin      = Ext.create('Sch.plugin.Export', {
        openAfterExport : false,
        printServer     : 'something',
        test            : true
    });

    var scheduler   = t.getScheduler({
        renderTo : Ext.getBody(),
        plugins  : plugin
    });

    t.waitForRowsVisible(scheduler, function () {

        t.it('"Export range=`complete`"', function (t) {

            var async = t.beginAsync(45000);

            plugin.doExport({
                format      : 'Letter',
                orientation : 'portrait',
                range       : 'complete',
                showHeader  : true,
                exporterId  : 'multipage'
            }, function (result) {

                var htmls = result.htmlArray;

                t.is(htmls.length, 2, "2 pages exported");
                t.ok(htmls[1].html.indexOf("Mon 10 Jan") > -1, "Has column for `Mon 10 Jan`");

                t.endAsync(async);
             });

        });

        t.it("Export range=`dates` (from 2011-01-03 till 2011-01-05)", function (t) {

            var async = t.beginAsync(45000);

            plugin.doExport({
                format      : 'Letter',
                orientation : 'portrait',
                range       : 'date',
                dateFrom    : new Date(2011, 0, 3),
                dateTo      : new Date(2011, 0, 5),
                showHeader  : true,
                exporterId  : 'multipage'
            }, function (result) {

                var htmls = result.htmlArray;

                t.is(htmls.length, 1, "1 page exported");
                t.ok(htmls[0].html.indexOf("Mon 03 Jan") > -1, "Hasn`t column for `Mon 03 Jan`");
                t.ok(htmls[0].html.indexOf("Tue 04 Jan") > -1, "Hasn`t column for `Tue 04 Jan`");
                t.notOk(htmls[0].html.indexOf("Wed 05 Jan") > -1, "Hasn`t column for `Wed 05 Jan`");

                t.endAsync(async);
            });
        });

        t.it("Export range=`current`", function (t) {

            var async = t.beginAsync(45000);

            plugin.doExport({
                format      : 'Letter',
                orientation : 'portrait',
                range       : 'current',
                showHeader  : true,
                exporterId  : 'multipage'
            }, function (result) {

                var htmls = result.htmlArray;

                t.is(htmls.length, 2, "2 pages exported");
                t.ok(htmls[1].html.indexOf("Sun 09 Jan") > -1, "Has column for `Sun 09 Jan`");
                t.notOk(htmls[1].html.indexOf("Mon 10 Jan") > -1, "Hasn`t column for `Mon 10 Jan`");

                t.endAsync(async);
            });
        });

        t.it("Export multipage horizontal range=`complete`", function (t) {

            var async = t.beginAsync(45000);

            plugin.doExport({
                format : "Letter",
                orientation : "portrait",
                range : "complete",
                showHeader : true,
                singlePageExport : false,
                exporterId : 'multipagevertical'
            }, function (result) {

                var htmls = result.htmlArray;

                t.is(htmls.length, 1, "1 page exported");
                t.ok(htmls[0].html.indexOf("Sun 09 Jan") > -1, "Has column for `Sun 09 Jan`");
                t.ok(htmls[0].html.indexOf("Mon 10 Jan") > -1, "Has column for `Mon 10 Jan`");

                t.endAsync(async);
            });
        });

        t.it("Export multipage horizontal range=`dates` (from 2011-01-03 till 2011-01-05)", function (t) {

            var async = t.beginAsync(45000);

            plugin.doExport({
                format : "Letter",
                orientation : "portrait",
                range : "date",
                dateFrom : new Date(2011, 0, 3),
                dateTo : new Date(2011, 0, 5),
                showHeader : true,
                singlePageExport : false,
                exporterId : 'multipagevertical'
            }, function (result) {

                var htmls = result.htmlArray;

                t.is(htmls.length, 1, "1 page exported");
                t.notOk(htmls[0].html.indexOf("Sun 09 Jan") > -1, "Hasn`t column for `Sun 09 Jan`");
                t.notOk(htmls[0].html.indexOf("Mon 10 Jan") > -1, "Hasn`t column for `Mon 10 Jan`");

                t.endAsync(async);
            });
        });

        t.it('Get exporters', function (t) {

            var exporters = plugin.getExporters();

            t.is(exporters.length, 3, 'We have three default exporters available');
            t.isInstanceOf(exporters[0], 'Sch.plugin.exporter.SinglePage', 'Correct class Sch.plugin.exporter.SinglePage');
            t.isInstanceOf(exporters[1], 'Sch.plugin.exporter.MultiPage', 'Correct class Sch.plugin.exporter.MultiPage');
            t.isInstanceOf(exporters[2], 'Sch.plugin.exporter.MultiPageVertical', 'Correct class Sch.plugin.exporter.MultiPageVertical');

            t.is(plugin.defaultExporter, 'multipage', 'Default exporter is correct');
        });

        t.it("Allows to add custom exporter" , function (t) {

            plugin.registerExporter({
                xclass      : 'Sch.plugin.exporter.SinglePage',
                exporterId  : 'ourexporter',
                name        : 'Our exporter'
            });

            var exporters   = plugin.getExporters();

            t.is(exporters.length, 4, 'We have four exporters available');
            t.isInstanceOf(exporters[0], 'Sch.plugin.exporter.SinglePage', 'Correct class Sch.plugin.exporter.SinglePage');
            t.isInstanceOf(exporters[1], 'Sch.plugin.exporter.MultiPage', 'Correct class Sch.plugin.exporter.MultiPageVertical');
            t.isInstanceOf(exporters[2], 'Sch.plugin.exporter.MultiPageVertical', 'Correct class Sch.plugin.exporter.MultiPageVertical');
            t.isInstanceOf(exporters[3], 'Sch.plugin.exporter.SinglePage', 'Correct class Sch.plugin.export.SinglePage');

            t.isInstanceOf(plugin.getExporter('ourexporter'), 'Sch.plugin.exporter.SinglePage', 'getExporter returns correct Sch.plugin.export.SinglePage instance');
            t.is(plugin.getExporter('ourexporter').getName(), 'Our exporter', 'New exporter has correct name');
            t.is(plugin.getExporter('ourexporter').getExporterId(), 'ourexporter', 'New exporter has correct id');
        });

        t.it('`exporters` config supports definition using xclass', function (t) {

            var plugin      = Ext.create('Sch.plugin.Export', {
                openAfterExport : false,
                printServer     : 'something',
                test            : true,
                exporters       : [{ xclass : 'Sch.plugin.exporter.MultiPage', DPI : 300 }, 'Sch.plugin.exporter.SinglePage']
            });

            var exporters   = plugin.getExporters();

            t.is(exporters.length, 2, 'We have four exporters available');
            t.isInstanceOf(exporters[0], 'Sch.plugin.exporter.MultiPage', 'Correct class Sch.plugin.exporter.MultiPage');
            t.is(exporters[0].getDPI(), 300, 'Correct DPI');
            t.isInstanceOf(exporters[1], 'Sch.plugin.exporter.SinglePage', 'Correct class Sch.plugin.exporter.SinglePage');
        });

    });

});
