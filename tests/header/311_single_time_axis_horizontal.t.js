StartTest(function(t) {
    // see issue #93 
    
    Sch.preset.Manager.registerPreset('my', {
        timeColumnWidth : 150,
        rowHeight: 24,          // Only used in horizontal orientation
        resourceColumnWidth : 100,  // Only used in vertical orientation
        displayDateFormat : 'Y-m-d G:i',
        shiftUnit : "DAY",
        shiftIncrement : 1,
        defaultSpan : 5,       // By default, show 5 days
        timeResolution : {
            unit : "HOUR",
            increment : 1
        },
        headerConfig : {
            middle : {
                unit : "DAY",
                dateFormat : 'D d M'
            },
            top : {
                unit : "WEEK",
                renderer : function(start, end, cfg) {
                    return 'w.' + Ext.Date.format(start, 'W M Y');
                }
            }
        }
    });
    
    var scheduler = t.getScheduler({
        viewPreset      : 'my',

        flex            : 1,
        
        columns: [
            { header: 'Name', sortable: true, width: 100, dataIndex: 'Name' },
            { header: 'Id', sortable: true, width: 100, hidden : true, dataIndex: 'Id' }
        ]
    });
    
    var viewport       = new Ext.Container({
        renderTo        : Ext.getBody(),
        
        width           : 800,
        height          : 600,
        
        layout          : {
            type        : 'hbox',
            align       : 'stretch'
        },
        
        items           : [
            scheduler,
            {
                xtype   : 'container',
                
                width   : 20
            }
        ]
    });
    
    
    t.waitForEventsToRender(scheduler, function () {
        var schedulerView   = scheduler.getSchedulingView();
        var headerCt        = schedulerView.headerCt;
        
        var timeAxis        = headerCt.items.getAt(0);
        var columnsNum      = scheduler.timeAxis.getCount();
        
        // in 4.0.6 it can stick with width == 100
        t.isGreater(timeAxis.el.getWidth(), headerCt.el.getWidth(), 'Time axis has expanded horizontally');
        
        // quick&dirty border box adjustement 
        t.isApprox(timeAxis.el.getWidth(), 150 * columnsNum, 'Correct total width')
        
        // quick&dirty border box adjustement 
        t.isApprox(schedulerView.timeAxisViewModel.getTickWidth(), 150, 'Correct width from preset')
        
        
        var lockedHeader    = scheduler.lockedGrid.headerCt;
        
        t.isApprox(lockedHeader.getWidth(), 100, 'Initially only 1 column visible ..');
        
        lockedHeader.getGridColumns()[ 1 ].show()
        
        setTimeout(function () {
            t.isApprox(lockedHeader.getWidth(), 200, '2 columns now')
        }, 50);
        
        
        setTimeout(function () {
            
            viewport.setWidth(850);
            
            t.isApprox(lockedHeader.getWidth(), 200, 'The locked header still shows 2 columns after layout')
            
        }, 100);
        
        
        t.done(1000);
    });
})    
