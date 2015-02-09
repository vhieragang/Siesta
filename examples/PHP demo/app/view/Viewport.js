Ext.define('MyApp.view.Viewport', {
    extend      : 'Ext.container.Viewport',

    requires    : [
        'Ext.layout.container.Fit',
        'Ext.window.MessageBox',
        'Sch.data.CrudManager',
        'MyApp.store.CrudManager',
        'MyApp.store.ResourceStore',
        'MyApp.store.EventStore',
        'MyApp.view.Scheduler'
    ],

    layout      : {
        type    : 'fit'
    },

    processError : function (crud, response) {
        Ext.Msg.show({
            title   : 'Error',
            msg     : response.message,
            icon    : Ext.Msg.ERROR,
            buttons : Ext.Msg.OK,
            minWidth: Ext.Msg.minWidth
        });
    },

    initComponent : function() {
        var resourceStore   = Ext.create('MyApp.store.ResourceStore');

        var eventStore      = Ext.create('MyApp.store.EventStore');

        var crudManager     = Ext.create('MyApp.store.CrudManager', {
            resourceStore   : resourceStore,
            eventStore      : eventStore,
            listeners       : {
                loadfail    : this.processError,
                syncfail    : this.processError,

                scope       : this
            }
        });

        var startDate   = new Date(2012, 8, 10),
            endDate     = Sch.util.Date.add(startDate, Sch.util.Date.WEEK, 2);

        this.items  = Ext.create('MyApp.view.Scheduler', {
            eventBarTextField   : 'Name',
            viewPreset          : 'dayAndWeek',
            startDate           : startDate,
            endDate             : endDate,
            title               : 'Scheduler with pagination',
            eventResizeHandles  : 'both',
            width               : 800,
            height              : 350,

            crudManager         : crudManager,

            tbar                : [
                {
                    text    : 'Add new resource',
                    iconCls : 'icon-add',
                    border  : 1,
                    handler : function() {
                        resourceStore.add(new resourceStore.model({ Name : 'New resource' }));
                    }
                },
                '-',
                {
                    text    : 'Save changes',
                    iconCls : 'icon-save',
                    itemId  : 'save-button',
                    handler : function() {
                        crudManager.sync();
                    }
                },
                {
                    iconCls         : 'togglebutton',
                    text            : 'Sync changes automatically',
                    scope           : this,
                    enableToggle    : true,
                    handler         : function(btn) {
                        this.down('#save-button').setDisabled(btn.pressed);
                        crudManager.autoSync = btn.pressed;
                    }
                }
            ],
            //define bottom bar with pagination buttons
            bbar                : {
                xtype           : 'sch_pagingtoolbar',
                store           : resourceStore,
                displayInfo     : true,
                displayMsg      : 'Displaying resources {0} - {1} of {2}',
                emptyMsg        : "No resources to display"
            }
        });

        this.callParent(arguments);
    }
});
