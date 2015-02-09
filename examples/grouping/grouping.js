Ext.ns('App');

Ext.Loader.setConfig({ enabled : true, disableCaching : true });
Ext.Loader.setPath('Sch', '../../js/Sch');

Ext.require([
    'Sch.panel.SchedulerGrid',
    'Sch.feature.Grouping',
    'Ext.data.*',
    'Ext.grid.*'
]);

Ext.onReady(function () {
    Ext.QuickTips.init();

    var preset = Sch.preset.Manager.get('dayAndWeek');

    preset.displayDateFormat = 'Y-m-d';

    preset.timeResolution = {
        unit        : Sch.util.Date.DAY,
        increment   : 1
    };
    App.Scheduler.init();
});


App.Scheduler = {

    // Initialize application
    init     : function () {
        this.grid = this.createGrid();
        this.grid.on('eventcontextmenu', this.onEventContextMenu, this);
    },

    // Default renderer, supplies data to be applied to the event template
    renderer : function (event, r, tplData, row, col, ds) {
        tplData.cls = r.get('Category');

        // Add data to be applied to the event template
        return event.getName();
    },

    onEventContextMenu : function (panel, rec, e) {
        e.stopEvent();

        if (!panel.ctx) {
            panel.ctx = new Ext.menu.Menu({
                items : [
                    {
                        text    : 'Delete event',
                        iconCls : 'icon-delete',
                        handler : function () {
                            panel.eventStore.remove(panel.ctx.rec);
                        }
                    },
                    {
                        text    : 'Delete selected events',
                        iconCls : 'icon-deleteall',
                        handler : function () {
                            panel.eventStore.remove(panel.getSelectionModel().getSelection());
                        }
                    }
                ]
            });
        }
        panel.ctx.rec = rec;
        panel.ctx.showAt(e.getXY());
    },

    createGrid : function () {
        Ext.define('MyResource', {
            extend : 'Sch.model.Resource',
            fields : [
                'Category',
                'Type'
            ]
        });

        var resourceStore = Ext.create('Sch.data.ResourceStore', {
                groupField : 'Category',
                sorters    : ['Category', 'Name'],
                model      : 'MyResource',
                proxy      : {
                    type   : 'ajax',
                    url    : 'resources.js',
                    reader : {
                        type : 'json'
                    }
                }
            }),

        // Store holding all the events
            eventStore = Ext.create('Sch.data.EventStore', {
                proxy : {
                    type   : 'ajax',
                    url    : 'dummydata.js',
                    reader : {
                        type : 'json'
                    }
                }
            });

        var g = Ext.create("Sch.panel.SchedulerGrid", {
            height        : ExampleDefaults.height,
            width         : ExampleDefaults.width,
            renderTo      : 'example-container',
            multiSelect   : true,
            startDate     : new Date(2007, 0, 1),
            endDate       : new Date(2007, 0, 14),
            viewPreset    : 'dayAndWeek',
            rowHeight     : 55,
            eventRenderer : this.renderer,

            features      : [
                {
                    id                 : 'group',
                    ftype              : 'scheduler_grouping',
                    groupHeaderTpl     : '{name}',
                    hideGroupedHeader  : true,
                    enableGroupingMenu : false,

                    headerRenderer : function (startDate, endDate, resources, meta) {
                        var count = 0;
                        var maxPerDay = 3;

                        Ext.each(resources, function (resource) {
                            Ext.each(resource.getEvents(), function (event) {
                                if (Sch.util.Date.betweenLesser(event.getStartDate(), startDate, endDate)) {
                                    ++count;
                                }
                            });
                        });

                        if (count > maxPerDay) {
                            // You can set custom styles easily
                            meta.cellStyle = 'font-style:italic';
                            meta.cellCls = 'overallocated';

                            return 'Warning: ' + count + ' tasks';
                        } else {
                            return count;
                        }
                    }
                }
            ],
            // Setup your static columns
            columns       : [
                {header : 'Projects', width : 100, dataIndex : 'Category'},
                {header : 'Staff', sortable : true, width : 140, dataIndex : 'Name'},
                {header : 'Employment type', sortable : true, width : 140, dataIndex : 'Type'}
            ],

            store         : resourceStore,
            resourceStore : resourceStore,
            eventStore    : eventStore,
            border        : true

        });

        resourceStore.load();
        eventStore.load();

        return g;
    }
};
