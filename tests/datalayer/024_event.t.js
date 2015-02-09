StartTest(function (t) {

    var resourceStore = Ext.create('Sch.data.ResourceStore', {
            model : 'Sch.model.Resource',
            data  : [
                {Id : 'c1', Name : 'Foo'},
                {Id : 'c2', Name : 'Foo'}
            ]
        }),

    // Store holding all the events
        eventStore = Ext.create('Sch.data.EventStore', {
            resourceStore : resourceStore
        });

    resourceStore.eventStore = eventStore;

    t.it('Verifying the custom "previous" model property works', function (t) {
        var event = new Sch.model.Event({ResourceId : 'c1', Name : 'Mike', StartDate : "2010-12-09 09:45", EndDate : "2010-12-09 11:00"})
        eventStore.add(event);

        t.notOk(event.previous, 'Should not find a "previous" property on a fresh model');

        t.is(event.getResource(), resourceStore.first(), "getResource located the resource from an event");
        t.is(resourceStore.first().getEvents()[0], eventStore.first(), "getEvents located the correct event");

        eventStore.on('update', function (s, model) {
            t.is(model.modified.ResourceId, 'c1', 'Simple: After "set", The model "modified" object contained the original resource value');
            t.isDeeply(model.previous, { ResourceId : 'c1' }, 'Simple: After "set", The model "previous" object contained the previous resource value');
        }, null, { single : true });

        // The 'previous' population should work when setting a simple property
        event.set('ResourceId', 'c3');

        t.notOk(event.previous, 'Should not find a "previous" property after a simple set operation has completed');

        eventStore.on('update', function (s, model) {
            t.is(model.modified.ResourceId, 'c1', 'Object: After "set", The model "modified" object contained the original resource value');
            t.isDeeply(model.previous, { ResourceId : 'c3' }, 'Object: After "set", The model "previous" object contained the previous resource value');
        }, null, { single : true });

        // The 'previous' population should work when setting many properties at once using object notation
        event.set({
            ResourceId : 'c2'
        });

        t.notOk(event.previous, 'Should not find a "previous" property after a object set operation has completed');


        // The 'previous' property should be removed after a multi-edit operation using endEdit
        event.beginEdit();
        event.set('Name', 'foo');
        event.endEdit();

        t.notOk(event.previous, 'Should not find a "previous" property after endEdit has been called');

        event.beginEdit();
        event.set('Name', 'bar');
        event.cancelEdit();

        t.notOk(event.previous, 'Should not find a "previous" property after cancelEdit has been called');

        eventStore.on('update', function (s, model) {
            t.is(model.previous.ResourceId, 'c2', 'After "reject", The model "previous" object contained the previous resource value');
        }, null, { single : true });

        event.reject();
        t.notOk(event.previous, 'Should not find a "previous" property after a reject operation has completed');
    });


    t.it('Validation, isPersistable', function (t) {
        var event = new Sch.model.Event({ResourceId : 'c1', Name : 'Mike', StartDate : "2010-12-09 09:45", EndDate : "2010-12-09 11:00"})
        eventStore.add(event);

        t.ok(event.isValid(), 'isValid');

        event.setStartDate(new Date(event.getEndDate().getTime() + 1));
        t.notOk(event.isValid(), 'isValid fail');

        t.ok(event.isPersistable(), 'isPersistable true');

        var newResource = new resourceStore.model();
        resourceStore.insert(0, newResource);
        event.setResource(newResource);

        t.notOk(event.isPersistable(), 'isPersistable false');
        t.ok(event.getResourceId(), newResource.internalId, 'found phantom resource internal id');
        t.is(event.getResource(), newResource, 'found phantom resource');
    });

    t.it('getters and setters', function (t) {
        var event = new Sch.model.Event({ResourceId : 'c1', Name : 'Mike', StartDate : "2010-12-09 09:45", EndDate : "2010-12-09 11:00"})
        eventStore.add(event);

        event.setStartDate(null);
        t.is(event.getStartDate(), null, 'Could set end date to null');

        event.setEndDate(null);
        t.is(event.getEndDate(), null, 'Could set end date to null');

        event.setStartEndDate(new Date(2010, 1, 1), new Date(2010, 2, 1));
        t.is(event.getStartDate(), new Date(2010, 1, 1), 'Could set date to 2010, 1, 1');
        t.is(event.getEndDate(), new Date(2010, 2, 1), 'Could set date to 2010, 2, 1');

        event.setStartEndDate(null, null);
        t.is(event.getStartDate(), null, 'Could set start date to null, setStartEndDate');
        t.is(event.getEndDate(), null, 'Could set end date to null, setStartEndDate');
    })

    t.it('Events should support belonging to multiple stores', function (t) {
        var event = new Sch.model.Event({ResourceId : 'c1', Name : 'Mike', StartDate : "2010-12-09 09:45", EndDate : "2010-12-09 11:00"})
        var resource = resourceStore.getById('c1');

        var otherStore = Ext.create('Ext.data.Store', {
            model : Sch.model.Event,
            data : [event]
        });

        eventStore.add(event);

        t.is(event.getResource(null, eventStore), resource);
        t.isDeeply(event.getResources(eventStore), [resource]);
    });
})
