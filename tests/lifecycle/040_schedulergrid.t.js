StartTest(function(t) {
    
    //======================================================================================================================================================================================================================================================
    t.diag('Sanity')

    t.ok(Sch.panel.SchedulerGrid, "Sch.panel.SchedulerGrid is here")
    
    //======================================================================================================================================================================================================================================================
    t.diag('Instantiation')
    
    var scheduler =  t.getScheduler({
        eventResizeHandles : 'both',
        
        startDate   : new Date(2011, 0, 3), 
        endDate     : new Date(2011, 0, 13), 
        
        viewPreset  : 'dayAndWeek',
        
        width       : 800,
        height      : 600,
        
        // Setup static columns
        columns     : [
            {header : 'Name', sortable:true, width:100, dataIndex : 'Name'}
        ]
    });

    t.ok(scheduler.resourceStore.getCount() > 0 && scheduler.eventStore.getCount() > 0, 'Some data in the stores')
    
    t.pass("Scheduler has been successfully instantiated")
    
    //======================================================================================================================================================================================================================================================
    t.diag('Rendering')
    
    scheduler.render(Ext.getBody())
    
    t.ok(scheduler.el, "Scheduler has been successfully rendered")

    //======================================================================================================================================================================================================================================================
    t.diag('Switch preset')
    
    scheduler.switchViewPreset('weekAndMonth');
    scheduler.switchViewPreset('monthAndYear');
    
    t.pass("View preset has been successfully changed")
    
    
    //======================================================================================================================================================================================================================================================
    t.diag('Switch orientation')
    
    scheduler.setOrientation('vertical');
    
    t.pass("Orientation has been successfully changed to vertical")
    
    
    scheduler.setOrientation('horizontal');
    
    t.pass("Orientation has been successfully changed back to horizontal")
    
    t.getScheduler().destroy();

    t.pass("Could destroy scheduler without rendering it")

    var win  = new Ext.Window({
        
        items : new Ext.TabPanel({
            items : [{}, { 
                xtype : 'schedulergrid', 
                columns : [{locked : true}],
                resourceStore : new Sch.data.ResourceStore({ model : 'Sch.model.Resource' }), 
                eventStore : new Sch.data.EventStore() 
            }]
        })
    });
    
    win.destroy();
    t.pass("Could destroy scheduler before rendering it, using xtype")
})    
