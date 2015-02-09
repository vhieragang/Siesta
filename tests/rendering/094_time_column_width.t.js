StartTest(function(t) {
    
    t.it('forceFit and columns need to be fitted, weekAndDayLetter', function (t) {
        var scheduler = t.getScheduler({
            title : 'forceFit and columns need to be fitted, weekAndDayLetter',
            height : 150,
            width : 600,
            renderTo : Ext.getBody(),
            startDate : new Date(2010,0,11), 
            endDate : Sch.util.Date.add(new Date(2010,0,11), Sch.util.Date.WEEK, 5), 
            viewPreset : 'weekAndDayLetter',
            forceFit : true
        });
    
        var headerEl = scheduler.normalGrid.headerCt.el;
    
        t.isApprox(
            headerEl.down('table td').getRight(),
             t.safeSelect('.sch-header-row-bottom td:nth-child(7)', headerEl.dom).getRight(),
            'Correct column width'
        );
    })
    
    
    t.it('No forceFit, but snapToIncrement. Months do not support snapping.', function (t) {
        var presetColWidth = Sch.preset.Manager.getPreset('monthAndYear').timeColumnWidth;
    
        var scheduler = t.getScheduler({
            title               : 'No forceFit, but snapToIncrement. Months do not support snapping.',
            height              : 150,
            width               : 600,
            snapToIncrement     : true,
            renderTo            : Ext.getBody(),
            viewPreset          : 'monthAndYear',
            startDate           : new Date(2010, 1, 1),
            endDate             : new Date(2010, 10, 1)
        });
        var view = scheduler.getSchedulingView();
    
        t.is(view.timeAxisViewModel.getTickWidth(), presetColWidth, 'monthAndYear #1 Column width matches view preset setting.');
        scheduler.switchViewPreset('monthAndYear', new Date(2010, 6, 1));
        t.is(view.timeAxisViewModel.getTickWidth(), presetColWidth, 'monthAndYear #2 Column width matches view preset setting.');
    })
    
    
    t.it('No forceFit and no snapToIncrement, and no need to expand the columns to fit the available width. Should just use the column width value from viewPreset.', function (t) {
        var presetColWidth = Sch.preset.Manager.getPreset('hourAndDay').timeColumnWidth;
    
        var scheduler = t.getScheduler({
            title : 'No forceFit and no snapToIncrement, and no need to expand the columns to fit the available width. Should just use the column width value from viewPreset.',
            height : 150,
            width : 600,
            renderTo : Ext.getBody(),
            viewPreset : 'hourAndDay',
            startDate : new Date(2010, 11, 9, 8),
            endDate : new Date(2010, 11, 9, 20)
        });
        var view = scheduler.getSchedulingView();
    
        t.is(view.timeAxisViewModel.getTickWidth(), presetColWidth, 'Column width matches view preset setting.');
    })
    
    
    t.it("No forceFit and no snapToIncrement, but columns don't consume entire available space and should grow to fit the available width.", function (t) {
        var scheduler = t.getScheduler({
            title : "No forceFit and no snapToIncrement, but columns don't consume entire available space and should grow to fit the available width.",
            height : 150,
            width : 600,
            renderTo : Ext.getBody(),
            viewPreset : 'hourAndDay',
            startDate : new Date(2010, 11, 9, 8),
            endDate : new Date(2010, 11, 9, 12)
        });
    
        var view = scheduler.getSchedulingView();
        t.isApprox(view.timeAxisViewModel.getTickWidth() * 4, scheduler.down('timeaxiscolumn').getAvailableWidthForSchedule(), 'Correct width when columns do not consume the whole available space');
    })

    
    t.it("No forceFit and no snapToIncrement, but columns don't consume entire available space and should grow to fit the available width.", function (t) {
        var scheduler = t.getScheduler({
            title : 'forceFit but no snapToIncrement, columns should fit in the available width.',
            height : 150,
            width : 600,
            renderTo : Ext.getBody(),
            viewPreset : 'hourAndDay',
            startDate : new Date(2010, 11, 9, 8),
            endDate : new Date(2010, 11, 9, 18),
            forceFit : true
        });
    
        var view = scheduler.getSchedulingView();
        t.is(view.timeAxisViewModel.getTickWidth(), Math.floor(scheduler.down('timeaxiscolumn').getAvailableWidthForSchedule()/view.timeAxis.getCount()), 'forceFit applied the correct column width');
    })
    
    
    t.it("No forceFit and no snapToIncrement, but columns don't consume entire available space and should grow to fit the available width.", function (t) {
        Sch.preset.Manager.registerPreset('workweek', {
            rowHeight           : 24,
            resourceColumnWidth: 135,
            timeColumnWidth: 115,
    
            displayDateFormat: 'G:i',
            shiftIncrement: 1,
            shiftUnit: "WEEK",
            timeResolution: {
                unit: "MINUTE",
                increment: 15
            },
            headerConfig: {
                middle: {
                    unit: "DAY",
                    dateFormat: 'Y-m-d'
                }
            }
        });
    
        var scheduler = t.getScheduler({
            title : 'no forceFit but snapToIncrement and the columns consume the available',
            height : 150,
            width : 600,
            renderTo : Ext.getBody(),
            viewPreset : 'workweek',
            startDate : new Date(2010, 11, 9),
            endDate : new Date(2010, 11, 16),
            forceFit : true,
            snapToIncrement : true
        });
    
        var view = scheduler.getSchedulingView();
    
        var snapAmount = view.getSnapPixelAmount();
    
        // 1440 mins per day / 15 min increment => 96 "quarters" per day so minimum 96 pixels for a whole day to support snapToIncrement
        // Since columns don't consume all space, their size will be doubled
        t.is(Math.floor(snapAmount), snapAmount, 'view.getSnapPixelAmount() returns an even number: ' + snapAmount);
        t.is(view.timeAxisViewModel.getTickWidth(), (24*60/15), 'Correct column width when snapToIncrement and resolution affects the column width');
    })
    
    
    t.it("No forceFit and no snapToIncrement, but columns don't consume entire available space and should grow to fit the available width.", function (t) {
        Sch.preset.Manager.registerPreset('workweek', {
            rowHeight           : 24,
            resourceColumnWidth: 135,
            timeColumnWidth: 115,
    
            displayDateFormat: 'G:i',
            shiftIncrement: 1,
            shiftUnit: "WEEK",
            timeResolution: {
                unit: "MINUTE",
                increment: 15
            },
            headerConfig: {
                middle: {
                    unit: "DAY",
                    dateFormat: 'Y-m-d'
                }
            }
        });
    
        var scheduler = t.getScheduler({
            title : 'no forceFit but snapToIncrement and the columns do not consume the available space => and they should grow',
            height : 150,
            width : 600,
            renderTo : Ext.getBody(),
            viewPreset : 'workweek',
            startDate : new Date(2010, 11, 9),
            endDate : new Date(2010, 11, 12),
            forceFit : false,
            snapToIncrement : true
        });
    
        var view = scheduler.getSchedulingView();
    
        var snapAmount = view.getSnapPixelAmount();
    
        // 1440 mins per day / 15 min increment => 96 "quarters" per day so minimum 96 pixels for a whole day to support snapToIncrement
        // Since columns don't consume all space, their size will be doubled
        t.is(Math.floor(snapAmount), snapAmount, 'view.getSnapPixelAmount() returns an even number: ' + snapAmount);
        t.is(view.timeAxisViewModel.getTickWidth(), 2*(24*60/15), 'Correct column width when snapToIncrement and resolution affects the column width');
    })

    
    t.it("No forceFit and no snapToIncrement, but columns don't consume entire available space and should grow to fit the available width.", function (t) {
        Sch.preset.Manager.registerPreset('weekAndDayLetter', {
            timeColumnWidth : 139,  // Something not evenly divisible by 7
            rowHeight: 24,
            resourceColumnWidth : 100,
            displayDateFormat : 'Y-m-d',
            shiftUnit : "WEEK",
            shiftIncrement : 1,
            defaultSpan : 10,
            timeResolution : {
                unit : "DAY",
                increment : 1
            },
            headerConfig : {
                    bottom : {
                    unit : "DAY",
                    dateFormat : 'D d M Y',
                    increment : 1
                },
                middle : {
                    unit : "WEEK",
                    dateFormat : 'D d M Y',
                    align : 'left'
                }
            }
        });
    
        var scheduler = t.getScheduler({
            title : 'no forceFit but snapToIncrement and the resolution is 1 day',
            height : 150,
            width : 600,
            renderTo : Ext.getBody(),
            startDate : new Date(2010,0,11),
            endDate : Sch.util.Date.add(new Date(2010,0,11), Sch.util.Date.WEEK, 20),
            viewPreset : 'weekAndDayLetter',
            forceFit : false,
            snapToIncrement : true
        });
    
        var view = scheduler.getSchedulingView();
    
        var snapAmount = view.getSnapPixelAmount();
        
        t.is(Math.floor(snapAmount), snapAmount, 'view.getSnapPixelAmount() returns an even number');
    
        t.is(view.timeAxisViewModel.getTickWidth(), 139, 'Correct column width when snapToIncrement and resolution affects the column width');
    })
});
