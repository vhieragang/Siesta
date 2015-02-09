Ext.ns('App');
//Ext.Loader.setConfig({ enabled : true, disableCaching : true });
//Ext.Loader.setPath('Sch', '../../js/Sch');

//Ext.require([
//    'Sch.panel.SchedulerGrid'
//]);

Ext.onReady(function () {
    Ext.QuickTips.init();

    App.Scheduler.init();
});

App.Scheduler = {

    // Initialize application
    init : function () {

        this.grid = this.createGrid();

        // Load resource data
        this.grid.resourceStore.loadData([
            {Id : 'r1', Name : 'Mike Anderson', Category : 'Consultants', Type : 'Full time'},
            {Id : 'r2', Name : 'Kevin Larson', Category : 'Consultants', Type : 'Full time'},
            {Id : 'r3', Name : 'Brett Hornbach', Category : 'Consultants', Type : 'Full time'},
            {Id : 'r4', Name : 'Patrick Davis', Category : 'Consultants', Type : 'Full time'},
            {Id : 'r5', Name : 'Jack Larson', Category : 'Consultants', Type : 'Full time'},
            {Id : 'r6', Name : 'Dennis King', Category : 'Consultants', Type : 'Full time'}
        ]);
    },

    createGrid : function () {
        Ext.define('Resource', {
            extend : 'Sch.model.Resource',
            fields : [
                'Category',
                'Type'
            ]
        });

        Ext.define('Event', {
            extend : 'Sch.model.Event',
            fields : [
                {name : 'Title'},
                {name : 'Type'}
            ]
        });

        // Store holding all the resources
        var resourceStore = new Sch.data.ResourceStore({
            model      : 'Resource',
            idProperty : 'Id'
        });

        // Store holding all the events
        var eventStore = new Sch.data.EventStore({
            proxy : {
                type : 'ajax',
                url  : 'data.js'
            },
            model : 'Event'
        });

        var start = new Date(2010, 5, 1),
            end = new Date(2010, 5, 11);

        var g = new Sch.panel.SchedulerGrid({
            readOnly : true,

            height    : ExampleDefaults.height,
            width     : ExampleDefaults.width,
            renderTo  : 'example-container',
            rowHeight : 48,
            loadMask  : { store : eventStore },

            viewConfig : {
                dynamicRowHeight   : false,
                managedEventSizing : false
            },

            // Setup your static columns
            columns    : [
                {header : 'Staff', sortable : true, width : 120, dataIndex : 'Name'}
            ],

            resourceStore : resourceStore,
            eventStore    : eventStore,
            border        : true,

            // Setup view configuration
            startDate     : start,
            endDate       : end,
            viewPreset    : 'dayAndWeek',
            eventRenderer : function (event, r, tplData, row, col, ds) {
                // Add a custom CSS class to the event element
                if (event.getEndDate() - event.getStartDate() === 0) {
                    tplData.cls = 'sch-event-milestone-bottom';
                } else {
                    tplData.cls = 'normalEvent';
                }
                return event.get('Title');
            }
        });

        eventStore.load();

        return g;
    }
};
