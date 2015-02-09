Ext.ns('App');

//Ext.Loader.setConfig({ enabled : true, disableCaching : true });
//Ext.Loader.setPath('Sch', '../../js/Sch');

//Ext.require([
//    'Sch.panel.SchedulerGrid'
//]);


Ext.onReady(function () {
    var fiscalYear = {
        displayDateFormat : 'Y-m-d',
        shiftIncrement    : 1,
        shiftUnit         : "YEAR",
        timeColumnWidth   : 90,
        timeResolution    : {
            unit      : "MONTH",
            increment : 1
        },
        headerConfig      : {
            bottom : {
                unit       : "MONTH",
                dateFormat : 'M Y'
            },
            middle : {
                unit     : "QUARTER",
                renderer : function (start, end, cfg) {
                    var quarter = Math.floor(start.getMonth() / 3) + 1,
                        fiscalQuarter = quarter === 4 ? 1 : (quarter + 1);

                    return Ext.String.format('FQ{0} {1}', fiscalQuarter, start.getFullYear() + (fiscalQuarter === 1 ? 1 : 0));
                }
            },
            top    : {
                unit          : "YEAR",
                cellGenerator : function (viewStart, viewEnd) {
                    var cells = [];

                    // Simplified scenario, assuming view will always just show one US fiscal year
                    return [
                        {
                            start  : viewStart,
                            end    : viewEnd,
                            header : 'Fiscal Year ' + (viewStart.getFullYear() + 1)
                        }
                    ];
                }
            }
        }
    };

    Sch.preset.Manager.registerPreset("fiscalYear", fiscalYear);
    App.Scheduler.init();
});

App.Scheduler = {

    // Initialize application
    init : function () {
        Ext.define('MyModel', {
            extend : 'Sch.model.Event',
            fields : ['PercentAllocated']
        });

        Ext.define('MyResource', {
            extend : 'Sch.model.Resource',
            fields : ['LikesBacon', 'LikesChrome', 'LikesIE6']
        });

        var resourceStore = Ext.create('Sch.data.ResourceStore', {
                model : 'MyResource',
                data  : [
                    {Id : 'r1', Name : 'Mike', LikesChrome : true, LikesIE6 : false, LikesBacon : true},
                    {Id : 'r2', Name : 'Linda', LikesChrome : true, LikesIE6 : false, LikesBacon : true},
                    {Id : 'r3', Name : 'Don', LikesChrome : true, LikesIE6 : false, LikesBacon : true},
                    {Id : 'r4', Name : 'Karen', LikesChrome : true, LikesIE6 : false, LikesBacon : true},
                    {Id : 'r5', Name : 'Doug', LikesChrome : true, LikesIE6 : false, LikesBacon : true},
                    {Id : 'r6', Name : 'Crazy Pete', LikesChrome : false, LikesIE6 : true, LikesBacon : false}
                ]
            }),

        // Store holding all the events
            eventStore = Ext.create('Sch.data.EventStore', {
                model : MyModel,
                data  : [
                    {ResourceId : 'r1', PercentAllocated : 60, StartDate : new Date(2010, 9, 1), EndDate : new Date(2011, 0, 1)},
                    {ResourceId : 'r2', PercentAllocated : 20, StartDate : new Date(2011, 0, 1), EndDate : new Date(2011, 6, 1)},
                    {ResourceId : 'r3', PercentAllocated : 80, StartDate : new Date(2011, 3, 1), EndDate : new Date(2011, 9, 1)},
                    {ResourceId : 'r6', PercentAllocated : 100, StartDate : new Date(2011, 6, 1), EndDate : new Date(2011, 9, 1)}
                ]
            });


        var sched = Ext.create("Sch.panel.SchedulerGrid", {
            height            : ExampleDefaults.height,
            width             : ExampleDefaults.width,
            title             : 'US Fiscal Year',
            border            : true,
            renderTo          : 'example-container',
            viewPreset        : 'fiscalYear',
            startDate         : new Date(2010, 9, 1),
            endDate           : new Date(2011, 9, 1),
            rowHeight         : 35,
            eventBodyTemplate : new Ext.XTemplate(
                '<div class="sch-percent-allocated-bar" style="height:{PercentAllocated}%"></div><span class="sch-percent-allocated-text">{[values.PercentAllocated||0]}%</span>'
            ).compile(),

            // Define static columns
            columns           : [
                {header : 'Name', width : 100, dataIndex : 'Name'},
                {header : 'Likes Bacon', align : 'center', cls : 'vertical', xtype : 'booleancolumn', width : 40, dataIndex : 'LikesBacon', trueText : 'Yes', falseText : 'No' },
                {header : 'Likes IE6', align : 'center', cls : 'vertical', xtype : 'booleancolumn', width : 40, dataIndex : 'LikesIE6', trueText : 'Yes', falseText : 'No' },
                {header : 'Likes Chrome', align : 'center', cls : 'vertical', xtype : 'booleancolumn', width : 40, dataIndex : 'LikesChrome', trueText : 'Yes', falseText : 'No'}
            ],

            tbar : [
                {
                    iconCls : 'icon-previous',
                    handler : function () {
                        sched.shiftPrevious();
                    }
                },
                {
                    iconCls : 'icon-next',
                    handler : function () {
                        sched.shiftNext();
                    }
                }
            ],

            resourceStore : resourceStore,
            eventStore    : eventStore
        });
    }
};
