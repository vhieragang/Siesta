StartTest(function(t) {
    var resourceStore = Ext.create('Sch.data.ResourceStore', {
        model : 'Sch.model.Resource',
        data : [
            {Id : 'c1', Name : 'Foo'},
            {Id : 'c2', Name : 'Bar'}
        ]
    }),
        
    // Store holding all the events
    eventStore = t.getEventStore({
        data : [
            {ResourceId: 'c1', Name : 'Mike', StartDate : "2010-12-09 08:45", EndDate : "2010-12-09 11:00"},
            {ResourceId: 'c2', Name : 'Linda', StartDate : "2010-12-09 08:45", EndDate : "2010-12-09 11:00"}
        ]
    });

    var scheduler = t.getScheduler({
        viewPreset : 'hourAndDay',
        startDate : new Date(2010, 11, 9, 8),
        endDate : new Date(2010, 11, 9, 20),
        allowOverlap : false,
        resourceStore : resourceStore,
        eventStore: eventStore,
        renderTo : Ext.getBody()
    });

    // rendering is async
    t.waitForEventsToRender(scheduler, function() { 
        var firstTask = eventStore.first(),
            taskEl = t.getFirstEventEl(scheduler);
        
         // Drag event to cell below
        t.dragBy(taskEl, [0, 25], function() {
        
            t.ok(!firstTask.dirty, 'Could not move task due to allowOverlap being false');
        
            scheduler.getSchedulingView().allowOverlap = true;

            taskEl = t.getFirstEventEl(scheduler);
        
            // Drag event to cell below
            t.dragBy(taskEl, [0, 25], function() {
                t.ok(firstTask.dirty && firstTask.modified.ResourceId, 'Could move task to overlapping position when allowOverlap is true');
            });
        });
    });
});    
