StartTest (function (t) {

    t.expectGlobal('Employee', '0');

    var iframe              = document.body.appendChild(document.createElement('iframe')),
        lockedBodySelector,
        normalBodySelector,
        doc,
        normalBody,
        lockedBody;

    var setIframe   = function (html) {
        doc         = iframe.contentWindow.document;
        doc.open();
        doc.write(html);
        doc.close();

        lockedBody  = t.$(lockedBodySelector, doc)[0];
        normalBody  = t.$(normalBodySelector, doc)[0];
    };

    Ext.define('Employee', {
        extend : 'Sch.model.Resource',
        fields : [
            { name : 'index', type : 'int' },
            { name : 'name' }
        ]
    });

    var createFakeData  = function (count) {

        var firstNames   = ['Ed', 'Tommy', 'Aaron', 'Abe', 'Jamie', 'Adam', 'Dave', 'David', 'Jay', 'Nicolas', 'Nige'],
            lastNames    = ['Spencer', 'Maintz', 'Conran', 'Elias', 'Avins', 'Mishcon', 'Kaneda', 'Davis', 'Robinson', 'Ferrero', 'White'];

        var data = [];

        for (var i = 0; i < (count || 25); i++) {
            var firstNameId = Math.floor(Math.random() * firstNames.length),
                lastNameId  = Math.floor(Math.random() * lastNames.length),
                name        = Ext.String.format('{0} {1}', firstNames[firstNameId], lastNames[lastNameId]);

            data.push({
                Id          : i,
                index       : i,
                name        : name
            });
        }

        // create the Resource Store
        var resourceStore   = Ext.create('Sch.data.ResourceStore', {
            model           : 'Employee',
            data            : data,
            proxy           : 'memory'
        });

        var eventData       = [];

        for (i = 0; i < (count || 25); i++) {
            eventData.push({
                Id          : 'Event' + i,
                Name        : 'Event' + i + '-1',
                ResourceId  : i,
                StartDate   : '2011-01-26',
                EndDate     : '2011-01-27'
            });

            if (i % 2) eventData.push({
                Id          : 'Event' + i + '-2',
                Name        : 'Event' + i + '-2',
                ResourceId  : i,
                StartDate   : '2011-01-26',
                EndDate     : '2011-01-28'
            });

        }

        // Store holding all the events
        var eventStore = Ext.create('Sch.data.EventStore', {
            data            : eventData
        });

        return {
            resourceStore   : resourceStore,
            eventStore      : eventStore
        };
    };

    t.describe('Assert the flow of the export', function (t) {

        var data            = createFakeData(100);
        var resourceStore   = data.resourceStore;
        var eventStore      = data.eventStore;

        var plugin          = new Sch.plugin.Export({
            //printServer   : '../examples/export/server.php',
            openAfterExport : false,
            test            : true,
            beforeExport : function (component, ticks) {
                t.ok(component, 'beforeExport has component parameter');
                t.isGreater(ticks.length, 0, 'Ticks are greater than 0');
            },
            afterExport : function (component) {
                t.ok(component, 'afterExport has component parameters');
            }
        });

        var scheduler   = t.getScheduler({
            rowHeight       : 40,
            width           : 2000,
            renderTo        : Ext.getBody(),
            startDate       : new Date(2011, 0, 25),
            endDate         : new Date(2011, 0, 30),
            plugins         : [
                plugin, { ptype : 'bufferedrenderer' }
            ],
            viewPreset      : 'dayAndWeek',
                // Setup static columns
                columns     : [
                {
                    header      : '#', sortable : true, width : 50, dataIndex : 'index',
                    renderer    : function (value) {
                        return '<table><tbody class="foo"><tr class="foo-row"><td>' +  value + '</td></tr></tbody></table>';
                    }
                },
               { header : 'Name', sortable : true, width : 100, dataIndex : 'name'}
            ],
            resourceStore   : resourceStore,
            eventStore      : eventStore
        });

        lockedBodySelector = '#' + scheduler.lockedGrid.view.getId();
        normalBodySelector = '#' + scheduler.normalGrid.view.getId();

        var assertSequence = function (t, exporterId) {

            var exporter = plugin.getExporter(exporterId);

            t.isCalledOnce(exporter.saveComponentState, exporter, 'saveComponentState called');

            t.isCalledOnce(plugin.mask, plugin, 'mask called');

            t.isCalledOnce(plugin.beforeExport, plugin, 'beforeExport called');

            t.isCalled(exporter.onPagesExtracted, exporter, 'onPagesExtracted is called');

            t.isCalledOnce(plugin.afterExport, plugin, 'afterExport called');

            t.isCalledOnce(plugin.doRequest, plugin, 'doRequest called');

            t.isCalledOnce(plugin.unmask, plugin, 'unmask called');

            t.isCalledOnce(exporter.restoreComponentState, exporter, 'Restore called');

        };

        t.waitForRowsVisible(scheduler, function () {

            t.it('Single export buffered', function (t) {

                var doExport = function () {

                    assertSequence(t, 'singlepage');

                    var async = t.beginAsync(45000);

                    plugin.doExport({
                        format : 'A4',
                        orientation : 'landscape',
                        range : 'complete',
                        exporterId : 'singlepage'
                    }, function (exported) {

                        setIframe(exported.htmlArray[0].html);

                        t.is(parseInt(lockedBody.style.top, 10), 0, 'correct top position of locked grid');
                        t.is(parseInt(normalBody.style.top, 10), 0, 'correct top position of normal grid');

                        var normalRows = plugin.exporter.normalRows;
                        t.is(normalRows.length, 100);
                        t.ok(normalRows[0].height, 'Normalrow height defined');

                        var lockedRows = plugin.exporter.lockedRows;
                        t.is(lockedRows.length, 100);
                        t.ok(lockedRows[0].height, 'Lockedrow height defined');

                        t.is(exported.htmlArray.length, 1, 'proper number of pages exported');

                        t.endAsync(async);
                    });
                };

                //TODO Scrolling down and then export is not working merge
                 doExport();
            });

            t.it('Multipage export (vertical)', function (t) {

                var async = t.beginAsync(45000);

                assertSequence(t, 'multipagevertical');

                plugin.doExport({
                    format      : 'A4',
                    orientation : 'portrait',
                    range       : 'complete',
                    exporterId : 'multipagevertical'
                }, function (exported) {

                    t.isApprox(exported.htmlArray.length, 4, 1, 'proper number of pages exported');

                    t.endAsync(async);
                });

            });

            t.it('Multipage export', function (t) {

                var async = t.beginAsync(45000);

                plugin.doExport({
                    format      : 'A4',
                    orientation : 'portrait',
                    range       : 'complete',
                    exporterId  : 'multipage'
                }, function (exported) {

                    t.is(exported.htmlArray.length, 36, 'proper number of pages exported');

                    t.endAsync(async);
                });

            });

        });
    });
});
