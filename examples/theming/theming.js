Ext.ns('App');

//Ext.Loader.setConfig({ enabled : true, disableCaching : true });
//Ext.Loader.setPath('Sch', '../../js/Sch');

//Ext.require([
//    'Sch.panel.SchedulerGrid',
//    'Sch.plugin.TimeGap'
//]);

Ext.define('Task', {
    extend : 'Sch.model.Event',
    fields : ['IconCls']
});

Ext.onReady(function () {
    App.Scheduler.init();
});

App.Scheduler = {

    // Initialize application
    init : function () {
        this.grid = this.createGrid();

        this.grid.store.loadData([
            {Id : 'r1', Name : 'Mike'},
            {Id : 'r2', Name : 'Linda'},
            {Id : 'r3', Name : 'Don'},
            {Id : 'r4', Name : 'Karen'},
            {Id : 'r5', Name : 'Doug'},
            {Id : 'r6', Name : 'Peter'}
        ]);

        this.grid.eventStore.load();
    },

    createGrid : function () {
        var start = new Date(2010, 7, 14);

        var resourceStore = new Sch.data.ResourceStore();

        // Store holding all the events
        var eventStore = new Sch.data.EventStore({
            model : 'Task',
            proxy : {
                type : 'ajax',
                url  : 'data.js'
            }
        });

        var g = Ext.create("Sch.panel.SchedulerGrid", {
            title             : 'Crisp Theme',
            height            : ExampleDefaults.height,
            width             : ExampleDefaults.width,
            renderTo          : 'example-container',
            startDate         : new Date(2010, 7, 14),
            endDate           : new Date(2010, 7, 21),
            viewPreset        : 'dayAndWeek',
            rowHeight         : 40,
            barMargin         : 4,
            frame             : true,
            eventBodyTemplate : '<span class="sch-icon {IconCls}"></span><span class="sch-name">{Name}</span>',
            columns           : [
                {
                    header    : 'Name',
                    sortable  : true,
                    width     : 100,
                    dataIndex : 'Name'
                }
            ],

            resourceStore : resourceStore,
            eventStore    : eventStore,

            tools : [
                {
                    type    : 'left',
                    handler : function () {
                        g.shiftPrevious();
                    }
                },
                {
                    type    : 'right',
                    handler : function () {
                        g.shiftNext();
                    }
                }
            ]
        });

        return g;
    }
};
