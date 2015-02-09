StartTest(function(t) {
    var schedulerRTL = t.getScheduler({
        width       : 500,
        height      : 200,
        startDate   : new Date(2009, 1, 1),
        endDate     : new Date(2009, 1, 11),
        renderTo    : Ext.getBody(),
        rtl         : true
    });

    t.waitForRowsVisible(schedulerRTL, testRTL)

    function testRTL() {
        var view = schedulerRTL.getSchedulingView();
        var tickWidth = view.timeAxisViewModel.getTickWidth();
        var timeAxisCol = schedulerRTL.down('timeaxiscolumn');

        t.is(view.getDateFromCoordinate(t.safeSelect('.sch-header-row-middle .sch-column-header:nth-child(1)', timeAxisCol.el.dom).getRight(), 'round'),
            new Date(2009, 1, 1),
            'RTL: Should find start date at the left edge of 1st time column');

        view.scrollHorizontallyTo(view.el.dom.scrollLeft-tickWidth);
        t.is(view.getDateFromCoordinate(t.safeSelect('.sch-header-row-middle .sch-column-header:nth-child(2)', timeAxisCol.el.dom).getRight(), 'round'),
            new Date(2009, 1, 2),
            'RTL: Should find start date +1d at the left edge of 2nd time column');


    }
})

