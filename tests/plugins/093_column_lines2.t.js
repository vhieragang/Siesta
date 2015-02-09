StartTest(function (t) {
    var sched;
    
    var doSetup = function () {
        if (sched) {
            sched.destroy();
        }
        sched = t.getScheduler(
            { 
                viewPreset  : 'secondAndMinute',
                startDate   : new Date(2014, 0, 1, 12, 0),
                endDate     : new Date(2014, 0, 1, 12, 5),
                renderTo    : Ext.getBody()
            }
        );   
    }
    
    var baseConfig      = {
        timeColumnWidth   : 35,
        rowHeight         : 32,
        displayDateFormat : 'G:i',
        shiftIncrement    : 1,
        shiftUnit         : "DAY",
        timeResolution    : {
            unit      : "MINUTE",
            increment : 15
        },
        defaultSpan       : 24,
        headerConfig        : {
            bottom : {
                unit       : "HOUR",
                increment  : 1,
                dateFormat : 'G'
            },
            middle : {
                unit      : "HOUR",
                increment : 12,
                renderer  : function (startDate, endDate, headerConfig, cellIdx) {
                    // Setting align on the header config object
                    headerConfig.align = 'center';
    
                    if (startDate.getHours() === 0) {
                        // Setting a custom CSS on the header cell element
                        headerConfig.headerCls = 'nightShift';
                        return Ext.Date.format(startDate, 'M d') + ' Night Shift';
                    }
                    else {
                        // Setting a custom CSS on the header cell element
                        headerConfig.headerCls = 'dayShift';
                        return Ext.Date.format(startDate, 'M d') + ' Day Shift';
                    }
                }
            },
            top    : {
                unit       : "DAY",
                increment  : 1,
                dateFormat : 'd M Y'
            }
        }
    }
    
    
    Sch.preset.Manager.registerPreset("testPreset1", Ext.apply(baseConfig, { columnLinesFor: 'top' }));
    
    Sch.preset.Manager.registerPreset("testPreset2", Ext.apply(baseConfig, { columnLinesFor: 'middle' }));
    
    Sch.preset.Manager.registerPreset("testPreset3", Ext.apply(baseConfig, { columnLinesFor: 'bottom' }));
    
    t.it('Should draw vertical lines', function (t) {
        doSetup();
        
        t.chain(
            {  waitForSelector  : '.sch-column-line' },
            function (next) {
                t.columnLinesSynced(sched, 'Proper number of lines is drawn');
                t.waitForEvent(sched.getSchedulingView().timeAxisViewModel, 'update', next);
                sched.switchViewPreset('weekAndDay', new Date(2014, 0, 1), new Date(2014, 0, 21));
            },
            { waitFor : 100 },
            function (next) {
                t.columnLinesSynced(sched, 'Proper number of lines is drawn');
                t.waitForEvent(sched.getSchedulingView().timeAxisViewModel, 'update', next);
                sched.switchViewPreset('secondAndMinute', new Date(2014, 0, 1, 12, 0), new Date(2014, 0, 1, 12, 5));
            },
            { waitFor : 100 },
            function (next) {
                t.columnLinesSynced(sched, 'Proper number of lines is drawn');
                next();
            }
        );
    });
    
    t.it('Should draw column lines from custom header', function (t) {
        doSetup();
        
        t.chain(
            {  waitForSelector  : '.sch-column-line' },
            function (next) {
                t.waitForEvent(sched.getSchedulingView().timeAxisViewModel, 'update', next);
                sched.switchViewPreset('testPreset1', new Date(2011, 0, 1), new Date(2011, 0, 2));
            },
            { waitFor : 100 },
            function (next) {
                t.columnLinesSynced(sched, 'Column lines correct');
                next();
            },
            function (next) {
                t.waitForEvent(sched.getSchedulingView().timeAxisViewModel, 'update', next);
                sched.switchViewPreset('testPreset2', new Date(2011, 0, 1), new Date(2011, 0, 2));
            },
            { waitFor : 100 },
            function (next) {
                t.columnLinesSynced(sched, 'Column lines correct');
                next();
            },
            function (next) {
                t.waitForEvent(sched.getSchedulingView().timeAxisViewModel, 'update', next);
                sched.switchViewPreset('testPreset3', new Date(2011, 0, 1), new Date(2011, 0, 2));
            },
            { waitFor : 100 },
            function (next) {
                t.columnLinesSynced(sched, 'Column lines correct');
                next();
            }
        );
    });
    
    t.it('Should draw lines using cellgenerator', function (t) {
        doSetup();
        
        var baseConfig = {
            timeColumnWidth         : 22,
            rowHeight               : 24,
            resourceColumnWidth     : 50,
            displayDateFormat       : 'G',

            shiftIncrement          : 1,
            shiftUnit               : "HOUR",
            defaultSpan             : 24,

            timeResolution          : {
                unit        : "HOUR",
                increment   : 1
            },


            headerConfig            : {
                top: {
                    unit: 'DAY',
                    dateFormat: 'l M j',
                    cellGenerator: function() {
                        var start, end, result = [];
                        
                        var shifts = [
                            {
                                name        : 'top - First',
                                startTime   : new Date(2010, 4, 22, 7),
                                endTime     : new Date(2010, 4, 23, 8)
                            },
                            {
                                name        : 'top - Second',
                                startTime   : new Date(2010, 4, 23, 8),
                                endTime     : new Date(2010, 4, 24, 8)
                            }
                        ];

                        Ext.each(shifts, function(shift) {
                            result.push({
                                start: shift.startTime,
                                end: shift.endTime,
                                header: Ext.String.format('{0}  {1} - {2}', shift.name,
                                        Ext.Date.format(shift.startTime, 'H:i'), Ext.Date.format(shift.endTime, 'H:i'))
                            })
                        });
                        return result;
                    }
                },
                middle: {
                    unit: 'HOUR',
                    cellGenerator: function() {
                        var start, end, result = [];
                        
                        var shifts = [
                            {
                                name        : 'middle - Day',
                                startTime   : new Date(2010, 4, 22, 7),
                                endTime     : new Date(2010, 4, 22, 19)
                            },
                            {
                                name        : 'middle - Night',
                                startTime   : new Date(2010, 4, 22, 19),
                                endTime     : new Date(2010, 4, 23, 7)
                            },
                            {
                                name        : 'middle - Day',
                                startTime   : new Date(2010, 4, 23, 7),
                                endTime     : new Date(2010, 4, 23, 15)
                            },
                            {
                                name        : 'middle - Evening',
                                startTime   : new Date(2010, 4, 23, 15),
                                endTime     : new Date(2010, 4, 23, 23)
                            },
                            {
                                name        : 'middle - Night',
                                startTime   : new Date(2010, 4, 23, 23),
                                endTime     : new Date(2010, 4, 24, 7)
                            }
                        ];

                        Ext.each(shifts, function(shift) {
                            result.push({
                                start: shift.startTime,
                                end: shift.endTime,
                                header: Ext.String.format('{0}  {1} - {2}', shift.name,
                                        Ext.Date.format(shift.startTime, 'H:i'), Ext.Date.format(shift.endTime, 'H:i'))
                            })
                        });
                        return result;
                    }
                },
                bottom: {
                    unit: 'HOUR',
                    increment: 1,
                    dateFormat: 'H',
                    cellGenerator: function() {
                        var start, end, result = [];
                        
                        var shifts = [
                            {
                                name        : 'bottom - Day',
                                startTime   : new Date(2010, 4, 22, 7),
                                endTime     : new Date(2010, 4, 22, 18)
                            },
                            {
                                name        : 'bottom - Night',
                                startTime   : new Date(2010, 4, 22, 18),
                                endTime     : new Date(2010, 4, 23, 9)
                            },
                            {
                                name        : 'bottom - Day',
                                startTime   : new Date(2010, 4, 23, 9),
                                endTime     : new Date(2010, 4, 23, 17)
                            },
                            {
                                name        : 'bottom - Evening',
                                startTime   : new Date(2010, 4, 23, 17),
                                endTime     : new Date(2010, 4, 24, 1)
                            },
                            {
                                name        : 'bottom - Night',
                                startTime   : new Date(2010, 4, 24, 1),
                                endTime     : new Date(2010, 4, 24, 14)
                            }
                        ];

                        Ext.each(shifts, function(shift) {
                            result.push({
                                start: shift.startTime,
                                end: shift.endTime,
                                header: Ext.String.format('{0}  {1} - {2}', shift.name,
                                        Ext.Date.format(shift.startTime, 'H:i'), Ext.Date.format(shift.endTime, 'H:i'))
                            })
                        });
                        return result;
                    }
                }

            }
        }
        
        Sch.preset.Manager.registerPreset('testPreset4', Ext.apply(baseConfig, { columnLinesFor: 'top' }));
        Sch.preset.Manager.registerPreset('testPreset5', Ext.apply(baseConfig, { columnLinesFor: 'middle' }));
        Sch.preset.Manager.registerPreset('testPreset6', Ext.apply(baseConfig, { columnLinesFor: 'bottom' }));
        
        t.chain(
            {  waitForSelector  : '.sch-column-line' },
            function (next) {
                t.waitForEvent(sched.getSchedulingView().timeAxisViewModel, 'update', next);
                sched.switchViewPreset('testPreset4', new Date(2010, 4, 22, 7), new Date(2010, 4, 24, 7));
            },
            { waitFor : 100 },
            function (next) {
                t.columnLinesSynced(sched, 'Column lines correct');
                next();
            },
            function (next) {
                t.waitForEvent(sched.getSchedulingView().timeAxisViewModel, 'update', next);
                sched.switchViewPreset('testPreset5', new Date(2010, 4, 22, 7), new Date(2010, 4, 24, 7));
            },
            { waitFor : 100 },
            function (next) {
                t.columnLinesSynced(sched, 'Column lines correct');
                next();
            },
            function (next) {
                t.waitForEvent(sched.getSchedulingView().timeAxisViewModel, 'update', next);
                sched.switchViewPreset('testPreset6', new Date(2010, 4, 22, 7), new Date(2010, 4, 24, 7));
            },
            { waitFor : 100 },
            function (next) {
                t.columnLinesSynced(sched, 'Column lines correct');
                next();
            }
        );
    });
    
});