Ext.ns('App');
Ext.Loader.setConfig({enabled : true, disableCaching : true});
Ext.Loader.setPath('Sch', '../../js/Sch');

Ext.require([
    'Sch.panel.SchedulerGrid',
    'Sch.plugin.Zones'
]);

Ext.define('Event', {
    extend    : 'Sch.model.Event',
    nameField : 'Title',

    fields : [
        {name : 'Title'},
        {name : 'Type'}
    ]
});

Ext.define('SchedulerDemo.view.MyScheduler', {
    extend : 'Sch.panel.SchedulerGrid',
    alias  : 'widget.myscheduler',

    rowHeight               : 40,
    eventBarTextField       : 'Title',
    viewPreset              : 'hourAndDay',
    mode                    : 'vertical',
    constrainDragToResource : false,
    snapToIncrement         : true,
    //constrainDragToResource : true,
    eventResizeHandles      : 'end',
    resourceColumnWidth     : 160,

    // For horizontal mode
    columns                 : [
        {
            text      : 'Name',
            width     : 200,
            sortable  : true,
            dataIndex : 'Name'
        }
    ],

    viewConfig : {
        altColCls  : '',
        stripeRows : false
    },

    eventBodyTemplate : '<span class="time">{[Ext.Date.format(values.StartDate, "G:i")]}</span> {Title}',

    eventRenderer : function (event, resource, data) {
        data.cls = resource.data.Name;
        return event.data;
    },

    lockedViewConfig : {
        getRowClass : function (resource) {
            return resource.data.Name;
        }
    },

    timeAxisColumnCfg : {
        text : 'Time of day'
    },

    // Store holding all the resources
    resourceStore     : {
        xclass : 'Sch.data.ResourceStore',
        model  : 'Sch.model.Resource',
        data   : [
            {Id : 'MadMike', Name : 'Mike'},
            {Id : 'JakeTheSnake', Name : 'Jake'},
            {Id : 'KingFu', Name : 'King'},
            {Id : 'BeerBrian', Name : 'Brian'},
            {Id : 'LindaAnderson', Name : 'Linda'},
            {Id : 'DonJohnson', Name : 'Don'},
            {Id : 'KarenJohnson', Name : 'Karen'},
            {Id : 'DougHendricks', Name : 'Doug'},
            {Id : 'PeterPan', Name : 'Peter'}
        ]
    },

    // Store holding all the events
    eventStore        : {
        xclass : 'Sch.data.EventStore',
        model  : 'Event',
        data   : [
            {
                ResourceId : 'MadMike',
                Type       : 'Call',
                Title      : 'Assignment 1',
                StartDate  : "2011-12-09 10:00",
                EndDate    : "2011-12-09 11:00"
            },
            {
                ResourceId : 'KarenJohnson',
                Type       : 'Call',
                Title      : 'Customer call',
                StartDate  : "2011-12-09 14:00",
                EndDate    : "2011-12-09 16:00"
            },
            {
                ResourceId : 'LindaAnderson',
                Type       : 'Meeting',
                Title      : 'Assignment 2',
                StartDate  : "2011-12-09 10:00",
                EndDate    : "2011-12-09 12:00"
            }
        ]
    },

    plugins          : [
        {
            ptype : 'scheduler_zones',
            store : {
                xclass : 'Ext.data.JsonStore',
                model  : 'Sch.model.Range',
                data   : [
                    {
                        // Nice 2 hour lunch
                        StartDate : new Date(2011, 11, 9, 12),
                        EndDate   : new Date(2011, 11, 9, 14),
                        Cls       : 'lunch-style'
                    }
                ]
            },

        },
        'scheduler_simpleeditor',
        'responsive'
    ],

    // Uncomment this to make the Scheduler react to viewport size changes, for example when changing orientation on an iPad
    //responsiveConfig : {
    //    "width<height"  : {mode : "vertical"},
    //    "width>=height" : {mode : "horizontal"}
    //},

    onEventCreated : function (newEventRecord) {
        // Overridden to provide some defaults before adding it to the store
        newEventRecord.set({
            Title : "New appointment",
            Type  : 'Meeting'
        });
    },

    initComponent : function () {
        this.tbar = [
            {
                text         : 'Vertical view',
                pressed      : true,
                iconCls      : 'icon-vertical',
                enableToggle : true,
                toggleGroup  : 'orientation',
                scope        : this,
                handler      : function () {
                    this.setMode('vertical');
                }
            },
            {
                text         : 'Horizontal view',
                enableToggle : true,
                iconCls      : 'icon-horizontal',
                toggleGroup  : 'orientation',
                scope        : this,
                handler      : function () {
                    this.setMode('horizontal');
                }
            },
            '->',
            {
                text    : 'Fit columns',
                scope   : this,
                handler : function () {
                    Ext.getCmp('colwidth-slider').suspendEvents();
                    this.getSchedulingView().fitColumns();
                    Ext.getCmp('colwidth-slider').resumeEvents();
                }
            },
            'Column Width:',
            {
                id    : 'colwidth-slider',
                xtype : 'slider',
                width : 100,

                value     : 160,
                increment : 10,
                minValue  : 30,
                maxValue  : 200,

                listeners : {
                    scope  : this,
                    change : function (slider, value) {
                        this.getSchedulingView().setColumnWidth(value);
                    }
                }
            },
            ' ',
            'Row Height:',
            {
                xtype : 'slider',
                width : 100,

                value     : 60,
                increment : 10,
                minValue  : 30,
                maxValue  : 150,

                listeners : {
                    scope  : this,
                    change : function (sli, v) {
                        var schedulingView = this.getSchedulingView();
                        schedulingView.setRowHeight(v);
                    }
                }
            }
        ];

        this.callParent(arguments);
    },

    listeners : {
        columnwidthchange : function (timeAxisViewModel, width) {
            Ext.getCmp('colwidth-slider').setValue(width);
        }
    }
})

Ext.application({
    name : 'SchedulerDemo',

    launch : function () {

        var vp = new Ext.Viewport({
            layout : 'fit',
            items  : {
                xtype     : 'myscheduler',
                startDate : new Date(2011, 11, 9, 7),
                endDate   : new Date(2011, 11, 9, 17)
            }
        })
    }
})
