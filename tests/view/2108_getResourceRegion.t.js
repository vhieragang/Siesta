StartTest(function(t) {

    t.it('HORIZONTAL getResourceRegion', function(t) {
        var scheduler = t.getScheduler({
            viewPreset  : 'dayAndWeek',
            startDate   : new Date(2010, 0, 1),
            endDate     : new Date(2010, 0, 7),
            renderTo    : Ext.getBody()
        });

        var view = scheduler.getSchedulingView();

        t.chain(
            { waitFor : 'rowsVisible', args : scheduler },

            function(next) {
                var region = view.getResourceRegion(scheduler.resourceStore.first());
                t.is(region.left, 0, 'getResourceRegion horizontal: region left ok');
                t.is(region.right, view.el.down('table').getWidth(), 'getResourceRegion horizontal: region right ok');
                t.isApprox(region.top, 0, 1, 'getResourceRegion horizontal: region top ok');
                t.isApprox(region.bottom, view.getRowHeight(), 1, 'getResourceRegion horizontal: region bottom ok');
            }
        );
    });

    t.it('VERTICAL getResourceRegion', function(t) {
        var scheduler = t.getScheduler({
            viewPreset  : 'dayAndWeek',
            orientation : 'vertical',
            startDate   : new Date(2010, 0, 1),
            endDate     : new Date(2010, 0, 7),
            renderTo    : Ext.getBody()
        });

        var view = scheduler.getSchedulingView();

        t.chain(
            { waitFor : 'rowsVisible', args : scheduler },

            function(next) {
                var region = view.getResourceRegion(scheduler.resourceStore.first());
                t.is(region.left, 1, 'getResourceRegion vertical: region left ok');
                t.is(region.right, view.headerCt.getGridColumns()[0].getWidth() - 1, 'getResourceRegion vertical: region right ok');
                t.is(region.top, 0, 'getResourceRegion vertical: region top ok');
                t.isApprox(region.bottom, view.el.down('.x-grid-item-container').getHeight(), 1, 'getResourceRegion vertical: region bottom ok');
            }
        );
    });

    t.it('HORIZONTAL getScheduleRegion', function(t) {
        var scheduler = t.getScheduler({
            viewPreset  : 'dayAndWeek',
            startDate   : new Date(2010, 0, 1),
            endDate     : new Date(2010, 0, 7),
            renderTo    : Ext.getBody()
        });

        var view = scheduler.getSchedulingView();

        t.chain(
            { waitFor : 'rowsVisible', args : scheduler },

            function(next) {
                var region = view.getScheduleRegion();
                var tableRegion = view.el.down('.x-grid-item-container').getRegion();

                t.is(region.left,     tableRegion.left, 'getScheduleRegion horizontal: left ok');
                t.is(region.right,    tableRegion.right, 'getScheduleRegion horizontal: right ok');
                t.is(region.top,      tableRegion.top+view.barMargin, 'getScheduleRegion horizontal: top ok');
                t.is(region.bottom,   tableRegion.bottom-view.barMargin-view.eventBorderWidth, 'getScheduleRegion horizontal: bottom ok');

            }
        );
    });

    t.it('VERTICAL getScheduleRegion', function(t) {
        var scheduler = t.getScheduler({
            viewPreset  : 'dayAndWeek',
            orientation : 'vertical',
            startDate   : new Date(2010, 0, 1),
            endDate     : new Date(2010, 0, 7),
            renderTo    : Ext.getBody()
        });

        var view = scheduler.getSchedulingView();

        t.chain(
            { waitFor : 'rowsVisible', args : scheduler },

            function(next) {
                var region = view.getScheduleRegion();
                var tableRegion = view.el.down('.x-grid-item-container').getRegion();
                t.is(region.top,      tableRegion.top, 'getScheduleRegion vertical: top ok');
                t.isApprox(region.bottom,   tableRegion.bottom, 1, 'getScheduleRegion vertical: bottom ok');
                t.is(region.left,     tableRegion.left+view.barMargin, 'getScheduleRegion vertical: left ok');
                t.is(region.right,    tableRegion.right-view.barMargin, 'getScheduleRegion vertical: right ok');
            }
        );
    });
})

