StartTest(function(t) {
    var schedulerLTR = t.getScheduler({
        width       : 500,
        height      : 200,
        startDate   : new Date(2009, 1, 1),
        endDate     : new Date(2009, 1, 11),
        renderTo    : Ext.getBody()
    });

    t.waitForRowsVisible(schedulerLTR, testLTR)

    function testLTR() {
        var view = schedulerLTR.getSchedulingView();
        var tickWidth = view.timeAxisViewModel.getTickWidth();
        var timeAxisCol = schedulerLTR.down('timeaxiscolumn');

        t.is(view.getDateFromCoordinate(0, null, true), new Date(2009, 1, 1), 'Should find start date at point 0');
        t.is(view.getDateFromCoordinate(tickWidth, null, true), new Date(2009, 1, 2), 'Should find start date +1d at 1 whole tick');

        view.scrollHorizontallyTo(tickWidth);

        t.is(view.getDateFromCoordinate(view.el.getX(), 'round'),
             new Date(2009, 1, 2),
            'Should find start date +1d at the left edge of 2nd time column');
    }
})

