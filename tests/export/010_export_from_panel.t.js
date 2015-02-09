StartTest(function(t) {

    var schedulerPanel = t.getScheduler({
        region  : 'center',
        plugins : Ext.create('Sch.plugin.Export', {
            printServer     : 'foo',
            test            : true,
            openAfterExport : false
        }),
        lockedGridConfig : {
            title       : 'Tasks',
            collapsible : true
        },
        schedulerConfig : {
            collapsible : true,
            title       : 'Schedule'
        }
    });

    Ext.create("Ext.panel.Panel", {
        title       : 'Main panel',
        width       : 900,
        height      : 700,
        renderTo    : Ext.getBody(),
        layout      :'border',
        defaults    : {
            collapsible : true,
            split       : true
        },
        items       : [
            {
                xtype   : 'panel',
                title   : 'The sidebar',
                region  : 'west',
                width   : 100
            },
            schedulerPanel
        ]
    });

    t.waitForRowsVisible(schedulerPanel, function (result) {
        var normalLeft  = schedulerPanel.normalGrid.getEl().getStyle('left');
        var async = t.beginAsync(45000);

        schedulerPanel.doExport(null, function (response) {
            t.is(normalLeft, schedulerPanel.normalGrid.getEl().getStyle('left'), 'Normal grid aligned properly');
            t.endAsync(async);
        });
    });
});
