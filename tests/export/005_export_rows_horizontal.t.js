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
    var rowsVisible  = function (t, rowsOnPage) {
        var lockedRows  = t.$(lockedRowSelector, lockedBody),
            normalRows  = t.$(normalRowSelector, normalBody);

        t.is(lockedRows.length, rowsOnPage, 'Number of locked rows is correct');
        t.is(normalRows.length, rowsOnPage, 'Number of normal rows is correct');
    };

    // prepare data
    // 50 resources
    resourceStore   = t.getResourceStore2({}, 50);
    // and 50 events
    eventStore      = t.getEventStore({}, 50);
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
            format      : 'A4',
            orientation : 'landscape',
            range       : 'complete',
            showHeader  : true,
            exporterId  : 'multipagevertical'
        }, function (exported) {

            // unmask to view "DOM Panel"
            plugin.unmask();

            var htmls = exported.htmlArray;

            var totalHeight = plugin.exporter.normalRowsHeight,
                printHeight = plugin.exporter.printHeight,
                numberOfPages = Math.ceil(totalHeight/printHeight),
                rows = plugin.exporter.normalRows,
                rowIndex = 0;

            t.is(htmls.length, numberOfPages, "" + numberOfPages  + " pages exported (" + numberOfPages + " x 1 pages, by horizontal direction respectively)");

            for (var i = 0; i < numberOfPages; i++) {

                t.diag('Assert number of pages page ' + (i + 1));

                setIframe(htmls[i].html);

                var rowsOnPage = 0,
                    sumRowHeight = 0,
                    endPage = false;

                while(!endPage && rowIndex < rows.length) {

                    sumRowHeight += rows[rowIndex].height;

                    if (sumRowHeight < printHeight) {
                        rowIndex++;
                        rowsOnPage++;
                    }
                    else {
                        endPage = true;
                    }
                }

                rowsVisible(t, rowsOnPage);
            }

            t.endAsync(async);
        });
    });

});

