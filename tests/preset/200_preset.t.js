StartTest(function(t) {
    t.ok(Sch.preset.Manager, 'Sch.preset.Manager exists');

    /* Properties each preset should have
        timeColumnWidth : 60,   
        rowHeight: 24,          
        resourceColumnWidth : 100,  
        displayDateFormat : 'G:i',  
        shiftIncrement : 1,     
        shiftUnit : "DAY",      
        defaultSpan : 12,       
        timeResolution : {      
            unit : "MINUTE",    
            increment : 15
        }
    */
    Ext.each(['hourAndDay', 
              'dayAndWeek', 
              'weekAndDay', 
              'weekAndMonth', 
              'monthAndYear', 
              'year', 
              'weekAndDayLetter', 
              'weekDateAndMonth'
             ], function(id) {
                var preset = Sch.preset.Manager.getPreset(id);
                t.ok(Ext.isObject(preset), 'Found preset ' + id);
                t.ok(Ext.isNumber(preset.timeColumnWidth), id + ': timeColumnWidth found');
                t.ok(Ext.isNumber(preset.rowHeight), id + ':rowHeight found');
                t.ok(Ext.isNumber(preset.resourceColumnWidth), id + ':resourceColumnWidth found');
                t.ok(Ext.isString(preset.displayDateFormat), id + ':displayDateFormat found');
                t.ok(Ext.isNumber(preset.shiftIncrement), id + ':shiftIncrement found');
                t.ok(Ext.isString(preset.shiftUnit), id + ':shiftUnit found');
                t.ok(Ext.isNumber(preset.defaultSpan), id + ':defaultSpan found');
                t.ok(Ext.isObject(preset.timeResolution), id + ':timeResolution found');
                t.ok(Ext.isString(preset.timeResolution.unit), id + ':timeResolution unit found');
                t.ok(Ext.isNumber(preset.timeResolution.increment), id + ':timeResolution increment found');
                t.ok(Ext.isObject(preset.headerConfig), id + ':headerConfig found');
                t.ok(Ext.isObject(preset.headerConfig.middle), id + ':headerConfig.middle found');
             }
    );
    
    Sch.preset.Manager.deletePreset('hourAndDay');
    t.notOk(Sch.preset.Manager.getPreset('hourAndDay'), 'Could delete a preset');

    Sch.preset.Manager.registerPreset("hourAndDay", {
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
    t.ok(Sch.preset.Manager.getPreset('hourAndDay'), 'Could register a new preset');
});
