StartTest(function (t) {

    // #1558:  Normal grid changes time span on splitter move when infinite scroll enabled

    var scheduler = t.getScheduler({
        height           : 200,
        width            : 600,
        layout           : 'border',
        lockedGridConfig : {
            split : true,
            width : 200
        },
        infiniteScroll   : true,
        viewPreset       : 'hourAndDay',
        startDate        : new Date(2011, 0, 1, 6),
        endDate          : new Date(2011, 0, 2, 20),
        resourceStore    : t.getResourceStore({
            data : [
                { Id : 'r1', Name : 'Mike' }
            ]
        }),
        renderTo         : Ext.getBody()
    });


    t.chain(
        { waitForRowsVisible : scheduler },

        function() {
            var view = scheduler.getSchedulingView();
            var startBefore = view.getVisibleDateRange().startDate;

            scheduler.lockedGrid.setWidth(100);

            t.isApprox(view.getVisibleDateRange().startDate - startBefore, 0, 1000, 'Start date should be kept after size change')
        }
    )
});
