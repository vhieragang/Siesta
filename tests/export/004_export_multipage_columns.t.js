StartTest(function(t) {
    t.expectGlobal('0'); // We love IE

    // Here we check that columns visibility is restored correctly after export. #1556
    // We also ensure that locked grid columns is correctly splitted to pages.

    var plugin      = Ext.create('Sch.plugin.Export', {
        printServer     : 'something',
        openAfterExport : false,
        test            : true
    });

    var scheduler   = t.getScheduler({
        renderTo    : Ext.getBody(),
        width       : 1000,
        startDate   : new Date(2011, 0, 3),
        endDate     : new Date(2011, 0, 6),
        plugins     : plugin,
        columns     : [
            { header : 'Name0', dataIndex : 'Name', width : 100 },
            { header : 'Name1', dataIndex : 'Name', hidden : true, width : 100 },
            { header : 'Name2', dataIndex : 'Name', width : 100  },
            { header : 'Name3', dataIndex : 'Name', hidden : true, width : 100 },
            { header : 'Name4', dataIndex : 'Name', width : 100 },
            { header : 'Name5', dataIndex : 'Name', width : 100 },
            { header : 'Name6', dataIndex : 'Name', width : 100 },
            { header : 'Name7', dataIndex : 'Name', width : 100 }
        ]
    });

    var iframe              = document.body.appendChild(document.createElement('iframe')),
        lockedHeaderSelector  = '.x-grid-header-ct-docked-top',
        lockedBodySelector = '#' + scheduler.lockedGrid.view.getId(),
        normalBodySelector = '#' + scheduler.normalGrid.view.getId(),
        doc,
        lockedHeader,
        lockedBody,
        normalBody;

    var setIframe   = function (html) {
        doc         = iframe.contentWindow.document;
        doc.open();
        doc.write(html);
        doc.close();
        lockedHeader = t.$(lockedHeaderSelector, doc)[0];
        lockedBody  = t.$(lockedBodySelector, doc)[0];
        normalBody  = t.$(normalBodySelector, doc)[0];
    };

    var checkOutputColumns  = function (t, visible, hidden) {
        var columnResult;

        for (var i = 0; i < visible.length; i++ ) {
            columnResult = t.$('.x-column-header:visible:contains("' + visible[i] + '")', lockedHeader);
            t.is(columnResult.length, 1, 'locked column ' +  visible[i] + ' is visible');
        }

        if (hidden) for (i = 0; i < hidden.length; i++ ) {
            columnResult = t.$('.x-column-header:visible:contains("' + hidden[i] + '")', lockedHeader);
            t.notOk(columnResult.length, 'locked column ' +  hidden[i] + ' is hidden');
        }
    };

    var checkEvents = function (t) {
        t.isGreater(t.$('.sch-event', normalBody).length, 0, 'There are events');
    };

    var checkPanelColumns   = function (t) {
        var columns = scheduler.lockedGrid.columns;

        t.ok(columns[0].isVisible(), 'Visible column #0 is shown');
        t.notOk(columns[1].isVisible(), 'Hidden column #1 is hidden');
        t.ok(columns[2].isVisible(), 'Visible column #2 is shown');
        t.notOk(columns[3].isVisible(), 'Hidden column #3 is hidden');
        t.ok(columns[4].isVisible(), 'Visible column #4 is shown');
        t.ok(columns[5].isVisible(), 'Visible column #5 is shown');
        t.ok(columns[6].isVisible(), 'Visible column #6 is shown');
        t.ok(columns[7].isVisible(), 'Visible column #7 is shown');
    };

    t.waitForRowsVisible(scheduler, function () {

        checkPanelColumns(t);

        var async = t.beginAsync(45000);

        plugin.doExport({
            format      : 'A4',
            orientation : 'portrait',
            range       : 'complete',
            showHeader  : true,
            exporterId  : 'multipage'
        },
        function (response){

            t.it('After export launch columns visibility gets restored', checkPanelColumns);

            var pages   = response.htmlArray;

            t.it('0th page has correct set of columns marked as visible', function (t) {
                // put 0th page into iframe
                setIframe(pages[0].html);
                checkOutputColumns(t, ['Name0', 'Name2', 'Name4', 'Name5', 'Name6'], ['Name1', 'Name3', 'Name7']);
            });

            t.it('1th page has correct set of columns marked as visible', function (t) {
                // put 1th page into iframe
                setIframe(pages[1].html);
                checkOutputColumns(t, ['Name7'], ['Name0', 'Name1', 'Name2', 'Name3', 'Name4', 'Name5', 'Name6']);
                checkEvents(t);
            });

            t.endAsync(async);

        });
    });

});
