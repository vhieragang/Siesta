StartTest(function (t) {

    t.it('forceFit and columns need to be fitted, weekAndDayLetter', function (t) {

        var timeAxis = t.getTimeAxis('weekAndDayLetter', {
            start : new Date(2010, 0, 11),
            end   : Sch.util.Date.add(new Date(2010, 0, 11), Sch.util.Date.WEEK, 5)
        });

        var viewModel = new Sch.view.model.TimeAxis({
            viewPreset : 'weekAndDayLetter',
            timeAxis   : timeAxis,
            forceFit   : true
        });
        viewModel.update(600);
        var colCfg = viewModel.getColumnConfig();

        t.is(
            viewModel.getDistanceBetweenDates(colCfg.bottom[0].start, colCfg.bottom[6].end),
            viewModel.getDistanceBetweenDates(colCfg.middle[0].start, colCfg.middle[0].end),
            'Correct column width, weekAndDayLetter'
        );

        // this assertion breaks when `getDistanceBetweenDates` rounds the duration to smaller units then the main unit of the timeaxis
        // so that duration of the 1st interval, which is ~6.7 d is rounded to 7 days, which is equal to the duration of the 2nd interval
        // however the pixel difference is significant for such two intervals
        t.isLess(
            viewModel.getDistanceBetweenDates(new Date(2010, 0, 11), new Date(2010, 0, 17, 13)),
            viewModel.getDistanceBetweenDates(new Date(2010, 0, 11), new Date(2010, 0, 18)),
            'Almost a 1 week distance is less than 1 week distance'
        );

    });

    t.it('No forceFit, but snapToIncrement. Months do not support snapping.', function (t) {
        var presetColWidth = Sch.preset.Manager.getPreset('monthAndYear').timeColumnWidth;

        var timeAxis = t.getTimeAxis('monthAndYear', {
            start : new Date(2010, 1, 1),
            end   : new Date(2010, 8, 1)
        });

        var viewModel = new Sch.view.model.TimeAxis({
            viewPreset      : 'monthAndYear',
            timeAxis        : timeAxis,
            snapToIncrement : true,
            forceFit        : false
        });
        viewModel.update(600);

        t.is(viewModel.getTickWidth(), presetColWidth, 'Column width matches monthAndYear setting.');
    });


    t.it('No forceFit and no snapToIncrement, and no need to expand the columns to fit the available width. Should just use the column width value from viewPreset.', function (t) {
        var presetColWidth = Sch.preset.Manager.getPreset('hourAndDay').timeColumnWidth;

        var timeAxis = t.getTimeAxis('hourAndDay', {
            start : new Date(2010, 11, 9, 8),
            end   : new Date(2010, 11, 9, 20)
        });

        var viewModel = new Sch.view.model.TimeAxis({
            viewPreset      : 'hourAndDay',
            timeAxis        : timeAxis,
            snapToIncrement : false,
            forceFit        : false
        });
        viewModel.update(600);

        t.is(viewModel.getTickWidth(), presetColWidth, 'Column width matches hourAndDay setting.');
    });


    t.it("No forceFit and no snapToIncrement, but columns don't consume entire available space and should grow to fit the available width", function (t) {
        var timeAxis = t.getTimeAxis('hourAndDay', {
            start : new Date(2010, 11, 9, 8),
            end   : new Date(2010, 11, 9, 12)
        });

        var viewModel = new Sch.view.model.TimeAxis({
            viewPreset      : 'hourAndDay',
            timeAxis        : timeAxis,
            snapToIncrement : false,
            forceFit        : false
        });
        viewModel.update(600);

        t.is(viewModel.getTickWidth(), 150, 'Correct width when columns do not consume the whole available space');
    });


    t.it('forceFit but no snapToIncrement, columns should fit in the available width.', function (t) {

        var timeAxis = t.getTimeAxis('hourAndDay', {
            start : new Date(2010, 11, 9, 8),
            end   : new Date(2010, 11, 9, 18)
        });

        var viewModel = new Sch.view.model.TimeAxis({
            viewPreset      : 'hourAndDay',
            timeAxis        : timeAxis,
            snapToIncrement : false,
            forceFit        : true
        });
        viewModel.update(600);

        t.is(viewModel.getTickWidth(), 60, 'forceFit applied the correct column width');

        viewModel.setAvailableWidth(900);

        t.is(viewModel.getTickWidth(), 90, 'setAvailableWidth update the column width');
    });


    t.it('no forceFit but snapToIncrement and the columns do not consume the available width => they should grow', function (t) {
        Sch.preset.Manager.registerPreset('workweek', {
            rowHeight           : 24,
            resourceColumnWidth : 135,
            timeColumnWidth     : 115,

            displayDateFormat : 'G:i',
            shiftIncrement    : 1,
            shiftUnit         : "WEEK",
            timeResolution    : {
                unit      : "MINUTE",
                increment : 15
            },
            headerConfig      : {
                middle : {
                    unit       : "DAY",
                    dateFormat : 'Y-m-d'
                }
            }
        });

        var timeAxis = t.getTimeAxis('workweek', {
            start : new Date(2010, 11, 9),
            end   : new Date(2010, 11, 16)
        });

        var viewModel = new Sch.view.model.TimeAxis({
            viewPreset      : 'workweek',
            timeAxis        : timeAxis,
            snapToIncrement : true,
            forceFit        : false
        });
        viewModel.update(1200);

        // 1440 mins per day / 15 min increment => 96 ticks per day so minimum width for a day cell is 96 pixels to be able to support snapToIncrement
        // Since columns don't consume all space, their size will be doubled
        t.is(viewModel.getTickWidth(), (2 * 24 * 60 / 15), 'Correct column width when snapToIncrement and resolution affects the column width');

        viewModel.setSnapToIncrement(false);
        viewModel.setTickWidth(200);
        t.is(viewModel.getTickWidth(), 200, 'setTickWidth ok');
    })


    t.it('no forceFit but snapToIncrement and the resolution is 1 day', function (t) {

        Sch.preset.Manager.registerPreset('weekAndDayLetter', {
            timeColumnWidth     : 139,  // Something not evenly divisible by 7
            rowHeight           : 24,
            resourceColumnWidth : 100,
            displayDateFormat   : 'Y-m-d',
            shiftUnit           : "WEEK",
            shiftIncrement      : 1,
            defaultSpan         : 10,
            timeResolution      : {
                unit      : "DAY",
                increment : 1
            },
            headerConfig        : {
                bottom : {
                    unit      : "WEEK",
                    increment : 1,
                    renderer  : function () {
                        return "foo";
                    }
                },
                middle : {
                    unit       : "WEEK",
                    dateFormat : 'D d M Y',
                    align      : 'left'
                }
            }
        });

        var timeAxis = t.getTimeAxis('weekAndDayLetter', {
            start : new Date(2010, 0, 11),
            end   : Sch.util.Date.add(new Date(2010, 0, 11), Sch.util.Date.WEEK, 20)
        });

        var viewModel = new Sch.view.model.TimeAxis({
            viewPreset      : 'weekAndDayLetter',
            timeAxis        : timeAxis,
            snapToIncrement : true,
            forceFit        : false
        });
        viewModel.update(600);

        t.is(viewModel.getTickWidth(), 140, 'Correct column width when snapToIncrement and resolution affects the column width');
    });

    t.it('setAvailableWidth / getAvailableWidth', function (t) {
        var timeAxis = t.getTimeAxis('dayAndWeek', {
            start : new Date(2010, 0, 11),
            end   : Sch.util.Date.add(new Date(2010, 0, 11), Sch.util.Date.DAY, 20)
        });

        var viewModel = new Sch.view.model.TimeAxis({
            viewPreset : 'dayAndWeek',
            timeAxis   : timeAxis,
            forceFit   : false
        });
        viewModel.setAvailableWidth(600);
        t.is(viewModel.getAvailableWidth(), 600, 'setAvailableWidth/getAvailableWidth ok');

        t.firesOnce(viewModel, 'update');
        viewModel.fitToAvailableWidth();

        t.is(viewModel.getTickWidth(), 30, 'fitToAvailableWidth ok');
    });


    t.it('Time axis with `autoAdjust : false`', function (t) {
        Sch.preset.Manager.registerPreset('customPreset', {
            "displayDateFormat" : "d.m. G:i",
            "headerConfig"      : {
                "middle" : {
                    "increment"  : 1,
                    "unit"       : "WEEK",
                    "align"      : "center",
                    "dateFormat" : "W"
                },
                "top"    : {
                    "increment"  : 1,
                    "unit"       : "MONTH",
                    "align"      : "center",
                    "dateFormat" : "M Y"
                }
            },
            "timeResolution"    : {
                "increment" : 1,
                "unit"      : "DAY"
            }
        });

        var timeAxis = t.getTimeAxis('customPreset', {
            autoAdjust : false,
            start      : new Date(2013, 8, 1),
            end        : new Date(2014, 2, 1)
        });

        var viewModel = new Sch.view.model.TimeAxis({
            viewPreset : 'customPreset',
            timeAxis   : timeAxis
        });

        viewModel.update(600);

        t.is(viewModel.getPositionFromDate(new Date(2013, 8, 1)), 0, 'The time span`s start point should give 0 coordinate')
        t.is(viewModel.getDateFromPosition(0), new Date(2013, 8, 1), 'And vice versa')
    });

    t.it('Should shrink back to previous width after tickWidth has been stretched (to fit container size)', function (t) {
        Sch.preset.Manager.registerPreset('customPreset', {
            "timeColumnWidth" : 20,
            "headerConfig"    : {
                "middle" : {
                    "increment"  : 1,
                    "unit"       : "DAY",
                    "align"      : "center",
                    "dateFormat" : "W"
                }
            },
            "timeResolution"  : {
                "increment" : 1,
                "unit"      : "DAY"
            }
        });

        var timeAxis = t.getTimeAxis('customPreset', {
            autoAdjust : false,
            start      : new Date(2013, 8, 1),
            end        : new Date(2013, 9, 1)
        });

        var viewModel = new Sch.view.model.TimeAxis({
            viewPreset : 'customPreset',
            timeAxis   : timeAxis
        });

        viewModel.setAvailableWidth(200);

        t.is(viewModel.getTickWidth(), 20, "30 days (600 total width) in September so no need to stretch tick width");

        viewModel.setAvailableWidth(900);

        t.is(viewModel.getTickWidth(), 30, "Container size increased 30 ticks, stretched to 900 total (each tick 30)");

        viewModel.setAvailableWidth(200);

        t.is(viewModel.getTickWidth(), 20, "Container size decreased back to 200, should shrink to original value");

        viewModel.setTickWidth(40);

        t.is(viewModel.getTickWidth(), 40, "Tick width changed ok");
    })
})
