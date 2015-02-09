Ext.ns('App');

//Ext.Loader.setConfig({ enabled : true, disableCaching : true });
//Ext.Loader.setPath('Sch', '../../js/Sch');

//Ext.require([
//    'Sch.panel.SchedulerGrid',
//    'Sch.plugin.SummaryColumn'
//]);

Ext.define('My.Resource', {
    extend : 'Sch.model.Resource',

    fields : [
        'Title'
    ]
})

Sch.preset.Manager.registerPreset("dayWeek", {
    timeColumnWidth     : 100,
    rowHeight           : 24,
    resourceColumnWidth : 100,
    displayDateFormat   : 'Y-m-d G:i',
    shiftUnit           : "DAY",
    shiftIncrement      : 1,
    defaultSpan         : 5,
    timeResolution      : {
        unit      : "HOUR",
        increment : 1
    },
    headerConfig        : {
//        bottom : {
//            unit     : "DAY",
//            renderer : null // set in scheduler initialization
//        },
        middle : {
            unit       : "DAY",
            align      : 'center',
            renderer   : function(start, end, meta) {
                meta.headerCls = 'header-' + Ext.Date.format(start, 'Y-m-d');

                return Ext.Date.format(start, 'j')
            }
        },
        top    : {
            unit     : "WEEK",
            align    : 'center',
            renderer : function (start, end, cfg) {
                return Sch.util.Date.getShortNameOfUnit("WEEK") + '.' + Ext.Date.format(start, 'W M Y');
            }
        }
    }
});


Ext.onReady(function () {


    scheduler = App.SchedulerDemo.init();
});


Ext.define('MyScheduler', {
    extend             : 'Sch.panel.SchedulerGrid',
    xtype              : 'myscheduler',
    eventBarTextField  : 'Name',
    viewPreset         : 'dayWeek',
    startDate          : new Date(2010, 11, 1),
    endDate            : new Date(2010, 11, 14),
    rowHeight          : 50,
    barMargin          : 3,
    title              : 'Tab 2 - Scheduler',
    //snapToIncrement : true,
    eventResizeHandles : 'both',

    normalGridConfig   : { split : true },
    lockedGridConfig   : { width : 350 },

    // Setup static columns
    columns            : [
        {
            xtype     : 'templatecolumn',
            header    : 'Staff',
            sortable  : true,
            flex      : 1,
            width     : 250,
            dataIndex : 'Name',
            cls       : 'staffheader',
            tpl       : '<img src="resources/images/{Name}.jpg" /><dl><dt>{Name}</dt><dd>{Title}</dd></dl>'
        },
//        {header : 'Some link', sortable : true, width : 80, locked : true, renderer : function (v) {
//            return '<a class="mylink" href="#">Click me!</a>';
//        }},
        {
            xtype       : 'summarycolumn',
            header      : 'Time allocated',
            width       : 100,
            align       : 'center',
            showPercent : false
        }/*,
         {
         xtype       : 'summarycolumn',
         header      : '% allocated',
         showPercent : true,
         align       : 'center',
         width       : 60
         }*/
    ],

    onEventCreated : function (newEventRecord) {
        newEventRecord.setName('New task...');
    },

    initComponent        : function () {
//        this.headerTpl = new Ext.XTemplate('<tpl for="."><div class="summary-event" style="left:{left}px;width:{width}px">{text}</div></tpl>');
//
//        Sch.preset.Manager.get('dayWeek').headerConfig.bottom.renderer = Ext.Function.bind(this.frozenHeaderRenderer, this);

        this.callParent(arguments);
    },

    // Render some special 'frozen' header events which are always shown
    frozenHeaderRenderer : function (start, end, cfg, i, eventStore) {
        var me = this;

        if (i === 0) {
            var eventsInSpan = eventStore.queryBy(function (task) {
                return task.getResourceId() === 'frozen' && me.timeAxis.timeSpanInAxis(task.getStartDate(), task.getEndDate());
            });

            var tplData = Ext.Array.map(eventsInSpan.items, function (task) {
                var startX = me.getSchedulingView().getXFromDate(task.getStartDate());
                var endX = me.getSchedulingView().getXFromDate(task.getEndDate());

                return {
                    left  : startX,
                    width : endX - startX,
                    text  : task.getName()
                }
            });

            return me.headerTpl.apply(tplData);
        }
    }
});


App.SchedulerDemo = {

    // Initialize application
    init : function () {

        var vp = new Ext.Viewport({
            layout : 'border',
            items  : [
                {
                    region      : 'north',
//                    title       : 'North Panel',
                    height      : 100,
                    border      : true,
                    bodyBorder  : true,
                    bodyPadding : 10,
                    html        : 'This example shows you the Sch.plugin.SummaryColumn plugin which can show either the amount of time or the percentage allocated within the visible view.' +
                        '<p>Note that the js for the example code is not minified so it is readable. See <a href="columnsummary.js">columnsummary.js</a>.</p>'
                },
                {
                    xtype      : 'tabpanel',
                    region     : 'center',
                    bodyBorder : true,
                    activeTab  : 1,
                    items      : [
                        {
                            title : 'Tab 1 - Some other component'
                        },
                        {
                            xtype         : 'myscheduler',
                            startDate     : new Date(2010, 11, 1),
                            endDate       : new Date(2010, 12, 14),

                            // Store holding all the resources
                            resourceStore : Ext.create("Sch.data.ResourceStore", {
                                model : 'My.Resource',
                                data  : [
                                    {Id : 'r1', Name : 'Arnold', Title : 'R&D'},
                                    {Id : 'r2', Name : 'Lisa', Title : 'CEO'},
                                    {Id : 'r3', Name : 'Dave', Title : 'Acceptance Test'},
                                    {Id : 'r4', Name : 'Lee', Title : 'Sales'}
                                ]
                            }),

                            // Store holding all the events
                            eventStore    : Ext.create("Sch.data.EventStore", {
                                data : [
                                    {Id : 'e10', ResourceId : 'r1', Name : 'Paris Trip', StartDate : "2010-12-02", EndDate : "2010-12-08"},
                                    {Id : 'e101', ResourceId : 'r1', Name : 'Board Meeting', StartDate : "2010-12-08", EndDate : "2010-12-12"},
                                    {Id : 'e11', ResourceId : 'r2', Name : 'Board Meeting', StartDate : "2010-12-04", EndDate : "2010-12-09"},
                                    {Id : 'e21', ResourceId : 'r3', Name : 'Test IE8', StartDate : "2010-12-01", EndDate : "2010-12-04"},
                                    {Id : 'e211', ResourceId : 'r3', Name : 'Test IE8 Some More', StartDate : "2010-12-04", EndDate : "2010-12-09"},
                                    {Id : 'e22', ResourceId : 'r4', Name : 'Conference X', StartDate : "2010-12-01", EndDate : "2010-12-05", Cls : 'Special'},
                                    {Id : 'e23', ResourceId : 'r4', Name : 'Meet Client', StartDate : "2010-12-05", EndDate : "2010-12-09", Cls : 'VerySpecial'},

                                    {Id : 'special1', ResourceId : 'frozen', Name : 'Summary task', StartDate : "2010-12-02", EndDate : "2010-12-03"},
                                    {Id : 'special2', ResourceId : 'frozen', Name : 'Important info', StartDate : "2010-12-04", EndDate : "2010-12-07"},
                                    {Id : 'special3', ResourceId : 'frozen', Name : 'Some text', StartDate : "2010-12-08", EndDate : "2010-12-09"}
                                ]
                            }),

                            plugins : {
                                ptype : 'scheduler_zones',
                                store : new Sch.data.EventStore({
                                    data : [
                                        { StartDate : new Date(2010, 11, 3), EndDate : new Date(2010, 11, 4), Cls : 'weekend' }
                                    ]
                                })
                            }
                        }
                    ]
                }
            ]
        });

        var sched = Ext.ComponentQuery.query('schedulergrid[lockable=true]')[0],
            lockedSection = sched.lockedGrid,
            view = lockedSection.getView();

        lockedSection.el.on('click', function (e, t) {
            var rowNode = view.findItemByChild(t);
            var resource = view.getRecord(rowNode);
            Ext.Msg.alert('Hey', 'You clicked ' + resource.get('Name'));
            e.stopEvent();
        }, null, { delegate : '.mylink' });

        return vp.down('schedulergrid');
    }
};
