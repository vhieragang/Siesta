StartTest(function(t) {
    
    Sch.preset.Manager.registerPreset("dayNightShift", {
        timeColumnWidth : 35,
        rowHeight : 32,
        displayDateFormat : 'G:i',
        shiftIncrement : 1,
        shiftUnit :"DAY",
        timeResolution : {
            unit :"MINUTE",
            increment : 15
        },
        defaultSpan : 24,
        headerConfig : {
            bottom : {
                unit :"HOUR",
                increment : 1,
                dateFormat : 'G'
            },
            middle : {
                unit :"HOUR",
                increment : 12,
                renderer : function(startDate, endDate, headerConfig, cellIdx) {
                    // Setting align on the header config object
                    headerConfig.align = 'center';

                    if (startDate.getHours()===0) {
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
            top : {
                unit :"DAY",
                increment : 1,
                dateFormat : 'd M Y'
            }
        }
    });
    
    // a scheduler with 3 level headers
    var scheduler = t.getScheduler({
        viewPreset      : 'dayNightShift',
        
        renderTo        : Ext.getBody()
    });

    
    t.waitForEventsToRender(scheduler, function () {
        var normalHeader    = scheduler.normalGrid.headerCt;
        var lockedHeader    = scheduler.lockedGrid.headerCt;
        
        var initialHeight   = normalHeader.getHeight()
        
        t.is(normalHeader.getHeight(), lockedHeader.getHeight(), 'Both headers have the same height');
        t.is(scheduler.normalGrid.body.getStyle('top'), scheduler.lockedGrid.body.getStyle('top'), 'Both grid body elements are aligned "top"');
        
        t.isApprox(scheduler.lockedGrid.body.getTop(), lockedHeader.getHeight(), 'The body starts after header, not in the middle of it')
        
        // reducing the number of levels to 2 - the height of headers should decrease
        // also the content should move a little bit top
        scheduler.switchViewPreset('dayAndWeek')
        
        setTimeout(function() {
            
            t.is(normalHeader.getHeight(), lockedHeader.getHeight(), 'Both headers have the same height after preset switch');
            
            t.is(scheduler.normalGrid.body.getStyle('top'), scheduler.lockedGrid.body.getStyle('top'), 'Both grid body elements are aligned "top"');
            
            t.isLess(normalHeader.getHeight(), initialHeight, 'Height should decrease, as header becomes 2 level instead of 3');
            
            t.isApprox(scheduler.lockedGrid.body.getTop(), lockedHeader.getHeight(), 5, 'The body starts after header, not in the middle of it')
            
            t.isApprox(lockedHeader.el.down('.x-box-inner').getHeight(), lockedHeader.getHeight(), 5, 'The inner content of the locked header fits the whole header')
            
        }, 100)
        
        t.done(1000);
    });
})    
