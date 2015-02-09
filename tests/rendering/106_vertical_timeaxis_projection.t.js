StartTest(function (t) {
    var scheduler = t.getScheduler({
        height          : 1000,
        width           : 400,
        startDate       : new Date(2011, 0, 3),
        endDate         : new Date(2011, 0, 4),
        viewPreset      : 'hourAndDay',
        orientation     : 'vertical'
    });

    scheduler.render(Ext.getBody());
    scheduler.getSchedulingView().setRowHeight(60);

    t.waitForRowsVisible(scheduler, function () {
        var viewTop = scheduler.lockedGrid.view.el.getY();
        var twelvePos = t.safeSelect('.x-grid-cell:contains(12:00)', document).getY() - viewTop;

        t.isApprox(scheduler.el.down('.sch-timetd').getHeight(), 60, 1, 'Cell element has the correct height')

        t.isApprox(twelvePos, 12*60, 1, '12th cell at correct position')
        t.is(t.safeSelect(Ext.grid.View.prototype.itemSelector + ':nth-child(13) .x-grid-cell', scheduler.normalGrid.el.dom).getY() - viewTop, twelvePos, 'Rows in sync')
    });
});
