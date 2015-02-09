StartTest(function (t) {
    var scheduler = t.getScheduler({
        eventBarTextField: 'Name',
        width : 300,
        renderTo: Ext.getBody()
    });

    var view = scheduler.getSchedulingView();
    var dateAtSchedulerViewRight, amountVisible;
    var tolerance = 15*60*1000; // 30 min

    t.chain(
        { waitFor : 'eventsToRender', args : scheduler },
        // trying to give some time for Ext stateful mechanism to restore the scroll position
        { waitFor : 500 },
        
        function (next) {
            dateAtSchedulerViewRight = view.getDateFromXY([view.getWidth(), 0], null, true);
            amountVisible = dateAtSchedulerViewRight - new Date(2011, 0, 3);
            
            t.isDeeply(view.getVisibleDateRange(), {
                startDate   : new Date(2011, 0, 3),
                endDate     : dateAtSchedulerViewRight
            }, 'Correct initial visible date range');

            t.waitForScrollLeftChange(scheduler.getSchedulingView().getEl(), next);
            scheduler.scrollToDate(new Date(2011, 0, 7), false);
        },

        function(next) {
            t.isDeeply(view.getVisibleDateRange(), {
                startDate   : new Date(2011, 0, 7),
                endDate     : new Date(new Date(2011, 0, 7)-0 + amountVisible)
            }, 'Correct visible date range after scrollToDate');

            t.waitForScrollLeftChange(scheduler.getSchedulingView().getEl(), next);

            scheduler.scrollToDate(scheduler.getEnd(), false);
        },

        function(next) {
            var range = view.getVisibleDateRange();
            t.isApprox(range.startDate, new Date(scheduler.getEnd()-amountVisible), tolerance, 'Start: Correct scroll to end date');
            t.isApprox(range.endDate, scheduler.getEnd(), tolerance, 'End: Correct scroll to end date');
        }
    );
});
