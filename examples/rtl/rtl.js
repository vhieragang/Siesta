Ext.ns('App');

Ext.Loader.setConfig({ enabled : true, disableCaching : true });
Ext.Loader.setPath('Sch', '../../js/Sch');

Ext.require([
    'Sch.panel.SchedulerGrid'
]);

Ext.onReady(function() {
    App.Scheduler.init();
});

App.Scheduler = {
    
    // Initialize application
    init : function() {
        
        this.scheduler = this.createScheduler();
        
        this.scheduler.getResourceStore().loadData([
                {Id : 'r1', Name : 'Mike'},
                {Id : 'r2', Name : 'Linda'},
                {Id : 'r3', Name : 'Don'},
                {Id : 'r4', Name : 'Karen'},
                {Id : 'r5', Name : 'Doug'},
                {Id : 'r6', Name : 'Peter'}
        ]);
    },
    
    createScheduler : function() {
        var resourceStore = Ext.create('Sch.data.ResourceStore', {
                sorters:{
                    property: 'Name', 
                    direction: "ASC"
                },
                model : 'Sch.model.Resource'
            }),
        
            // Store holding all the events
            eventStore = Ext.create('Sch.data.EventStore', {
                data : [
                    {ResourceId : 'r1', PercentDone : 60, StartDate : new Date(2011, 0, 1, 10), EndDate: new Date(2011, 0, 1, 12)},
                    {ResourceId : 'r2', PercentDone : 20, StartDate : new Date(2011, 0, 1, 12), EndDate:new Date(2011, 0, 1, 13)},
                    {ResourceId : 'r3', PercentDone : 80, StartDate : new Date(2011, 0, 1, 14), EndDate:new Date(2011, 0, 1, 16)},
                    {ResourceId : 'r6', PercentDone : 100, StartDate : new Date(2011, 0, 1, 16),EndDate: new Date(2011, 0, 1, 18)}
                ]
            }),

            zoneStore = Ext.create('Ext.data.JsonStore', {
                model : 'Sch.model.Range',
                data : [
                    {
                        StartDate   : new Date(2011, 0, 1, 12),
                        EndDate     : new Date(2011, 0, 1, 13),
                        Cls         : 'myZoneStyle'
                    }
                ]
            });
        
        var sched = Ext.create("Sch.panel.SchedulerGrid", {
            height      : ExampleDefaults.height,
            width       : ExampleDefaults.width,
            barMargin   : 5,
            rtl         : true,
            rowHeight   : 45,
            border      : true,
            renderTo    : 'example-container',
            viewPreset  : 'hourAndDay',
            eventBodyTemplate: '<div class="value">{[fm.date(values.StartDate, "G:i")]}</div>',
            startDate   : new Date(2011, 0, 1, 9),
            endDate     : new Date(2011, 0, 1, 22),

            // Setup static columns
            columns     : [
               { header : 'Name', sortable : true, width : 100, dataIndex : 'Name' }
            ],
            plugins : [
                Ext.create("Sch.plugin.Zones", {
                    store : zoneStore
                })
            ],
            resourceZones : new Sch.data.EventStore({
                data : [
                    {ResourceId : 'r1', StartDate : new Date(2011, 0, 1, 9), EndDate: new Date(2011, 0, 1, 19)},
                    {ResourceId : 'r2', StartDate : new Date(2011, 0, 1, 12), EndDate:new Date(2011, 0, 1, 19)},
                    {ResourceId : 'r3', StartDate : new Date(2011, 0, 1, 11), EndDate:new Date(2011, 0, 1, 20)},
                    {ResourceId : 'r6', StartDate : new Date(2011, 0, 1, 12),EndDate: new Date(2011, 0, 1, 18)}
                ]
            }),
            resourceStore   : resourceStore,
            eventStore      : eventStore
        });
        
        return sched;
    }
};
