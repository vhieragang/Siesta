Ext.define('TestApp.view.Main', {
    extend: 'Ext.container.Container',
    requires:[
        'Ext.tab.Panel',
        'Ext.layout.container.Border',
        'Sch.panel.SchedulerGrid'
    ],
    
    xtype: 'app-main',

    layout: {
        type: 'border'
    },

    items: [{
        region              : 'center',
        xtype               : 'schedulerpanel',
        
        viewPreset          : 'dayAndWeek',
        
        eventStore          : 'Events',
        resourceStore       : 'Resources',
        
        startDate           : new Date(2013, 10, 1), 
        endDate             : new Date(2013, 11, 1),
        
        columns             : [
            { text : 'Name', dataIndex : 'Name' }
        ]
    }]
});