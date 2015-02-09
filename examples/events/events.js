/* globals App: true, ExampleDefaults: true, MyTimeAxis: true */
Ext.ns('App');

Ext.Loader.setConfig({ enabled : true, disableCaching : true });
Ext.Loader.setPath('Sch', '../../js/Sch');

Ext.require([
    'Sch.panel.SchedulerGrid'
]);

Ext.onReady(function() {
    Ext.QuickTips.init();

    App.Scheduler.init();
});


App.Scheduler = {

    // Bootstrap function
    init : function() {

        this.scheduler = this.createScheduler();

        var container = new Ext.Panel({
            layout : 'border',
            height : ExampleDefaults.height,
            width : ExampleDefaults.width,
            renderTo : 'example-container',
            items : [
                this.scheduler,
                Ext.create("EventLogPanel", {
                    region : 'south',
                    height: 250,
                    scheduler : this.scheduler
                })
            ]
        });

        this.scheduler.resourceStore.load();
    },

    renderer : function (item, resourceRec, row, col, ds) {
        var bookingStart = item.getStartDate();

        return {
            headerText : Ext.Date.format(bookingStart, "G:i"),
            footerText : item.getName()
        };
    },

    createScheduler : function() {
        Ext.define('MyEvent', {
            extend : 'Sch.model.Event',
            fields : ['Location']
        });

        // Store holding all the resources
        var resourceStore = new Sch.data.ResourceStore({
            proxy : {
                type : 'ajax',
                url : 'data.js',
                reader : {
                    type : 'json',
                    rootProperty : 'staff'
                }
            },
            model : 'Sch.model.Resource'
        });

        // Store holding all the events
        var eventStore = new Sch.data.EventStore({
            model : 'MyEvent'
        });

        resourceStore.on('load', function() {
            eventStore.loadData(resourceStore.proxy.reader.rawData.tasks);
        });

        var s = Ext.create("Sch.SchedulerPanel", {
            region      : 'center',
            loadMask    : true,
            rowHeight   : 30,
            timeAxis : new MyTimeAxis(),
            columns     : [
                {
                    xtype           : 'actioncolumn',
                    align           : 'center',
                    width           : 30,
                    menuDisabled    : true,

                    items           : [
                        {
                            icon    : 'images/delete.png',
                            tooltip : 'Delete row',
                            handler : function(grid, rowIndex, colIndex) {
                                resourceStore.removeAt(rowIndex);
                            }
                        }
                    ]
                },
                { header : 'Staff', sortable:true, width:130, dataIndex : 'Name' }
            ],

             // Setup view configuration
            startDate : new Date(2010, 4, 22, 8),
            endDate : new Date(2010, 4, 24, 18),
            viewPreset: 'hourAndDay',
            eventRenderer : this.renderer,

            // Simple template with header and footer
            eventBodyTemplate : new Ext.Template(
                '<span class="sch-event-header">{headerText}</span>' +
                '<div class="sch-event-footer">{footerText}</div>'
            ),

            resourceStore : resourceStore,
            eventStore : eventStore,
            border : true,
            tbar : [
                {
                    iconCls : 'icon-previous',
                    scale : 'medium',
                    handler : function() {
                        s.shiftPrevious();
                    }
                },
                {
                    iconCls : 'icon-next',
                    scale : 'medium',
                    handler : function() {
                        s.shiftNext();
                    }
                },
                '->',
                {
                    iconCls : 'unlocked',
                    scale : 'medium',
                    text : 'Unlocked',
                    enableToggle : true,
                    handler : function() {
                        s.setReadOnly(this.pressed);
                        this.setIconCls(this.pressed ? 'locked' : 'unlocked');
                        this.setText(this.pressed ? 'Locked' : 'Unlocked');
                    }
                }
            ],

            tooltipTpl : new Ext.XTemplate(
                '<dl class="eventTip">',
                    '<dt class="icon-clock">Time</dt><dd>{[Ext.Date.format(values.StartDate, "Y-m-d G:i")]}</dd>',
                    '<dt class="icon-task">Task</dt><dd>{Name}</dd>',
                    '<dt class="icon-earth">Location</dt><dd>{Location}&nbsp;</dd>',
                '</dl>'
            ).compile()
        });

        return s;
    }
};

Ext.define("EventLogPanel", {
    extend : "Ext.TabPanel",
    activeTab : 0,
    deferredRender : false,
    defaults : {
        padding : 5,
        iconCls : 'event',
        autoScroll : true,
        tpl : new Ext.Template(
            '<div class="evt-row">',
                '<span class="evt-time">{time}</span>',
                '<span class="evt-source">{source}</span>',
                '<span>fired</span>',
                '<span class="evt-name">{name} </span>',
                '<span>with arguments: </span>',
                '<span class="evt-args">{args}</span>',
            '</div>'
        )
    },

    constructor : function(config) {

        Ext.apply(config, {
            items : [
                this.schedulerEvents = new Ext.Panel({
                    title : 'Scheduler'
                }),

                this.resourceStoreEvents = new Ext.Panel({
                    title : 'Resource store'
                }),

                this.eventStoreEvents = new Ext.Panel({
                    title : 'Event store'
                })
            ]
        });
        var scheduler = config.scheduler;

        Ext.mixin.Observable.capture(scheduler, function() {
            this.doLog.apply(this.schedulerEvents, arguments);
        }, this);
        Ext.mixin.Observable.capture(scheduler.resourceStore, function() {
            this.doLog.apply(this.resourceStoreEvents, arguments);
        }, this);
        Ext.mixin.Observable.capture(scheduler.eventStore, function() {
            this.doLog.apply(this.eventStoreEvents, arguments);
        }, this);

        this.callParent(arguments);
    },

    doLog : function(eventName, args) {
        if (!this.rendered) {
            return;
        }

        this.tpl.append(this.body, {
            time : Ext.Date.format(new Date(), 'm:s:u'),
            source : this.title,
            name : arguments[0],
            // in IE8 slicing the object throws exception, in other browsers empty array is returned
            args : Array.prototype.slice.call(Ext.isArray(arguments[1]) ? arguments[1] : [], 1)
        });

        this.body.dom.scrollTop = this.body.dom.scrollHeight;
    }
});


Ext.define('MyTimeAxis', {
    extend : "Sch.data.TimeAxis",
    continuous : false,

    generateTicks : function(start, end, unit, increment) {
        // Use our own custom time intervals
        if (unit === Sch.util.Date.HOUR) {
            var ticks = [];

            while (start < end) {
                if (start.getHours() >= 8 && start.getHours() <= 18) {
                    ticks.push({
                        start : start,
                        end : Sch.util.Date.add(start, Sch.util.Date.HOUR, 1)
                    });
                }
                start = Sch.util.Date.add(start, Sch.util.Date.HOUR, 1);
            }
            return ticks;
        } else {
            return MyTimeAxis.superclass.generateTicks.apply(this, arguments);
        }
    }
});
