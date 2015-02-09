Ext.ns('App');

//Ext.Loader.setConfig({ enabled : true, disableCaching : true });
//Ext.Loader.setPath('Sch', '../../js/Sch');

//Ext.require([
//    'Sch.panel.SchedulerGrid',
//    'Sch.plugin.TimeGap'
//]);

Ext.onReady(function () {
    App.Scheduler.init();
});

App.Scheduler = {

    // Initialize application
    init : function () {
        this.grid = this.createGrid();

        this.grid.store.loadData([
            {Id : 'r1', Name : 'Mike', Color : 'green'},
            {Id : 'r2', Name : 'Linda', Color : 'red'},
            {Id : 'r3', Name : 'Don', Color : 'blue'},
            {Id : 'r4', Name : 'Karen', Color : 'black'},
            {Id : 'r5', Name : 'Doug', Color : '#777'},
            {Id : 'r6', Name : 'Peter', Color : '#444'}
        ]);

        this.grid.eventStore.load();
    },

    renderer : function (item, r, tplData, row, col, ds, index) {
        tplData.style = 'background-color:' + r.get('Color');
        return item.get('Name');
    },

    createGrid : function () {
        Ext.define('Person', {
            extend : 'Sch.model.Resource',
            fields : [
                {name : 'Color'}
            ]
        });

        Ext.define('Assignment', {
            extend : 'Sch.model.Event'
        });

        var start = new Date(2010, 7, 14);

        // Store holding all the resources
        var resourceStore = new Sch.data.ResourceStore({
            idProperty : 'Id',
            model      : 'Person'
        });

        // Store holding all the events
        var eventStore = new Sch.data.EventStore({
            model : 'Assignment',
            proxy : {
                type : 'ajax',
                url  : 'data.js'
            }
        });

        var g = Ext.create("Sch.panel.SchedulerGrid", {
            border             : true,
            height             : ExampleDefaults.height,
            width              : ExampleDefaults.width,
            renderTo           : 'example-container',
            eventResizeHandles : 'both',
            startDate          : new Date(2010, 7, 14),
            endDate            : new Date(2010, 7, 21),
            viewPreset         : 'dayAndWeek',
            eventRenderer      : this.renderer,
            loadMask           : true,

            // Setup static columns
            columns            : [
                {
                    header    : 'Name',
                    width     : 100,
                    xtype     : 'templatecolumn',
                    dataIndex : 'Name',
                    tpl       : '<div class="row-colorbox" style="background-color:{Color}"></div>{Name}'
                }
            ],

            plugins       : [new Sch.plugin.TimeGap({
                getZoneCls : function (start, end) {
                    if (Sch.util.Date.getDurationInDays(start, end) > 2) {
                        return 'long-unallocated-slot';
                    }
                }
            })],
            resourceStore : resourceStore,
            eventStore    : eventStore,

            tbar : [
                {
                    iconCls : 'icon-previous',
                    scale   : 'medium',
                    handler : function () {
                        g.shiftPrevious();
                    }
                },
                {
                    iconCls : 'icon-next',
                    scale   : 'medium',
                    handler : function () {
                        g.shiftNext();
                    }
                }
            ]
        });

        return g;
    }
};
