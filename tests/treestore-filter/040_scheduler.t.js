StartTest(function(t) {
    // in this test we'll verify that filtering actually works in scheduler
    // (previous tests verify that for "pure-ExtJS" case)
    // for filtering to work in scheduler the nodestore needs to be shared which is done in Lockable mixin
    // and thus subject for extensive test coverage
    
    t.expectGlobals('Gate')
    
    Ext.define('Gate', {
        extend : 'Sch.model.Resource',
        fields : ['Capacity']
    });

    var resourceStore = Ext.create('Sch.data.ResourceTreeStore', {
        model   : 'Gate',
        proxy   : {
            type    : 'ajax',
            //the store will get the content from the .js file
            url     : 'treestore-filter/040_scheduler.json'
        },
        folderSort  : true
    });
    
    // Store holding all the departures
    var flightStore = Ext.create('Sch.data.EventStore', {
        data    : [
            // Grouping tasks
            {ResourceId: 3, Name : 'Summary', StartDate : "2011-12-02 08:20", EndDate : "2011-12-02 11:25"},
            {ResourceId: 3, Name : 'Summary', StartDate : "2011-12-02 12:10", EndDate : "2011-12-02 13:50"},
            {ResourceId: 3, Name : 'Summary', StartDate : "2011-12-02 14:30", EndDate : "2011-12-02 16:10"},
            
            {ResourceId: 6, Name : 'London 895', StartDate : "2011-12-02 08:20", EndDate : "2011-12-02 09:50"},
            {ResourceId: 4, Name : 'Moscow 167', StartDate : "2011-12-02 09:10", EndDate : "2011-12-02 10:40"},
            {ResourceId: 5, Name : 'Berlin 291', StartDate : "2011-12-02 09:25", EndDate : "2011-12-02 11:25"},
            {ResourceId: 7, Name : 'Brussels 107', StartDate : "2011-12-02 12:10", EndDate : "2011-12-02 13:50"},
            {ResourceId: 8, Name : 'Krasnodar 101', StartDate : "2011-12-02 14:30", EndDate : "2011-12-02 16:10"},
            
            {ResourceId: 17, Name : 'Split 811', StartDate : "2011-12-02 16:10", EndDate : "2011-12-02 18:30"},
            {ResourceId: 18, Name : 'Rome 587', StartDate : "2011-12-02 13:15", EndDate : "2011-12-02 14:25"},
            {ResourceId: 24, Name : 'Prague 978', StartDate : "2011-12-02 16:40", EndDate : "2011-12-02 18:00"},
            {ResourceId: 25, Name : 'Stockholm 581', StartDate : "2011-12-02 11:10", EndDate : "2011-12-02 12:30"},

            {ResourceId: 10, Name : 'Copenhagen 111', StartDate : "2011-12-02 16:10", EndDate : "2011-12-02 18:30"},
            {ResourceId: 11, Name : 'Gothenburg 233', StartDate : "2011-12-02 13:15", EndDate : "2011-12-02 14:25"},
            {ResourceId: 12, Name : 'New York 231', StartDate : "2011-12-02 16:40", EndDate : "2011-12-02 18:00"},
            {ResourceId: 13, Name : 'Paris 321', StartDate : "2011-12-02 11:10", EndDate : "2011-12-02 12:30"}
        ]
    });
        
    var tree = Ext.create('Sch.panel.SchedulerTree', {
        height          : 600,
        width           : 800,
        
        renderTo        : Ext.getBody(),
        rowHeight       : 32,
        eventStore      : flightStore,
        resourceStore   : resourceStore,
        
        columnLines     : false,
        rowLines        : true,
        
        viewPreset      : 'hourAndDay',
        startDate       : new Date(2011, 11, 2, 8),
        endDate         : new Date(2011, 11, 2, 18),
        
        eventRenderer : function(flight, resource, meta) {
            if (resource.data.leaf) {
                meta.cls = 'leaf';
                return flight.get('Name');
            } else {
                meta.cls = 'group';
                return '&nbsp;';
            }
        },

        columns: [
            {
                xtype       : 'treecolumn', //this is so we know which column will show the tree
                text        : 'Name',
                width       : 200,
                sortable    : true,
                dataIndex   : 'Name'
            },
            {
                text        : 'Capacity',
                width       : 100,
                sortable    : true,
                dataIndex   : 'Capacity'
            }
        ]
    });
    
    var rowCount        
    
    t.chain(
        {
            waitFor     : 'EventsToRender',
            args        : [ tree ]
        },
        function (next) {
            rowCount    = tree.normalGrid.getView().getNodes().length
            
            resourceStore.filterTreeBy(function (gate) {
                return gate.get('Name').match(/1/)
            })
            
            t.isLess(tree.normalGrid.getView().getNodes().length, rowCount, 'Number of rows in the DOM should decrease')
        }
    )
})    
