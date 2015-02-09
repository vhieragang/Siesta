Ext.Loader.setConfig({ enabled : true, disableCaching : true });
Ext.Loader.setPath('Sch', '../../js/Sch');

Ext.require([
    'Sch.panel.SchedulerGrid'
]);

Ext.onReady(function () {
    Ext.define('Car', {
        extend : 'Sch.model.Resource',
        fields : [
            { name : 'Seats' },
            { name : 'NextScheduledService', type : 'date' }
        ]
    });

    var carTpl = Ext.create('Ext.XTemplate',
        '<img class="carimg" src="{Id}.jpeg" />',
        '<dl class="cardescr">',
        '<dt>{Name}</dt>',
        '<dd>{Seats} seats</dd>',
        '</dl>'
    );

    var resourceStore = Ext.create('Sch.data.ResourceStore', {
            sorters : {
                property  : 'Name',
                direction : "ASC"
            },
            model   : 'Car',
            data    : [
                { Id : 'c1', Name : 'BMW #1', Seats : 4, NextScheduledService : new Date(2011, 2, 3) },
                { Id : 'c2', Name : 'BMW #2', Seats : 4, NextScheduledService : new Date(2012, 2, 3) },
                { Id : 'c3', Name : 'BMW #3', Seats : 2, NextScheduledService : new Date(2013, 4, 3) },
                { Id : 'c4', Name : 'BMW #4', Seats : 2, NextScheduledService : new Date(2012, 11, 7) },
                { Id : 'c5', Name : 'BMW #5', Seats : 2, NextScheduledService : new Date(2011, 10, 3) },
                { Id : 'c6', Name : 'BMW #6', Seats : 4, NextScheduledService : new Date(2012, 5, 6) }
            ]
        }),

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

    var scheduler,
        chartStore = new Ext.data.JsonStore({
            fields : ['name', 'usage']
        });

    eventStore.on({
        'update' : refreshChart,
        'add'    : refreshChart
    });

    var container = Ext.create("Ext.Container", {
        layout : { type : 'hbox', align : 'stretch' },

        renderTo : "example-container",    // An HTML element in the page
        height   : ExampleDefaults.height,
        width    : ExampleDefaults.width,
        border   : false,
        items    : [
            scheduler = Ext.create("Sch.panel.SchedulerGrid", {
                flex              : 1,
                forceFit          : true,
                title             : 'Charting Demo',
                viewPreset        : 'hourAndDay',
                startDate         : new Date(2010, 11, 9, 8),
                endDate           : new Date(2010, 11, 9, 17),
                eventBarTextField : 'Name',
                multiSelect       : true,

                onEventCreated : function (ev) {
                    ev.set('Name', 'New booking');
                },

                // Setup static columns
                columns        : [
                    { text        : 'Car',
                        width     : 170,
                        align     : 'center',
                        dataIndex : 'Name',
                        sortable  : true,
                        xtype     : 'templatecolumn',
                        tpl       : carTpl
                    },
                    { text        : 'Next Service Date',
                        width     : 100,
                        dataIndex : 'NextScheduledService',
                        position  : 'right',
                        xtype     : 'datecolumn',
                        format    : 'M Y'
                    }
                ],

                // Store holding all the resources
                resourceStore  : resourceStore,

                // Store holding all the events
                eventStore     : eventStore,

                rowHeight       : 50,
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
                        text    : 'Horizontal view',
                        pressed : true,

                        enableToggle : true,
                        toggleGroup  : 'orientation',

                        iconCls : 'icon-horizontal',

                        scope   : this,
                        handler : function () {
                            scheduler.setOrientation('horizontal');
                        }
                    },
                    {
                        text : 'Vertical view',

                        enableToggle : true,
                        toggleGroup  : 'orientation',

                        iconCls : 'icon-vertical',

                        scope   : this,
                        handler : function () {
                            scheduler.setOrientation('vertical');
                        }
                    }
                ]
            }),
            Ext.create('widget.panel', {
                region  : 'east',
                width   : 250,
                layout  : 'fit',
                border  : false,
                padding : 10,
                items   : {
                    xtype   : 'chart',
                    animate : true,
                    store   : chartStore,
                    shadow  : true,

                    insetPadding : 5,
                    theme        : 'Base:gradients',
                    series       : [
                        {
                            type  : 'pie',
                            field : 'usage',
                            donut : true,
                            label : {
                                field    : 'name',
                                display  : 'rotate',
                                contrast : true,
                                font     : '18px Arial'
                            }
                        }
                    ]
                }
            })
        ]
    });

    scheduler.on('viewchange', refreshChart);

    refreshChart();

    function refreshChart() {
        var data = [],
            ta = scheduler.getTimeAxis(),
            start = ta.getStart(),
            end = ta.getEnd();

        var totalAllocatedTime = 0;

        eventStore.queryBy(function (eRec) {
            totalAllocatedTime += eRec.getEndDate() - eRec.getStartDate();
        });

        resourceStore.each(function (r) {
            var carAllocatedTime = 0;

            eventStore.queryBy(function (eRec) {
                if (eRec.getResourceId() === r.get('Id') && Sch.util.Date.intersectSpans(start, end, eRec.getStartDate(), eRec.getEndDate())) {
                    carAllocatedTime += eRec.getEndDate() - eRec.getStartDate();
                }
            });

            data.push({
                name  : r.get('Name'),
                usage : Math.round(100 * carAllocatedTime / totalAllocatedTime)
            });
        });
        chartStore.loadData(data);
    }
});