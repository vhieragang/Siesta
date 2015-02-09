/* global App: true, ResourcePicker: true */
Ext.ns('App');
Ext.Loader.setConfig({ enabled : true, disableCaching : true });
Ext.Loader.setPath('Sch', '../../js/Sch');

Ext.require([
    'Sch.panel.SchedulerGrid',
    'Sch.plugin.Zones'
]);

Ext.define('ResourcePicker', {
    extend : 'Ext.window.Window',
    title  : 'Pick resource',
    modal  : true,
    border : false,
    width  : 175,

    initComponent : function () {
        var me = this;

        Ext.apply(me, {
            items : [
                {
                    xtype        : 'combobox',
                    itemId       : 'resourceField',
                    store        : me.resourceStore,
                    valueField   : 'Id',
                    displayField : 'Name',
                    allowBlank   : false,
                    editable     : false,
                    width        : '100%',
                    margin       : 0
                }
            ],
            fbar  : [
                {
                    xtype   : 'button',
                    text    : 'Save',
                    handler : function () {
                        var field = me.down('#resourceField');
                        if (field.isValid()) {
                            me.dragContext.resourceRecord = me.resourceStore.getById(field.getValue());
                            me.shouldFinalize = true;
                            me.close();
                        }
                    }
                },
                {
                    xtype   : 'button',
                    text    : 'Cancel',
                    handler : function () {
                        me.shouldFinalize = false;
                        me.close();
                    }
                }
            ]
        });

        me.callParent(arguments);
    },

    listeners : {
        close : function (panel) {
            panel.dragContext.finalize(panel.shouldFinalize);
        }
    }
});

Ext.onReady(function () {
    App.SchedulerDemo.init();
});

App.SchedulerDemo = {
    // Initialize application
    init : function () {

        var resourceStore = Ext.create("Sch.data.ResourceStore", {
            proxy : 'memory',
            data  : [
                {Id : 'r1', Name : 'Mike'},
                {Id : 'r2', Name : 'Jake'},
                {Id : 'r3', Name : 'King'},
                {Id : 'r4', Name : 'Brian'}
            ]
        });

        var currentDate = new Date();
        currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
        var index = currentDate.getDay() - 1;

        var startDate = Sch.util.Date.add(currentDate, 'd', -index);
        var endDate = Sch.util.Date.add(currentDate, 'd', (7 - index));

        var sched = Ext.create("Sch.panel.SchedulerGrid", {
            region             : 'center',
            viewPreset         : 'day',
            // you can specify any date here, calendar view will adjust time axis accordingly
            startDate          : new Date(2014, 8, 15),
            mode               : 'calendar',
            snapToIncrement    : true,
            eventResizeHandles : 'end',

//            weekStartDay       : 0,

            calendarTimeAxisCfg : {
                height : 30
            },

            highlightCurrentTime : true,

            eventBodyTemplate : '{Name}',

            eventRenderer : function (event, resource, data) {
                var resourceId = event.get('ResourceId');

                if (Ext.isString(resourceId)) {
                    data.cls = resourceId;
                }

                return event.data;
            },

            // Store holding all the resources
            resourceStore : resourceStore,

            // Store holding all the events
            eventStore    : Ext.create("Sch.data.EventStore", {
                data : [
                    { StartDate : new Date(2014, 8, 15), EndDate : new Date(2014, 8, 15, 3), Name : 'Event 1', ResourceId : 'r1' },
                    { StartDate : new Date(2014, 8, 15, 3), EndDate : new Date(2014, 8, 15, 6), Name : 'Event 2', ResourceId : 'r1' },
                    { StartDate : new Date(2014, 8, 15), EndDate : new Date(2014, 8, 15, 6), Name : 'Event 3', ResourceId : 'r2' },
                    { StartDate : new Date(2014, 8, 16, 3), EndDate : new Date(2014, 8, 16, 11), Name : 'Event 4', ResourceId : 'r2' },
                    { StartDate : new Date(2014, 8, 17, 2), EndDate : new Date(2014, 8, 17, 6), Name : 'Event 5', ResourceId : 'r3' },
                    { StartDate : new Date(2014, 8, 18, 8), EndDate : new Date(2014, 8, 18, 11), Name : 'Event 6', ResourceId : 'r3' },
                    { StartDate : new Date(2014, 8, 18, 8), EndDate : new Date(2014, 8, 18, 11), Name : 'Event 7', ResourceId : 'r4' },
                    { StartDate : new Date(2014, 8, 19, 8), EndDate : new Date(2014, 8, 19, 10), Name : 'Event 8', ResourceId : 'r4' }
                ]
            }),

            onEventCreated : function (newEventRecord) {
                // Overridden to provide some defaults before adding it to the store
                newEventRecord.set({
                    Name : "Hey, let's meet"
                });
            },

            listeners : {

                beforedragcreatefinalize : function (sched, context, e) {
                    var w = new ResourcePicker({
                        resourceStore : resourceStore,
                        dragContext   : context
                    });
                    w.showAt(e.getX(), e.getY());

                    return false;
                }
            }
        });

        var vp = new Ext.Viewport({
            layout : 'border',
            items  : [
                {
                    region  : 'north',
                    xtype   : 'component',
                    itemId  : 'header',
                    style   : 'text-align:right',
                    height  : 30,
                    padding : '5 10 5 5',
                    tpl     : new Ext.XTemplate('<span class="header-month">{month}</span><span class="header-year">{year}</span>'),
                    setDate : function (dt) {
                        this.update(
                            this.tpl.apply(
                                {
                                    month : Ext.Date.format(dt, 'F'),
                                    year  : Ext.Date.format(dt, 'Y')
                                }
                            )
                        );
                    }
                },
                {
                    region  : 'north',
                    xtype   : 'toolbar',
                    cls     : 'tbar',
                    padding : '0 10 0 5',
                    height  : 40,
                    border  : false,
                    items   : [
                        {
                            iconCls : 'icon-left',
                            handler : function () {
                                sched.timeAxis.shift(-7, Sch.util.Date.DAY);
                            }
                        },
                        {
                            text    : 'Today',
                            handler : function () {
                                sched.setStart(new Date());
                            }
                        },
                        {
                            iconCls : 'icon-right',
                            handler : function () {
                                sched.timeAxis.shift(7, Sch.util.Date.DAY);
                            }
                        },
                        '->',
                        {
                            xtype  : 'displayfield',
                            margin : '0 5 0 5',
                            value  : 'Resource filter:'
                        },
                        {
                            xtype        : 'combobox',
                            multiSelect  : true,
                            valueField   : 'Id',
                            displayField : 'Name',
                            editable     : false,
                            store        : resourceStore,
                            listeners    : {
                                change : function (field, newVal, oldVal) {
                                    sched.eventStore.clearFilter();

                                    if (!newVal.length) {
                                        return;
                                    }

                                    sched.eventStore.filter(function (record) {
                                        return Ext.Array.indexOf(newVal, record.getResourceId()) !== -1;
                                    });
                                }
                            }
                        }
                    ]
                },

                {
                    region  : 'east',
                    width   : 300,
                    xtype   : 'form',
                    frame   : true,
                    border  : false,
                    padding : '10',
                    split   : true,
                    items   : [
                        {
                            xtype      : 'textfield',
                            fieldLabel : 'Name',
                            name       : 'Name',
                            anchor     : '100%'
                        },
                        {
                            xtype      : 'datefield',
                            fieldLabel : 'Starts',
                            name       : 'StartDate',
                            readOnly   : true,
                            anchor     : '100%'
                        },
                        {
                            xtype      : 'textfield',
                            itemId     : 'resourceName',
                            fieldLabel : 'Assigned to',
                            anchor     : '100%'
                        }
                    ]
                },

                sched
            ]
        });

        var header = vp.down('#header').setDate(sched.getEnd());

        sched.on('eventclick', function (source, eventRecord) {
            var formPanel = vp.down('form');

            formPanel.getForm().loadRecord(eventRecord);
            formPanel.down('#resourceName').setValue(eventRecord.getResource().getName());
        });

        sched.on('viewchange', function () {
            var header = vp.down('#header');
            var dt = this.getEndDate();

            header.setDate(dt);
        });
    }
};
