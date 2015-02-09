Ext.ns('App');

Ext.Loader.setConfig({ enabled : true, disableCaching : true });
Ext.Loader.setPath('Sch', '../../js/Sch');

Ext.require([
    'Sch.panel.SchedulerGrid'
]);

Ext.onReady(function () {
    App.Scheduler.init();
});

Ext.define('MyEventModel', {
    extend : 'Sch.model.Event',
    fields : ['PercentDone']
})

App.Scheduler = {

    // Initialize application
    init : function () {

        Sch.preset.Manager.registerPreset("dayNightShift", {
            timeColumnWidth   : 35,
            rowHeight         : 32,
            displayDateFormat : 'G:i',
            shiftIncrement    : 1,
            shiftUnit         : "DAY",
            timeResolution    : {
                unit      : "MINUTE",
                increment : 15
            },
            defaultSpan       : 24,
            headerConfig      : {
                bottom : {
                    unit       : "HOUR",
                    increment  : 1,
                    dateFormat : 'G'
                },
                middle : {
                    unit      : "HOUR",
                    increment : 12,
                    renderer  : function (startDate, endDate, headerConfig, cellIdx) {
                        // Setting align on the header config object
                        headerConfig.align = 'center';

                        if (startDate.getHours() === 0) {
                            // Setting a custom CSS on the header cell element
                            headerConfig.headerCls = 'nightShift';
                            return Ext.Date.format(startDate, 'M d') + ' Night Shift';
                        }
                        else {
                            // Setting a custom CSS on the header cell element
                            headerConfig.headerCls = 'dayShift';
                            return Ext.Date.format(startDate, 'M d') + ' Day Shift';
                        }
                    }
                },
                top    : {
                    unit       : "DAY",
                    increment  : 1,
                    dateFormat : 'd M Y'
                }
            }
        });

        this.scheduler = this.createScheduler();

        this.scheduler.getResourceStore().loadData([
            {Id : 'r1', Name : 'Mike'},
            {Id : 'r2', Name : 'Linda'},
            {Id : 'r3', Name : 'Don'},
            {Id : 'r4', Name : 'Karen'},
            {Id : 'r5', Name : 'Doug'},
            {Id : 'r6', Name : 'Peter'}
        ]);
    },

    createScheduler : function () {
        var resourceStore = Ext.create('Sch.data.ResourceStore', {
                sorters : {
                    property  : 'Name',
                    direction : "ASC"
                },
                model   : 'Sch.model.Resource'
            }),

        // Store holding all the events
            eventStore = Ext.create('Sch.data.EventStore', {
                model : 'MyEventModel', // See definition above
                data  : [
                    {ResourceId : 'r1', PercentDone : 60, StartDate : new Date(2011, 0, 1, 10), EndDate : new Date(2011, 0, 1, 12)},
                    {ResourceId : 'r2', PercentDone : 20, StartDate : new Date(2011, 0, 1, 12), EndDate : new Date(2011, 0, 1, 13)},
                    {ResourceId : 'r3', PercentDone : 80, StartDate : new Date(2011, 0, 1, 14), EndDate : new Date(2011, 0, 1, 16)},
                    {ResourceId : 'r6', PercentDone : 100, StartDate : new Date(2011, 0, 1, 16), EndDate : new Date(2011, 0, 1, 18)}
                ]
            });

        var sched = Ext.create("Sch.panel.SchedulerGrid", {
            height            : ExampleDefaults.height,
            width             : ExampleDefaults.width,
            barMargin         : 2,
            rowHeight         : 35,
            border            : true,
            renderTo          : 'example-container',
            viewPreset        : 'hourAndDay',
            eventBodyTemplate : '<div class="value">{PercentDone}</div>',
            startDate         : new Date(2011, 0, 1, 6),
            endDate           : new Date(2011, 0, 1, 20),

            // Setup static columns
            columns           : [
                { header : 'Name', sortable : true, width : 100, dataIndex : 'Name' }
            ],

            resourceStore : resourceStore,
            eventStore    : eventStore,


            tbar : [
                {
                    text         : 'Seconds',
                    toggleGroup  : 'presets',
                    enableToggle : true,
                    iconCls      : 'icon-calendar',
                    handler      : function () {
                        sched.switchViewPreset('secondAndMinute', new Date(2011, 0, 1, 8), new Date(2011, 0, 1, 9));
                    }
                },
                {
                    text         : 'Minutes',
                    toggleGroup  : 'presets',
                    enableToggle : true,
                    iconCls      : 'icon-calendar',
                    handler      : function () {
                        sched.switchViewPreset('minuteAndHour', new Date(2011, 0, 1, 8), new Date(2011, 0, 1, 10));
                    }
                },
                {
                    text         : 'Hours',
                    toggleGroup  : 'presets',
                    enableToggle : true,
                    pressed      : true,
                    iconCls      : 'icon-calendar',
                    handler      : function () {
                        sched.switchViewPreset('hourAndDay', new Date(2011, 0, 1, 8), new Date(2011, 0, 1, 18));
                    }
                },
                {
                    text         : 'Days',
                    toggleGroup  : 'presets',
                    enableToggle : true,
                    iconCls      : 'icon-calendar',
                    handler      : function () {
                        sched.switchViewPreset('weekAndDay', new Date(2011, 0, 1), new Date(2011, 0, 21));
                    }
                },
                {
                    text         : 'Weeks',
                    toggleGroup  : 'presets',
                    enableToggle : true,
                    iconCls      : 'icon-calendar',
                    handler      : function () {
                        sched.switchViewPreset('weekAndMonth');
                    }
                },
                {
                    text         : 'Weeks 2',
                    toggleGroup  : 'presets',
                    enableToggle : true,
                    iconCls      : 'icon-calendar',
                    handler      : function () {
                        sched.switchViewPreset('weekAndDayLetter');
                    }
                },
                {
                    text         : 'Weeks 3',
                    toggleGroup  : 'presets',
                    enableToggle : true,
                    iconCls      : 'icon-calendar',
                    handler      : function () {
                        sched.switchViewPreset('weekDateAndMonth');
                    }
                },
                {
                    text        : 'Months',
                    toggleGroup : 'presets',
                    iconCls     : 'icon-calendar',
                    handler     : function () {
                        sched.switchViewPreset('monthAndYear');
                    }
                },
                {
                    text         : 'Years',
                    enableToggle : true,
                    toggleGroup  : 'presets',
                    iconCls      : 'icon-calendar',
                    handler      : function () {
                        sched.switchViewPreset('year', new Date(2011, 0, 1), new Date(2015, 0, 1));
                    }
                },
                {
                    text         : 'Years 2',
                    enableToggle : true,
                    toggleGroup  : 'presets',
                    iconCls      : 'icon-calendar',
                    handler      : function () {
                        sched.switchViewPreset('manyYears', new Date(2001, 0, 1), new Date(2015, 0, 1));
                    }
                },
                '->',
                {
                    text         : 'Day and night shift (custom)',
                    enableToggle : true,
                    toggleGroup  : 'presets',
                    iconCls      : 'icon-calendar',
                    handler      : function () {
                        sched.switchViewPreset('dayNightShift', new Date(2011, 0, 1), new Date(2011, 0, 2));
                    }
                },
                {
                    text    : '+',
                    scale   : 'medium',
                    iconCls : 'zoomIn',
                    handler : function () {
                        sched.zoomIn();
                    }
                },
                {
                    text    : '-',
                    scale   : 'medium',
                    iconCls : 'zoomOut',
                    handler : function () {
                        sched.zoomOut();
                    }
                }
            ]
        });

        return sched;
    }
};
