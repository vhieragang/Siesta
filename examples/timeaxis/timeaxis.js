Ext.ns('App');
//Ext.Loader.setConfig({ enabled : true, disableCaching : true });
//Ext.Loader.setPath('Sch', '../../js/Sch');

//Ext.require([
//    'Sch.panel.SchedulerGrid'
//]);

Sch.preset.Manager.registerPreset('workweek', {
    displayDateFormat : 'G:i',
    shiftIncrement    : 1,
    shiftUnit         : "WEEK",
    timeResolution    : {
        unit      : "MINUTE",
        increment : 10
    },
    headerConfig      : {
        middle : {
            unit     : "DAY",
            renderer : function (start, end, cfg) {
                cfg.headerCls = 'sch-hdr-startend';
                return Ext.String.format('<span class="sch-hdr-start">{0}</span><span class="sch-hdr-end">{1}</span>', Ext.Date.format(start, 'G'), Ext.Date.format(end, 'G'));
            }
        },
        top    : {
            unit       : "DAY",
            dateFormat : 'D d M'
        }
    }
});

Sch.preset.Manager.registerPreset('weekWithSummary', {
    timeColumnWidth     : 20,
    rowHeight           : 24,
    resourceColumnWidth : 100,
    displayDateFormat   : 'Y-m-d',
    shiftUnit           : "WEEK",
    shiftIncrement      : 1,
    defaultSpan         : 10,
    timeResolution      : {
        unit      : "HOUR",
        increment : 6
    },
    headerConfig        : {
        bottom : {
            unit     : 'DAY',
            align    : 'center',
            renderer : function (start, end, config, index, eventStore) {
                return eventStore.getEventsInTimeSpan(start, end).length;
            }
        },
        middle : {
            unit     : 'DAY',
            align    : 'center',
            renderer : function (start) {
                return Ext.Date.dayNames[start.getDay()].substring(0, 1);
            }
        },
        top    : {
            unit       : 'WEEK',
            dateFormat : 'D d M Y'
        }
    }
});


Ext.onReady(function () {

    // Store holding all the resources
    var resourceStore = new Sch.data.ResourceStore({
        sorters : 'Name',

        data : [
            {Id : 'r1', Name : 'Mike'},
            {Id : 'r2', Name : 'Linda'},
            {Id : 'r3', Name : 'Don'},
            {Id : 'r4', Name : 'Karen'},
            {Id : 'r5', Name : 'Doug'},
            {Id : 'r6', Name : 'Peter'},
            {Id : 'r7', Name : 'Fred'},
            {Id : 'r8', Name : 'Lisa'},
            {Id : 'r9', Name : 'Annie'},
            {Id : 'r10', Name : 'Dan'}
        ]
    });

    // Store holding all the events
    var eventStore = new Sch.data.EventStore({
        data : [
            {
                ResourceId : 'r9',
                StartDate  : "2011-02-16 12:00",
                EndDate    : "2011-02-16 16:00"
            },
            {
                ResourceId : 'r2',
                StartDate  : "2011-02-17 08:00",
                EndDate    : "2011-02-17 14:00"
            },
            {
                ResourceId : 'r10',
                StartDate  : "2011-02-15 08:00",
                EndDate    : "2011-02-15 14:00"
            }
        ]
    });


    var scheduler = Ext.create("SchedulerWithCustomTimeaxis", {
        renderTo      : 'example-container',
        startDate     : new Date(2011, 1, 14),
        endDate       : new Date(2011, 1, 19),
        resourceStore : resourceStore,
        eventStore    : eventStore
    });

    var scheduler2 = Ext.create("FilterableTimeaxisScheduler", {
        renderTo      : 'example-container',
        startDate     : new Date(2011, 1, 14),
        endDate       : new Date(2011, 1, 29),
        resourceStore : resourceStore,
        eventStore    : eventStore
    });
});

Ext.define("SchedulerWithCustomTimeaxis", {
    extend : 'Sch.panel.SchedulerGrid',

    title      : 'Scheduler with custom time axis class',
    border     : true,
    viewPreset : 'workweek',
    rowHeight  : 30,
    height     : 300,

    initComponent : function () {
        var me = this;

        Ext.apply(this, {
            // Custom time axis
            timeAxis : new MyTimeAxis(),

            eventRenderer      : function (ev) {
                return Ext.Date.format(ev.getStartDate(), 'G:i') + ' - ' + Ext.Date.format(ev.getEndDate(), 'G:i');
            },

            // Constrain events within their current day
            getDateConstraints : function (resourceRecord, eventRecord) {
                if (eventRecord) {
                    var date = eventRecord instanceof Date ? eventRecord : eventRecord.getStartDate(),
                        tick = this.timeAxis.getAt(Math.floor(this.timeAxis.getTickFromDate(date)));

                    return {
                        start : tick.data.start,
                        end   : tick.data.end
                    };
                }
            },

            // Setup static columns
            columns            : [
                {header : 'Name', sortable : true, width : 100, dataIndex : 'Name'}
            ]
        });

        this.callParent(arguments);
    }
});

Ext.define("FilterableTimeaxisScheduler", {
    extend : 'Sch.panel.SchedulerGrid',

    height     : 300,
    width      : ExampleDefaults.width,
    title      : 'The time axis can also be filtered, try it out!',
    border     : true,
    viewPreset : 'weekWithSummary',
    margin     : '10 0 0 0',
    forceFit   : true,

    eventRenderer : function (ev) {
        return Ext.Date.format(ev.getStartDate(), 'Y-m-d');
    },

    initComponent : function () {
        var me = this;

        Ext.apply(this, {
            // Setup static columns
            columns : [
                {header : 'Name', sortable : true, width : 100, dataIndex : 'Name'}
            ],

            tbar : [
                {
                    toggleGroup : 'filter',
                    pressed     : true,
                    text        : 'Clear filter',
                    handler     : function () {
                        me.getTimeAxis().clearFilter();
                    }
                },
                {
                    toggleGroup : 'filter',
                    text        : 'Only weekdays',
                    handler     : function () {
                        me.getTimeAxis().filterBy(function (tick) {
                            return tick.start.getDay() !== 6 && tick.start.getDay() !== 0;
                        });
                    }
                },
                {
                    toggleGroup : 'filter',
                    text        : 'Only weekends',
                    handler     : function () {
                        me.getTimeAxis().filterBy(function (tick) {
                            return tick.start.getDay() === 6 || tick.start.getDay() === 0;
                        });
                    }
                },
                {
                    toggleGroup : 'filter',
                    text        : 'Only days with booked events',
                    handler     : function () {
                        me.getTimeAxis().filterBy(function (tick) {

                            return me.eventStore.queryBy(function (ev) {
                                return Sch.util.Date.intersectSpans(ev.getStartDate(), ev.getEndDate(), tick.start, tick.end);
                            }).length > 0;

                        });
                    }
                }
            ]
        });

        // Refresh headers on changes to the eventStore, to show the amount of tasks
        // per day

        this.callParent(arguments);

        var timeAxisColumn = this.down('timeaxiscolumn');

        this.eventStore.on({
            add     : timeAxisColumn.refresh,
            remove  : timeAxisColumn.refresh,
            update  : timeAxisColumn.refresh,
            scope   : timeAxisColumn
        });
    }
});

Ext.define('MyTimeAxis', {
    extend     : "Sch.data.TimeAxis",
    continuous : false,

    generateTicks : function (start, end, unit, increment) {
        // Use our own custom time intervals for day time-axis
        if (unit === Sch.util.Date.DAY) {
            var ticks = [],
                intervalEnd;

            while (start < end) {
                if (start.getDay() === 5) {
                    // Fridays are lazy days, working 10am - 4pm
                    start.setHours(10);
                    intervalEnd = Sch.util.Date.add(start, Sch.util.Date.HOUR, 6);
                } else {
                    start.setHours(8);
                    intervalEnd = Sch.util.Date.add(start, Sch.util.Date.HOUR, 8);
                }

                ticks.push({
                    start : start,
                    end   : intervalEnd
                });
                start = Sch.util.Date.add(start, Sch.util.Date.DAY, 1);
            }
            return ticks;
        } else {
            return this.callParent(arguments);
        }
    }
});