StartTest(function(t) {
    var scheduler = t.getScheduler({
        renderTo        : Ext.getBody()
    });

    function getTimePerPx () {
        var timeAxis = scheduler.timeAxis;

        return (timeAxis.getTicks()[0].end - timeAxis.getTicks()[0].start) / scheduler.timeAxisViewModel.tickWidth;
    }

    var headerHeight = scheduler.normalGrid.headerCt.getHeight();

    scheduler.zoomInFull();

    t.chain(
        Ext.Array.map(scheduler.zoomLevels, function() {

            return [

                function(next) {
                    var timePerPx = getTimePerPx();

                    if (scheduler.zoomOut()) {
                        t.isGreater(getTimePerPx(), timePerPx, scheduler.viewPreset);

                        if (scheduler.viewPreset !== 'manyYears') {
                            // For all presets with 2 header rows, height of the header should be consistent
                            t.is(scheduler.normalGrid.headerCt.getHeight(), headerHeight, scheduler.viewPreset + ': Header height should be consistent for all presets')
                        }
                    }

                    t.waitFor(100, next);
                }

            ]
        })
    )
});
