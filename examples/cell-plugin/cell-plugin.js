/* global App */
Ext.ns('App');

Ext.Loader.setConfig({ enabled : true, disableCaching : true });

Ext.Loader.setPath('App', '.');
Ext.Loader.setPath('Sch.plugin', '.');

Ext.onReady(function () {
    Ext.QuickTips.init();
    App.Scheduler.init();
});

App.Scheduler = {
    // Bootstrap function
    init : function () {
        this.scheduler = this.createScheduler();
    },

    createScheduler : function () {
        var me = this;

        Ext.define('Resource', {
            extend : 'Sch.model.Resource',
            fields : [
                'Type'
            ]
        });

        Ext.define('Event', {
            extend : 'Sch.model.Event',

            fields : [
                'Deletable'
            ]
        });

        // Store holding all the resources
        var resourceStore = App.resourceStore = Ext.create("Sch.data.ResourceStore", {
            model    : 'Resource',
            sortInfo : { field : 'Name', direction : "ASC" },

            data : [
                { Id : 'a', Name : 'Rob', Type : 'Sales' },
                { Id : 'b', Name : 'Mike', Type : 'Sales' },
                { Id : 'c', Name : 'Kate', Type : 'Management' },
                { Id : 'd', Name : 'Lisa', Type : 'Developer' },
                { Id : 'e', Name : 'Dave', Type : 'Developer' },
                { Id : 'f', Name : 'Arnold', Type : 'Developer' },
                { Id : 'g', Name : 'Lee', Type : 'Sales' },
                { Id : 'h', Name : 'Jong', Type : 'Management' }
            ]
        });

        // Store holding all the events
        var eventStore = App.eventStore = Ext.create("Sch.data.EventStore", {
            model : 'Event',
            data : [
                { StartDate : new Date(2012, 5, 21, 8), EndDate : new Date(2012, 5, 21, 10), ResourceId : 'c'},
                { StartDate : new Date(2012, 5, 21, 11), EndDate : new Date(2012, 5, 21, 14), ResourceId : 'c'}
            ]
        });

        var editor = new Sch.plugin.CellPlugin({
            dateFormat : 'G'
        });

        Ext.apply(Sch.preset.Manager.getPreset('weekAndDay'), {
            columnLinesFor : 'bottom'
        });

        var ds = App.sched = Ext.create("Sch.panel.SchedulerGrid", {
            renderTo      : 'example-container',
            height        : 300,
            width         : ExampleDefaults.width,
            rowHeight     : 30,
            title         : 'Scheduler Event Tools',
            resourceStore : resourceStore,
            eventStore    : eventStore,
            viewPreset    : 'weekAndDay',
            startDate     : new Date(2012, 5, 21),
            columnWidth   : 100,
            
            viewConfig    : {
                horizontalLayoutCls : 'Sch.eventlayout.Table'
            },

            columns       : [
                { header : 'Staff', sortable : true, width : 126, dataIndex : 'Name' }
            ],

            eventResizeHandles  : 'none',
            enableEventDragDrop : false,
            enableDragCreation  : false,

            eventRenderer : function (eventRec, resourceRec, templateData) {
                // Uncomment these lines to make events fill a full day cell always.
//                var tick = this.timeAxis.getTickFromDate(eventRec.getStartDate());
//                tick = this.timeAxis.getAt(Math.floor(tick));
//                
//                if (tick) {
//                    templateData.left = this.timeAxisViewModel.getPositionFromDate(tick.getStartDate()) - 1;
//                }
//                templateData.width = this.timeAxisViewModel.getTickWidth();
                
                templateData.cls = 'my-event';
                return Ext.Date.format(eventRec.getStartDate(), 'G:i') + ' - ' + Ext.Date.format(eventRec.getEndDate(), 'G:i');
            },

            plugins : editor,

            dockedItems : [
                {
                    id          : 'bottom-summary',
                    dock        : 'bottom',
                    bodyPadding : 3,
                    height      : 30
                }
            ]
        });

        editor.on('selectionchange', function (plug, selection) {
            Ext.getCmp('bottom-summary').update(selection.length + ' cells selected');
        });

        return ds;
    }
};