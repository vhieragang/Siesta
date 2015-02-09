StartTest(function (t) {
    t.diag('Double clicking any time header row should fire an event');

    Sch.preset.Manager.registerPreset("foo", {
        timeColumnWidth   : 20,
        rowHeight         : 32,
        displayDateFormat : 'G:i',
        shiftIncrement    : 1,
        shiftUnit         : "DAY",
        timeResolution    : {
            unit      : "MINUTE",
            increment : 15
        },
        defaultSpan       : 24,
        headerConfig      : {
            bottom : {
                unit       : "HOUR",
                increment  : 1,
                dateFormat : 'G'
            },
            middle : {
                unit       : "DAY",
                increment  : 1,
                dateFormat : 'd M'
            },
            top    : {
                unit       : "MONTH",
                increment  : 1,
                dateFormat : 'd M Y'
            }
        }
    });

    var timeAxis = t.getTimeAxis('foo', {
        start : new Date(2011, 1, 1),
        end   : new Date(2011, 1, 3)
    });

    var view = new Sch.view.HorizontalTimeAxis({
        timeAxis        : timeAxis,
        model           : new Sch.view.model.TimeAxis({
            viewPreset      : 'foo',
            timeAxis        : timeAxis
        }),
        containerEl : document.body
    });

    // 48 columns times 20px, perfect fit
    view.model.update(960);

    var timeAxisColWidth = Sch.preset.Manager.getPreset("foo").timeColumnWidth;
    t.is(view.model.getTickWidth(), timeAxisColWidth, 'view.model.getTickWidth OK');
    t.is(view.model.getTotalWidth(), 48 * timeAxisColWidth, 'view.model.getTotalWidth OK');

    t.isGE(Ext.select('table').getCount(), 3, '3 tables found');

    // Since implementation varies depending on browser (webkit), we're allowing a 1px diff

    var bottomTotal = 0;
    
    // `subTest` instead of `it`, to launch it immediately (`it` will start with a delay)
    t.subTest('Verify bottom row cell widths', function (t) {
        Ext.select('.sch-header-row-bottom td').each(function (el, c, index) {
            var w = el.getWidth();
            t.isApprox(w, 20, 1, 'Correct width for bottom cell ' + index)
            bottomTotal += w;
        });
    })

    t.isApprox(Ext.getBody().down('.sch-header-row-bottom').getWidth(), bottomTotal, 1, 'Correct width for bottom table')
    t.isApprox(Ext.getBody().down('.sch-header-row-middle').getWidth(), bottomTotal, 1, 'Correct width for mid table')
    t.isApprox(Ext.getBody().down('.sch-header-row-top').getWidth(), bottomTotal, 1, 'Correct width for top table')

    // `subTest` instead of `it`, to launch it immediately (`it` will do delay)
    t.subTest('Verify middle row cell widths', function (t) {
        Ext.select('.sch-header-row-middle td').each(function (el, c, index) {
            t.isApprox(el.getWidth(), 480, 1, 'Correct width for middle cell ' + index)
        })
    })

    // Verify top row cell width
    t.isApprox(Ext.getBody().down('.sch-header-row-top td').getWidth(), bottomTotal, 1, 'Correct width for top table cell');

    var timeAxis = t.getTimeAxis('dayAndWeek', {
        start : new Date(2012, 5, 4),
        end   : new Date(2012, 5, 11)
    });

    t.diag('Make sure view reacts to timeAxis filtering');

    var view = new Sch.view.HorizontalTimeAxis({
        timeAxis    : timeAxis,
        model       : new Sch.view.model.TimeAxis({
            viewPreset  : 'dayAndWeek',
            timeAxis    : timeAxis
        }),
        containerEl : document.body
    });


    t.subTest('Refresh event fires on model update', function (t) {
        t.firesOnce(view, 'refresh');

        view.model.update(960);
    })

    t.is(Ext.select('.sch-header-row-middle td').getCount(), 7, '7 day cells found')

    t.subTest('Refresh event fires on timeaxis filter', function (t) {
        t.firesOnce(view, 'refresh');

        timeAxis.filterBy(function (tick) {
            return tick.start.getDay() === 6 || tick.start.getDay() === 0;
        });
    });

    t.is(Ext.select('.sch-header-row-middle td').getCount(), 2, '2 weekend day cells found after filter')

    timeAxis.clearFilter();

    t.is(Ext.select('.sch-header-row-middle td').getCount(), 7, '7 day cells found after clearing filter')
})
