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
        rowHeight : 25,
        allowOverlap : false,
        resourceStore : resourceStore,
        eventStore: eventStore
    });

    scheduler.render(Ext.getBody());

    t.waitForEventsToRender(scheduler, function test() { 
        var firstTask = eventStore.first(),
            taskEl = t.getFirstEventEl(scheduler);
        
         // Drag event 25px down
        t.dragBy(taskEl, [0, 25], function() {
        
            t.ok(!firstTask.dirty, 'Could not move task due to allowOverlap being false');
        
            scheduler.getSchedulingView().allowOverlap = true;

            taskEl = t.getFirstEventEl(scheduler);
        
            t.dragBy(taskEl, [0, 25], function() {
                t.ok(firstTask.dirty, 'Task dirty after move');
                t.ok("ResourceId" in firstTask.modified, 'ResourceId modified');
            });
        });
    });
});
