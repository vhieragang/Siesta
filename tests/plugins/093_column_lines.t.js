StartTest(function(t) {

    var schedulerPanel = t.getScheduler({
        renderTo : document.body
    });

    schedulerPanel.zoomInFull();

    function verifyLines(next) {

        t.waitFor(function() {
            var lines = Ext.select('.sch-column-line');

            if (lines.getCount() === 0) return;

            var headerCells = Ext.select('.sch-header-row-middle td');

            var headerX = headerCells.item(0).getX() + headerCells.item(0).getWidth();
            var lineX = lines.item(0).getX();

            return Math.abs(headerX - lineX) <= 1;
        }, function() {
            t.pass('Lines and header aligned')
            next();
        })
    }

    function zoomOut(next) {
        Ext.select('.sch-column-line').remove();

        verifyLines(next);
        schedulerPanel.zoomOut();
    }

    t.chain(
        { waitFor : 'EventsVisible' },

        zoomOut,
        // have to wait also for this selector (specially for FF)
        { waitForSelector : '.sch-column-line' },
        verifyLines,
        zoomOut,
        { waitForSelector : '.sch-column-line' },
        verifyLines,
        zoomOut,
        { waitForSelector : '.sch-column-line' },
        verifyLines,
        zoomOut,
        { waitForSelector : '.sch-column-line' },
        verifyLines,
        zoomOut,
        { waitForSelector : '.sch-column-line' },
        verifyLines,
        zoomOut,
        { waitForSelector : '.sch-column-line' },
        verifyLines,
        zoomOut,
        { waitForSelector : '.sch-column-line' },
        verifyLines,
        zoomOut,
        { waitForSelector : '.sch-column-line' },
        verifyLines,
        zoomOut,
        { waitForSelector : '.sch-column-line' },
        verifyLines,
        zoomOut,
        { waitForSelector : '.sch-column-line' },
        verifyLines
    );
});  
