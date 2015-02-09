StartTest(function(t) {

    Sch.preset.Manager.registerPreset('my', {
        timeColumnWidth : 60,   // Time column width (used for rowHeight in vertical mode)
        rowHeight: 24,          // Only used in horizontal orientation
        resourceColumnWidth : 200,  // Only used in vertical orientation
        displayDateFormat : 'G:i',  // Controls how dates will be displayed in tooltips etc
        shiftIncrement : 1,     // Controls how much time to skip when calling shiftNext and shiftPrevious.
        shiftUnit : "DAY",      // Valid values are "MILLI", "SECOND", "MINUTE", "HOUR", "DAY", "WEEK", "MONTH", "QUARTER", "YEAR".
        defaultSpan : 12,       // By default, if no end date is supplied to a view it will show 12 hours
        timeResolution : {      // Dates will be snapped to this resolution
            unit : "MINUTE",    // Valid values are "MILLI", "SECOND", "MINUTE", "HOUR", "DAY", "WEEK", "MONTH", "QUARTER", "YEAR".
            increment : 15
        },
        headerConfig : {    // This defines your header, you must include a "middle" object, and top/bottom are optional. For each row you can define "unit", "increment", "dateFormat", "renderer", "align", and "scope"
            middle : {              
                unit : "HOUR",
                dateFormat : 'G:i'
            },
            top : {
                unit : "DAY",
                dateFormat : 'D d/m'
            }
        }
    });
    
    var scheduler = t.getScheduler({
        renderTo        : Ext.getBody(),
        orientation     : 'vertical',
        viewPreset      : 'my'
    });
    
    
    var checkColumnWidth = function (index, width) {
        var diff = Math.abs(scheduler.normalGrid.headerCt.getHeaderAtIndex(index).getWidth() - width)
        
        t.isLess(diff, 5, 'Correct width for column [' + index + ']')
    }
    
    t.waitForEventsToRender(scheduler, function () {
        checkColumnWidth(0, 200)
        checkColumnWidth(1, 200)
        checkColumnWidth(2, 200)
    });
})    

