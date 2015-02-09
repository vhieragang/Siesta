Ext.define("App.DemoScheduler", {
    extend : "Sch.panel.SchedulerGrid",

    requires : [
        'App.DemoEditor',
        'Ext.grid.plugin.CellEditing'
    ],

    rowHeight            : 34,
    snapToIncrement      : true,
    eventBarIconClsField : 'EventType',
    forceFit             : true,

    eventRenderer : function (item, resourceRec, tplData) {
        var bookingStart = item.getStartDate();
        tplData.style = 'background-color:' + (resourceRec.get('Color') || 'Coral');

        return {
            headerText : Ext.Date.format(bookingStart, this.getDisplayDateFormat()),
            footerText : item.getName()
        };
    },


    initComponent : function () {
        var me = this;

        Ext.apply(this, {

            columns           : [
                { header : 'Staff', sortable : true, width : 80, dataIndex : 'Name', field : { xtype : 'textfield' } },
                {
                    header : 'Type', sortable : true, width : 120, dataIndex : 'Type', field : {
                    xtype          : 'combobox',
                    store          : ['Sales', 'Developer', 'Marketing', 'Product manager'],
                    typeAhead      : true,
                    forceSelection : true,
                    triggerAction  : 'all',
                    selectOnFocus  : true
                }
                },
                {
                    header    : 'Task Color',
                    sortable  : false,
                    width     : 100,
                    dataIndex : 'Color',
                    field     : { xtype : 'textfield' }
                },
                {
                    xtype : 'actioncolumn',

                    sortable : false,
                    align    : 'center',
                    tdCls    : 'sch-valign',
                    width    : 32,

                    position : 'right',

                    items : [
                        {
                            iconCls : 'delete',
                            tooltip : 'Clear row',
                            scope   : this,
                            handler : function (view, rowIndex, colIndex, btn, e, resource) {
                                var events = resource.getEvents(),
                                    toRemove = [],
                                    viewStart = me.getStart(),
                                    viewEnd = me.getEnd();

                                Ext.each(events, function (ev) {
                                    if (Sch.util.Date.intersectSpans(viewStart, viewEnd, ev.getStartDate(), ev.getEndDate())) {
                                        toRemove.push(ev);
                                    }
                                });

                                this.eventStore.remove(toRemove);
                            }
                        }
                    ]
                }
            ],

            // Specialized body template with header and footer
            eventBodyTemplate : '<div class="sch-event-header">{headerText}</div><div class="sch-event-footer">{footerText}</div>',

            border : true,
            tbar   : [
                {
                    iconCls : 'icon-previous',
                    scale   : 'medium',
                    scope   : this,
                    handler : function () {
                        this.shiftPrevious();
                    }
                },
                {
                    id           : 'span3',
                    enableToggle : true,
                    text         : 'Select Date...',
                    toggleGroup  : 'span',
                    scope        : this,
                    menu         : Ext.create('Ext.menu.DatePicker', {
                        handler : function (dp, date) {
                            var D = Ext.Date;
                            this.setTimeSpan(D.add(date, D.HOUR, 8), D.add(date, D.HOUR, 18));
                        },
                        scope   : this
                    })
                },
                '->',
                {
                    text    : 'Horizontal view',
                    pressed : true,

                    enableToggle : true,
                    toggleGroup  : 'orientation',

                    iconCls : 'icon-horizontal',

                    scope   : this,
                    handler : function () {
                        this.setOrientation('horizontal');
                    }
                },
                {
                    text : 'Vertical view',

                    enableToggle : true,
                    toggleGroup  : 'orientation',

                    iconCls : 'icon-vertical',

                    scope   : this,
                    handler : function () {
                        this.setOrientation('vertical');
                    }
                },
                {
                    iconCls : 'icon-cleardatabase',
                    tooltip : 'Clear database',
                    scale   : 'medium',
                    scope   : this,
                    handler : function () {
                        this.eventStore.removeAll();
                    }
                },
                {
                    iconCls : 'icon-next',
                    scale   : 'medium',
                    scope   : this,
                    handler : function () {
                        this.shiftNext();
                    }
                }
            ],

            tooltipTpl : new Ext.XTemplate(
                '<dl class="eventTip">',
                '<dt class="icon-clock">Time</dt><dd>{[Ext.Date.format(values.StartDate, "Y-m-d G:i")]}</dd>',
                '<dt class="icon-task">Task</dt><dd>{Title}</dd>',
                '<dt class="icon-earth">Location</dt><dd>{Location}&nbsp;</dd>',
                '</dl>'
            ),

            plugins : [
                {
                    ptype : 'myeditor'
                    // Editor configuration goes here
                },

                {
                    ptype        : 'cellediting',
                    clicksToEdit : 1
                },

                {
                    ptype : 'scheduler_zones',
                    store : this.zoneStore
                }
            ],

            onEventCreated : function (newEventRecord) {
                // Overridden to provide some default values
                newEventRecord.set('Title', 'New task...');
                newEventRecord.set('Location', 'Local office');

                newEventRecord.set('EventType', 'Meeting');
            }
        });

        this.callParent(arguments);
    }
});