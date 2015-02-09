Ext.ns('App');
//Ext.Loader.setConfig({ enabled : true, disableCaching : true });
//Ext.Loader.setPath('Sch', '../../js/Sch');

//Ext.require([
//    'Sch.panel.SchedulerGrid',
//    'Sch.plugin.CurrentTimeLine'
//]);


Ext.onReady(function () {
    App.SchedulerDemo.init();
});

App.SchedulerDemo = {

    // Initialize application
    init : function () {

        var resourceStore = new Sch.data.ResourceStore({
            data : [
                {Id : 'MadMike', Name : 'Mike'},
                {Id : 'LindaAnderson', Name : 'Linda'},
                {Id : 'DonJohnson', Name : 'Don'},
                {Id : 'KarenJohnson', Name : 'Karen'},
                {Id : 'DougHendricks', Name : 'Doug'},
                {Id : 'PeterPan', Name : 'Peter'}
            ]
        });

        var eventStore = new Sch.data.EventStore({
            data  : [
                {Id : 1, ResourceId : 'MadMike', Name : 'Fix bug', State : 0, StartDate : "2010-12-09 10:00", EndDate : "2010-12-09 11:00"},
                {Id : 2, ResourceId : 'LindaAnderson', Name : 'Update docs', State : 1, StartDate : "2010-12-09 10:00", EndDate : "2010-12-09 12:00"},
                {Id : 3, ResourceId : 'DonJohnson', Name : 'Fork project', State : 1, StartDate : "2010-12-09 13:00", EndDate : "2010-12-09 15:00"},
                {Id : 4, ResourceId : 'KarenJohnson', Name : 'Release to prod server', State : 2, StartDate : "2010-12-09 16:00", EndDate : "2010-12-09 18:00"},
                {Id : 5, ResourceId : 'DougHendricks', Name : 'Extend test suite', State : 2, StartDate : "2010-12-09 12:00", EndDate : "2010-12-09 13:00"},
                {Id : 6, ResourceId : 'PeterPan', Name : 'Fix IE issues', State : 3, StartDate : "2010-12-09 14:00", EndDate : "2010-12-09 16:00"}
            ]
        });

        var barMarginSlider = new Ext.slider.SingleSlider({
            id        : 'marginSlider',
            width     : 100,
            value     : 10,
            increment : 1,
            minValue  : 1,
            maxValue  : 10,
            listeners : {
                change : function (sli, v) {
                    var schedulingView = sched.getSchedulingView(),
                        marginMax = schedulingView.getRowHeight() / 2 - 1;

                    schedulingView.setBarMargin(Math.floor(Math.min(marginMax, (10 - v) * marginMax / 10)));
                }
            }
        });

        var sched = Ext.create("Sch.panel.SchedulerGrid", {
            id            : 'scheduler',
            viewPreset    : 'hourAndDay',
            startDate     : new Date(2010, 11, 9, 8),
            endDate       : new Date(2010, 11, 9, 19),
            rowHeight     : 40,
            dragConfig    : { showTooltip : false },
            region        : 'center',
            viewConfig    : { stripeRows : false },
            eventRenderer : function (ev, resource, meta) {
                meta.cls = 'state-' + ev.get('State');
                return ev.getName();
            },
            tbar          : {
                height : 35,

                items : [
                    {
                        xtype : 'label',
                        text  : 'Drag to change row height'
                    },
                    ' ',
                    new Ext.slider.SingleSlider({
                        id        : 'rowHeightSlider',
                        width     : 100,
                        value     : 40,
                        increment : 5,
                        minValue  : 5,
                        maxValue  : 100,
                        listeners : {
                            change : function (sli, v) {
                                var schedulingView = sched.getSchedulingView(),
                                    marginMax = v / 2 - 1;

                                if (schedulingView.barMargin > marginMax) {
                                    schedulingView.setBarMargin(Math.floor(marginMax))
                                    barMarginSlider.setValue(10)
                                }

                                schedulingView.setRowHeight(v);
                            }
                        }
                    }),
                    '->',
                    {
                        xtype : 'label',
                        text  : 'Drag to change bar height'
                    },
                    ' ',
                    barMarginSlider
                ]
            },

            // Setup static columns
            columns       : [
                {header : 'Name', sortable : true, tdCls : 'name', width : 200, dataIndex : 'Name'}
            ],

            // Store holding all the resources
            resourceStore : resourceStore,

            // Store holding all the events
            eventStore    : eventStore,

            onEventCreated : function (newEventRecord) {
                // Overridden to provide some defaults before adding it to the store
                newEventRecord.setName('New task...');
            }
        });

        new Ext.Viewport({
            padding : 20,
            layout  : 'fit',
            items   : sched
        })
    }
};
