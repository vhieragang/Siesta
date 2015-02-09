StartTest(function (t) {

    //======================================================================================================================================================================================================================================================
    t.diag('Sanity')

    t.ok(Sch.panel.SchedulerGrid, "Sch.panel.SchedulerGrid is here")


    var resourceStore = Ext.create('Sch.data.ResourceTreeStore', {
        root: {
            expanded : true,
            children : [
                {
		            Id      : 1,
		            Name    : 'Kastrup Airport',
		            iconCls : 'sch-airport',
		            leaf    : true
                }
            ]
        }
    });

    // Store holding all the events
    var eventStore = Ext.create('Sch.data.EventStore', {
        data : [
            {
                ResourceId : 1,
		        Name       : 'Assignment 1',
		        StartDate  : "2011-01-04",
		        EndDate    : "2011-01-06"
            }
        ]

    });

    //======================================================================================================================================================================================================================================================
    t.diag('Instantiation')

    var scheduler = new Sch.panel.SchedulerTree({
        eventResizeHandles: 'both',

        startDate: new Date(2011, 0, 3),
        endDate: new Date(2011, 0, 13),

        viewPreset: 'dayAndWeek',

        width: 800,
        height: 600,

        rowHeight: 30,

        // Setup static columns
        columns   : [
            {
		        header    : 'Name',
		        sortable  : true,
		        width     : 100,
		        xtype     : 'treecolumn',
		        dataIndex : 'Name'
            }
        ],

        resourceStore: resourceStore,
        eventStore: eventStore
    });

    t.pass("Scheduler has been successfully instantiated")


    //======================================================================================================================================================================================================================================================
    t.diag('Rendering')

    scheduler.render(Ext.getBody())

    t.ok(scheduler.el, "Scheduler tree has been successfully rendered")


    //======================================================================================================================================================================================================================================================
    t.diag('Switch preset')

    scheduler.switchViewPreset('weekAndMonth');
    scheduler.switchViewPreset('monthAndYear');

    t.pass("View preset has been successfully changed")

    t.getSchedulerTree().destroy();
    t.pass("Destroyed, without rendering")
})