StartTest(function (t) {
    var scheduler = t.getScheduler({
        startDate   : new Date(2011, 0, 3),
        endDate     : new Date(2011, 0, 15),
        orientation : 'vertical',
        height      : 150,
        renderTo    : Ext.getBody(),
        stateful    : false
    });

    var view = scheduler.getSchedulingView();
    var dateAtSchedulerViewBottom, amountVisible;

    t.chain(
        { waitFor : 'eventsToRender', args : scheduler },

        // trying to give some time for Ext stateful mechanism to restore the scroll position
        { waitFor : 500 },
        
        function (next) {
            dateAtSchedulerViewBottom = view.getDateFromXY([0, view.getHeight()], null, true);
            amountVisible = dateAtSchedulerViewBottom - new Date(2011, 0, 3);

            t.isDeeply(view.getVisibleDateRange(), {
                startDate   : new Date(2011, 0, 3),
                endDate     : dateAtSchedulerViewBottom
            }, 'Correct initial visible date range');

            t.waitForScrollTopChange(scheduler.getSchedulingView().getEl(), next);
            scheduler.scrollToDate(new Date(2011, 0, 7), false);
        },

        function(next) {
            t.isDeeply(view.getVisibleDateRange(), {
                startDate   : new Date(2011, 0, 7),
                endDate     : new Date(new Date(2011, 0, 7)-0 + amountVisible)
            }, 'Correct visible date range after scrollToDate');

            t.waitForScrollTopChange(scheduler.getSchedulingView().getEl(), next);
            
            scheduler.scrollToDate(scheduler.getEnd(), false);
            
            // need to this mystical second scroll to work in IE
            setTimeout(function () {
                scheduler.scrollToDate(scheduler.getEnd(), false);
            }, 500)
        },

        // Now we should be scrolled to bottom
        function(next) {
            var viewportStart = view.getDateFromCoordinate(view.getScroll().top, null, true);

            t.isDeeply(view.getVisibleDateRange(), {
                startDate   : viewportStart,
                endDate     : scheduler.getEnd()
            }, 'Correct scroll to end date');
        }
    );
});
