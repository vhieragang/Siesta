//Ext.Loader.setConfig({ enabled : true, disableCaching : true });
//Ext.Loader.setPath('Sch', '../../js/Sch');

//Ext.require([
//    'Sch.panel.SchedulerGrid',
//    'Sch.plugin.Printable'
//]);

Ext.onReady(function () {

    var resourceStore = Ext.create("Sch.data.ResourceStore", {
        sorters : 'Name'
    });

    var eventStore = Ext.create("Sch.data.EventStore");

    var crudManager = Ext.create("Sch.data.CrudManager", {
        autoLoad      : true,
        eventStore    : eventStore,
        resourceStore : resourceStore,
        transport   : {
            load    : {
                method  : 'GET',
                url     : 'data.js'
            },
            sync    : {
                url     : 'TODO'
            }
        }
    });

    var tabs = new Ext.TabPanel({
        activeTab : 0,
        height    : ExampleDefaults.height,
        width     : ExampleDefaults.width,
        renderTo  : 'example-container',
        items     : [
            {
                xtype       : 'schedulergrid',
                title       : 'Work schedule',
                readOnly    : true,
                crudManager : crudManager,

                plugins    : new Sch.plugin.Printable({
                    printRenderer : function (ev, res, tplData, row) {
                        if (row % 2 === 0) {
                            tplData.cls += ' specialEventType';
                        } else {
                            tplData.cls += ' normalEvent';
                        }
                        tplData.style = Ext.String.format('border-right-width:{0}px;', tplData.width);

                        return Ext.Date.format(ev.getStartDate(), 'M d');
                    },

                    beforePrint : function (sched) {
                        var v = sched.getSchedulingView();
                        this.oldRenderer = v.eventRenderer;

                        v.eventRenderer = this.printRenderer;
                    },

                    afterPrint : function (sched) {
                        sched.getSchedulingView().eventRenderer = this.oldRenderer;
                    }
                }),
                rowHeight  : 40,
                startDate  : new Date(2010, 4, 27),
                endDate    : new Date(2010, 5, 3),
                viewPreset : 'dayAndWeek',

                eventRenderer : function (eventRec, resourceRec, tplData, row) {
                    if (row % 2 === 0) {
                        tplData.cls = 'specialEventType';
                    } else {
                        tplData.cls = 'normalEvent';
                    }

                    return Ext.Date.format(eventRec.getStartDate(), 'M d');
                },

                // Setup static columns
                columns       : [
                    {header : 'Name', sortable : true, width : 100, dataIndex : 'Name'}
                ],

                resourceStore : resourceStore,
                eventStore    : eventStore
            }
        ],
        tbar      : [
            'This example shows you how you can print the chart content produced by Ext Scheduler.',
            '->',
            {
                iconCls : 'icon-print',
                scale   : 'large',
                text    : 'Print',
                handler : function () {
                    var pnl = tabs.getActiveTab();
                    pnl.print();
                }
            }
        ]
    });
});

