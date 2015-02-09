StartTest(function(t) {
    t.expectGlobal('0'); // We love IE
    t.expectGlobal('MyExporter');

    var
    // iframe to put exported HTML to
        iframe          = document.body.appendChild(document.createElement("iframe")),
        doc,
        lockedBodySelector,
        normalBodySelector,
        lockedBody,
        normalBody,
        lockedRowSelector,
        normalRowSelector;

    // puts HTML code into iframe
    var setIframe   = function (html) {
        doc         = iframe.contentWindow.document;
        doc.open();
        doc.write(html);
        doc.close();
        // get locked/normal grids body elements
        lockedBody  = t.$(lockedBodySelector, doc)[0];
        normalBody  = t.$(normalBodySelector, doc)[0];
    };

    // checks number of rows in table in both locked and normal grids
    var rowsVisible  = function (t, numberLocked, numberNormal) {
        var lockedRows  = t.$(lockedRowSelector, lockedBody),
            normalRows  = t.$(normalRowSelector, normalBody);

        t.is(lockedRows.length, numberLocked, 'Number of locked rows is correct');
        t.is(normalRows.length, numberNormal, 'Number of normal rows is correct');
    };


    Ext.define('MyExporter', {

        extend : 'Sch.plugin.exporter.MultiPageVertical',

        onRowsCollected : function (lockedRows, normalRows) {
            var me = this;

            me.iterateAsync(function (next, rowIndex) {

                if (rowIndex === lockedRows.length) {
                    me.onPagesExtracted();
                    return;
                }

                var index = rowIndex,
                    spaceLeft = me.printHeight,
                    lockeds = [],
                    normals = [],
                    normal,
                    newPage = false;

                me.startPage();

                var count = 0;
                while (count < 10 && index < lockedRows.length) {

                    normal = normalRows[index];
                    spaceLeft -= normal.height;

                    lockeds.push(lockedRows[index]);
                    normals.push(normal);
                    index++;
                    count++;
                }

                me.fillGrids(lockeds, normals);
                me.commitPage();

                next(index);

            }, me, 0);
        }

    });


    var assertExportResult = function (t, scheduler, numberOfPages) {

        t.waitForRowsVisible(scheduler, function () {

            lockedBodySelector = '#' + scheduler.lockedGrid.view.getId();
            normalBodySelector = '#' + scheduler.normalGrid.view.getId();
            lockedRowSelector = scheduler.lockedGrid.view.getItemSelector();
            normalRowSelector = scheduler.normalGrid.view.getItemSelector();

            var async = t.beginAsync(45000);

            scheduler.getPlugin('export').doExport({
                format : "A4",
                orientation : "landscape",
                range : "complete",
                showHeader : true,
                exporterId : 'myexporter'
            }, function (result) {

                t.endAsync(async);

                var htmls = result.htmlArray;

                for (var i =0; i < numberOfPages; i++) {
                    t.is(htmls.length, numberOfPages, 'Number of exported pages is ' + numberOfPages);
                    setIframe(htmls[i].html);
                    rowsVisible(t, 10, 10);
                }

                scheduler.destroy();

            });


        });
    };

    t.describe('Define class that extends exporter with custom export functionality', function (t) {

        t.it('Not buffered - Correct number of pages are exported', function (t) {

            var resourceStore   = t.getResourceStore2({}, 30);
            var eventStore      = t.getEventStore({}, 30);

            var plugin      = new Sch.plugin.Export({
                printServer : 'something',
                pluginId    : 'export',
                openAfterExport : false,
                test        : true
            });

            var scheduler   = t.getScheduler({
                renderTo        : Ext.getBody(),
                plugins         : [
                    plugin
                ],
                resourceStore   : resourceStore,
                eventStore      : eventStore
            });

            var exporter = plugin.createExporter('MyExporter', { exporterId : 'myexporter' });
            plugin.registerExporter(exporter);

            assertExportResult(t, scheduler, 3);
        });

        t.it('Buffered - Correct number of pages are exported', function (t) {

            var resourceStore   = t.getResourceStore2({}, 100);
            var eventStore      = t.getEventStore({}, 100);

            var plugin      = new Sch.plugin.Export({
                printServer : 'something',
                pluginId    : 'export',
                openAfterExport : false,
                test        : true
            });

            var scheduler   = t.getScheduler({
                renderTo        : Ext.getBody(),
                plugins         : [
                    plugin,
                    {
                        ptype: 'bufferedrenderer',
                        trailingBufferZone: 0,
                        leadingBufferZone: 0
                    }
                ],
                resourceStore   : resourceStore,
                eventStore      : eventStore
            });

            var exporter = plugin.createExporter('MyExporter', { exporterId : 'myexporter' });
            plugin.registerExporter(exporter);

            assertExportResult(t, scheduler, 10);
        });
    });
});