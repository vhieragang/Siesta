StartTest(function(t) {
    t.expectGlobal('0'); // We love IE

    // Check that export plugin correctly splits rows into pages when rows have different heights #1537

    var // iframe to put exported HTML to
        iframe          = document.body.appendChild(document.createElement("iframe")),
        doc,
        resourceStore,
        eventStore,
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


    // prepare data
    // 21 resources
    resourceStore   = t.getResourceStore2({}, 21);
    // and 21 events
    eventStore      = t.getEventStore({}, 21);
    // ..plus append 2 more overlapping events for the first resource
    var event       = eventStore.first();

    eventStore.add([
        { Id : 100, ResourceId : event.getResourceId(), Name : 'Assignment 100', StartDate : event.getStartDate(), EndDate : event.getEndDate() },
        { Id : 101, ResourceId : event.getResourceId(), Name : 'Assignment 101', StartDate : event.getStartDate(), EndDate : event.getEndDate() }
    ]);


    var plugin      = new Sch.plugin.Export({
        openAfterExport : false,
        printServer     : 'something',
        test            : true
    });

    var scheduler   = t.getScheduler({
        rowHeight       : 40,
        renderTo        : Ext.getBody(),
        plugins         : plugin,
        resourceStore   : resourceStore,
        eventStore      : eventStore
    });


    t.waitForRowsVisible(scheduler, function () {

        lockedBodySelector = '#' + scheduler.lockedGrid.view.getId();
        normalBodySelector = '#' + scheduler.normalGrid.view.getId();
        lockedRowSelector = scheduler.lockedGrid.view.getItemSelector();
        normalRowSelector = scheduler.normalGrid.view.getItemSelector();

        var async = t.beginAsync(45000);

        plugin.doExport({
            format      : 'Letter',
            orientation : 'portrait',
            range       : 'complete',
            showHeader : true,
            exporterId : 'multipage'
        },
        function (response) {
            var htmls = response.htmlArray;

            // unmask to view "DOM Panel"
            plugin.unmask();
            t.endAsync(async);
            /*
             * Available height for visible rows is calculated as
             *      plugin.pageSizes.Letter.height * plugin.DPI - scheduler.normalGrid.headerCt.getHeight() - pageHeaderHeight
             * Which gives us 706 pixels of height per each page:
             *      11 * 72 - 41 - 45 = 706
             * We have 0th resource row which has 3 overlapping events which gives us roughly 3 * "normal" row height (40px):
             *      3 * 40 = 120
             * And we have 20 "normal" rows of 40px height.
             * So 0th page should contain 706 / 40 = 17 "normal" rows. But since 0th row is "triple" the 0th page will have 15 rows (from 0th till 14th).
             */

            t.is(htmls.length, 4, "4 pages exported (2 x 2 pages, by vertical and horizontal direction respectively)");

            t.it('0th page has correct set of rows', function (t) {
                // put 0th page into iframe
                setIframe(htmls[0].html);
                rowsVisible(t, 15, 15);
            });

            t.it('1st page has correct set of rows', function (t) {
                // put 1st page into iframe
                setIframe(htmls[1].html);
                rowsVisible(t, 6, 6);
            });

            t.it('2nd page has correct set of rows', function (t) {
                // put 2nd page into iframe
                setIframe(htmls[2].html);
                rowsVisible(t, 0, 15);
            });

            t.it('3rd page has correct set of rows', function (t) {
                // put 3rd page into iframe
                setIframe(htmls[3].html);
                rowsVisible(t, 0, 6);
            });


        });

    });

});
