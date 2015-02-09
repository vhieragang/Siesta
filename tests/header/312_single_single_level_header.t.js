StartTest(function(t) {
    
    Sch.preset.Manager.registerPreset("second", {
        displayDateFormat : 'm:i:s',
        shiftIncrement : 1,
        shiftUnit : "DAY",
        timeResolution : {
            unit : "DAY",
            increment : 1
        },
        headerConfig : {
            middle : {
                unit : "DAY",
                dateFormat : 'i:s'
            }
        }
    });
    
    var scheduler = t.getScheduler({
        viewPreset      : 'second',
        lightWeight : true,
        renderTo        : Ext.getBody(),
        
        width           : 500,
        
        columns: [
            { header: 'Name', sortable: true, width: 100, dataIndex: 'Name' },
            { header: 'Id', sortable: true, width: 100, hidden : true, dataIndex: 'Id' }
        ]
    });
    
    
    t.waitForEventsToRender(scheduler, function () {
        var schedulerView   = scheduler.getSchedulingView();
        var headerCt        = schedulerView.headerCt;
        
        var timeAxis        = headerCt.items.getAt(0);
        
        t.isGreater(timeAxis.el.getWidth(), headerCt.el.getWidth(), 'Time axis has expanded horizontally');
    });
})    

