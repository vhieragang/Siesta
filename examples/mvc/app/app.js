Ext.Loader.setConfig({
    enabled : true
});
Ext.Loader.setPath('Sch', './lib/js/Sch/');

Ext.application({
    name : 'DEMO',       // Global namespace

    appFolder : 'app',

    controllers        : [
        'EmployeeList',
        'Navigation',
        'Layout',
        'Scheduler'
    ],
    autoCreateViewport : false,

    launch : function () {
        Ext.create('Ext.container.Viewport', {
            layout : 'border',
            items  : [
                {
                    xtype  : 'AppHeader',
                    region : 'north'
                },
                {
                    xtype  : 'Navigation',
                    region : 'west'
                },
                {
                    layout     : 'card',
                    id         : 'centerContainer',
                    border     : false,
                    region     : 'center',
                    activeItem : 0,
                    layout     : {
                        deferredRender : true,
                        type           : 'card'
                    },
                    items      : [
                        { xtype : 'Scheduler', startDate : new Date(2009, 0, 1), endDate : new Date(2009, 11, 1) },
                        { xtype : 'EmployeeList' }
                    ]
                }
            ]
        });
    }
});