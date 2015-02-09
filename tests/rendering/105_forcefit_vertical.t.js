StartTest(function (t) {
    var scheduler = t.getScheduler({
        height          : 300,
        width           : 400,
        startDate       : new Date(2011, 0, 3),
        endDate         : new Date(2011, 0, 5),
        viewPreset      : 'dayAndWeek',
        orientation     : 'vertical',
        forceFit        : true
    });

    scheduler.render(Ext.getBody());

    t.waitForRowsVisible(scheduler, function () {

        t.isLessOrEqual(scheduler.lockedGrid.el.down('table').getHeight(),
                        scheduler.lockedGrid.view.el.getHeight() - 20,
                        'Should find table fitting completely inside of the view element');

    });
});
