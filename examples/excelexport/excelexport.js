/* global App */
Ext.ns('App');

Ext.Loader.setConfig({ enabled : true, disableCaching : true });
Ext.Loader.setPath('Sch', '../../js/Sch');
Ext.Loader.setPath('Ext.ux', 'http://cdn.sencha.com/ext/gpl/5.1.0/examples/ux');

Ext.require([
    //'Sch.panel.SchedulerGrid',
    'Ext.form.Panel',
    'Ext.ux.form.MultiSelect',
    'Ext.ux.form.ItemSelector'
]);

Ext.onReady(function () {
    App.Scheduler.init();
});

App.Scheduler = {

    // Initialize application
    init : function () {
        // Store holding all the resources
        var resourceStore = new Sch.data.ResourceStore({
            data : [
                { Id : 'r1', Name : 'Mike' },
                { Id : 'r2', Name : 'Linda' },
                { Id : 'r3', Name : 'Don' },
                { Id : 'r4', Name : 'Karen' },
                { Id : 'r5', Name : 'Doug' },
                { Id : 'r6', Name : 'Peter' }
            ]
        });

        // Store holding all the events
        var eventStore = new Sch.data.EventStore({
            proxy : {
                type : 'ajax',
                url  : 'dummydata.js'
            }
        });

        var eventList = new Ext.grid.Panel({
            height   : 200,
            width    : 200,
            renderTo : Ext.getBody(),
            store    : eventStore,
            dock     : 'right',

            // Setup static columns
            columns  : [
                { header      : 'Starts',
                    sortable  : true,
                    width     : 80,
                    dataIndex : 'StartDate',
                    xtype     : 'datecolumn',
                    format    : 'Y-m-d',
                    field     : { xtype : 'datefield', format : 'Y-m-d' }
                },
                { header : 'Name', sortable : true, flex : 1, dataIndex : 'Name', field : { xtype : 'textfield' } }
            ],

            plugins : [
                Ext.create('Ext.grid.plugin.CellEditing', {
                    clicksToEdit : 1
                })
            ]
        });

        var g = Ext.create("Sch.panel.SchedulerGrid", {
            border             : true,
            height             : ExampleDefaults.height,
            width              : ExampleDefaults.width,
            renderTo           : 'example-container',
            eventResizeHandles : 'none',
            enableDragCreation : false,
            startDate          : new Date(2010, 2, 2),
            endDate            : new Date(2010, 2, 12),
            viewPreset         : 'weekAndDayLetter',
            rowHeight          : 32,

            // Setup static columns
            columns            : [
                { header : 'Name', sortable : true, width : 100, dataIndex : 'Name' }
            ],
            forceFit           : true,
            plugins            : new Sch.plugin.ExcelExport(),
            resourceStore      : resourceStore,
            eventStore         : eventStore,
            buttonAlign        : 'center',
            buttons            : [
                {
                    scale   : 'large',
                    iconCls : 'excel',
                    text    : 'Export schedule to Excel',
                    handler : function (btn) {
                        g.exportToExcel();
                    },
                    scope   : this
                }
            ],

            dockedItems : [
                eventList
            ]
        });

        eventStore.load();


    }
};
