StartTest(function (t) {
    t.diag('Sharing resource store');
    var eventStore1 = Ext.create('Sch.data.EventStore', {
        data: [
            { Id: 1, ResourceId: 1, Name: 'First', StartDate: "2010-12-09", EndDate: "2010-12-13" }
        ]
    });

    var eventStore2 = Ext.create('Sch.data.EventStore', {
        data: [
            { Id: 1, ResourceId: 1, Name: 'Second', StartDate: "2010-12-09", EndDate: "2010-12-13" }
        ]
    });

    var resourceStore1 = Ext.create('Sch.data.ResourceStore', {
        data: [
            { Id: 1, Name: 'Linda' }
        ]
    });

    var resourceStore2 = Ext.create('Sch.data.ResourceStore', {
        data: [
            { Id: 2, Name: 'Bork' }
        ]
    });

    var pnl1 = t.getScheduler({
        resourceStore: resourceStore1,
        eventStore: eventStore1
    });

    var pnl2 = t.getScheduler({
        resourceStore: resourceStore1,
        eventStore: eventStore2
    });

    t.is(pnl1.getResourceStore(), pnl2.getResourceStore(), 'Resource store shared between schedulers');
    t.is(pnl1.getEventStore(), eventStore1, 'Correct 1st eventStore');
    t.is(pnl2.getEventStore(), eventStore2, 'Correct 2nd eventStore');


    t.diag('Sharing event store');

    var pnl3 = t.getScheduler({
        resourceStore: resourceStore1,
        eventStore: eventStore1
    });

    var pnl4 = t.getScheduler({
        resourceStore: resourceStore2,
        eventStore: eventStore1
    });

    t.is(pnl3.getEventStore(), pnl4.getEventStore(), 'Event store shared between schedulers');
    t.is(pnl3.getResourceStore(), resourceStore1, 'Correct 1st resourceStore');
    t.is(pnl4.getResourceStore(), resourceStore2, 'Correct 2nd resourceStore');

})    
