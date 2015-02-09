StartTest(function(t) {
    var resourceStore = Ext.create('Sch.data.ResourceStore', {
        model   : 'Sch.model.Resource',
        data    : [
            {Id : "r1", Name : 'Mike'},
            {Id : "r2", Name : 'Linda'}
        ]
    });
    
    // Store holding all the events
    var eventStore = Ext.create('Sch.data.EventStore', {
        resourceStore : resourceStore,
        data    : [
            {Id : 'e10', ResourceId: 'r1', Name : 'Assignment 1', StartDate : "2011-01-04", EndDate : "2011-01-06"},
            {Id : 'e11', ResourceId: 'r2', Name : 'Assignment 1', StartDate : "2011-01-05", EndDate : "2011-01-08"},

            // Should handle missing dates
            { },
            { StartDate : new Date() },
            { EndDate : new Date() }
        ]
    });
    
    var rec = eventStore.first();
    
    t.ok(eventStore.isDateRangeAvailable(rec.get('StartDate'), rec.get('EndDate'), rec, rec.getResource()), "isDateRangeAvailable correctly ignores the event itself");
    t.ok(!eventStore.isDateRangeAvailable(rec.get('StartDate'), rec.get('EndDate'), null, resourceStore.last()), "isDateRangeAvailable correctly reports unavailable time slot");
})    
