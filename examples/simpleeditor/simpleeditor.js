//Ext.Loader.setConfig({ enabled : true, disableCaching : true });
//Ext.Loader.setPath('Sch', '../../js/Sch');

//Ext.require([
//    'Sch.panel.SchedulerGrid',
//    'Sch.plugin.SimpleEditor'
//]);

Ext.onReady(function () {
    var resourceStore = Ext.create('Sch.data.ResourceStore', {
            sorters : {
                property  : 'Name',
                direction : "ASC"
            },
            model   : 'Sch.model.Resource',
            data    : [
                { Id : 'c1', Name : 'Lion' },
                { Id : 'c2', Name : 'Wildebeest' },
                { Id : 'c3', Name : 'Elephant' },
                { Id : 'c4', Name : 'Tiger' },
                { Id : 'c5', Name : 'Whale' },
                { Id : 'c6', Name : 'Parrot' }
            ]
        }),
        sm = Ext.create('Ext.selection.CheckboxModel'),

    // Store holding all the events
        eventStore = Ext.create('Sch.data.EventStore', {
            data : [
                { ResourceId : 'c1', Name : 'Mike', StartDate : "2010-12-09 09:45", EndDate : "2010-12-09 11:00" },
                { ResourceId : 'c2', Name : 'Linda', StartDate : "2010-12-09 10:15", EndDate : "2010-12-09 12:00" },
                { ResourceId : 'c3', Name : 'Don', StartDate : "2010-12-09 13:00", EndDate : "2010-12-09 15:00" },
                { ResourceId : 'c4', Name : 'Karen', StartDate : "2010-12-09 16:00", EndDate : "2010-12-09 18:00" },
                { ResourceId : 'c5', Name : 'Doug', StartDate : "2010-12-09 12:00", EndDate : "2010-12-09 13:00" },
                { ResourceId : 'c6', Name : 'Peter', StartDate : "2010-12-09 14:00", EndDate : "2010-12-09 16:00" }
            ]
        });

    var scheduler = Ext.create("Sch.panel.SchedulerGrid", {
        height            : ExampleDefaults.height,
        width             : ExampleDefaults.width,
        renderTo          : 'example-container',  // An HTML element in the page (see simpleeditor.html)
        title             : 'Simple Editor Demo',
        viewPreset        : 'hourAndDay',
        startDate         : new Date(2010, 11, 9, 8),
        endDate           : new Date(2010, 11, 9, 20),
        eventBarTextField : 'Name',

        onEventCreated : function (ev) {
            ev.set('Name', 'New booking');
        },

        // Setup static columns
        columns        : [
            { text : 'Animal', width : 130, dataIndex : 'Name', sortable : true }
        ],
        plugins        : new Sch.plugin.SimpleEditor({
            dataIndex : 'Name',
            field     : {
                xtype         : 'textfield',
                margin        : '-3 -3 0 0',
                selectOnFocus : true
            }
        }),
        selModel       : sm,
        // Store holding all the resources
        resourceStore  : resourceStore,

        // Store holding all the events
        eventStore     : eventStore,

        rowHeight       : 35,
        snapToIncrement : false,
        barMargin       : 4,

        tbar : [
            {
                text    : 'Previous day',
                iconCls : 'icon-previous',
                handler : function () {
                    scheduler.shiftPrevious();
                }
            },
            {
                text    : 'Next day',
                iconCls : 'icon-next',
                handler : function () {
                    scheduler.shiftNext();
                }
            },
            {
                text    : 'New booking...',
                icon    : 'add.png',
                handler : function () {
                    if (sm.selected.getCount() <= 0) {
                        Ext.Msg.alert('Error', 'You must select at least one animal to book');
                        return;
                    }

                    if (!this.win) {
                        this.win = new Ext.Window({
                            height  : 200,
                            width   : 350,
                            title   : 'New booking...',
                            layout  : 'fit',
                            modal   : true,
                            items   : [
                                {
                                    xtype     : 'form',
                                    bodyStyle : 'padding:10px',
                                    items     : [
                                        {
                                            xtype      : 'textfield',
                                            fieldLabel : 'Name',
                                            name       : 'name'
                                        },
                                        {
                                            xtype      : 'fieldcontainer',
                                            fieldLabel : 'Starts',
                                            msgTarget  : 'side',
                                            layout     : 'hbox',
                                            defaults   : {
                                                flex      : 1,
                                                hideLabel : true
                                            },
                                            items      : [
                                                {
                                                    xtype      : 'datefield',
                                                    name       : 'startDate',
                                                    margin     : '0 5 0 0',
                                                    value      : new Date(2010, 11, 9),
                                                    allowBlank : false
                                                },
                                                {
                                                    xtype      : 'timefield',
                                                    name       : 'startTime',
                                                    value      : '09:00',
                                                    allowBlank : false
                                                }
                                            ]
                                        },
                                        {
                                            xtype      : 'fieldcontainer',
                                            fieldLabel : 'Ends',
                                            msgTarget  : 'side',
                                            layout     : 'hbox',
                                            defaults   : {
                                                flex      : 1,
                                                hideLabel : true
                                            },
                                            items      : [
                                                {
                                                    xtype      : 'datefield',
                                                    name       : 'endDate',
                                                    margin     : '0 5 0 0',
                                                    value      : new Date(2010, 11, 9),
                                                    allowBlank : false
                                                },
                                                {
                                                    xtype      : 'timefield',
                                                    name       : 'endTime',
                                                    value      : '11:00',
                                                    allowBlank : false
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ],
                            buttons : [
                                {
                                    text    : 'Save',
                                    scope   : this,
                                    handler : function () {
                                        var values = this.win.down('form').getForm().getValues();

                                        sm.selected.each(function (resource) {
                                            eventStore.add(new Sch.model.Event({
                                                StartDate  : Ext.Date.parseDate(values.startDate + values.startTime, 'm/d/Yg:i A'),
                                                EndDate    : Ext.Date.parseDate(values.endDate + values.endTime, 'm/d/Yg:i A'),
                                                Name       : values.name,
                                                ResourceId : resource.get('Id')
                                            })
                                            );
                                        });

                                        this.win.hide();
                                    }
                                },
                                {
                                    text    : 'Cancel',
                                    scope   : this,
                                    handler : function () {
                                        this.win.hide();
                                    }
                                }
                            ]
                        });
                    }

                    this.win.show();
                }
            }
        ]
    });
});