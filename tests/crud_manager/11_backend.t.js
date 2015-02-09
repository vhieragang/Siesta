StartTest(function(t) {

    var resourceStore, eventStore, crud;

    var testConfig = t.harness.getScriptDescriptor(t.url);

    var setup   = function (fn, testConfig) {

        resourceStore   = t.getResourceStore({
            storeId     : 'resources',
            data        : []
        });

        eventStore      = t.getEventStore({
            storeId         : 'events',
            data            : [],
            resourceStore   : resourceStore
        });

        resourceStore.eventStore = eventStore;

        crud = Ext.create('Sch.data.CrudManager', {
            resourceStore   : resourceStore,
            eventStore      : eventStore,
            transport       : {
                load    : Ext.apply({ method : 'POST' }, testConfig.load),
                sync    : Ext.apply({ method : 'POST' }, testConfig.sync)
            },
            listeners       : {
                loadfail    : function () { t.fail('Loading failed'); },
                syncfail    : function () { t.fail('Persisting failed'); }
            }
        });

        Ext.Ajax.request({
            url     : testConfig.resetUrl,
            success : fn,
            failure : function () { t.fail('Reset failed'); }
        });
    };

    t.it('Should be possible to save some resources and events', function (t) {
        t.chain(
            function (next) {
                setup(next, testConfig);
            },

            function (next) {
                var addedResources  = resourceStore.add([{ Name : 'resource1' }, { Name : 'resource2' }]);

                eventStore.add([
                    {
                        ResourceId  : addedResources[0].internalId,
                        Name        : 'event1',
                        StartDate   : new Date(2013, 0, 1),
                        EndDate     : new Date(2013, 0, 15)
                    },
                    {
                        ResourceId  : addedResources[0].internalId,
                        Name        : 'event2',
                        StartDate   : new Date(2013, 0, 10),
                        EndDate     : new Date(2013, 0, 12)
                    },
                    {
                        ResourceId  : addedResources[0].internalId,
                        Name        : 'event3',
                        StartDate   : new Date(2013, 0, 11),
                        EndDate     : new Date(2013, 0, 12)
                    }
                ]);

                crud.sync(next, function () { t.fail('Sync failed'); });
            },

            function (next) {
                var resource1   = resourceStore.findRecord('Name', 'resource1');
                t.ok(resource1.getId(), 'Resource resource1 has Id filled');

                var events      = resource1.getEvents(eventStore);

                t.is(events.length, 3, 'Resource resource1 assigned to 3 events');
                t.ok(events[0].getId(), 'Event #0 has Id filled');
                t.ok(events[1].getId(), 'Event #1 has Id filled');

                t.is(events[0].getResourceId(), resource1.getId(), 'Event #0 has correct ResourceId');
                t.is(events[1].getResourceId(), resource1.getId(), 'Event #0 has correct ResourceId');

                crud.load(next, function () { t.fail('Load failed'); });
            },

            function (next) {
                t.is(resourceStore.getCount(), 2, 'Correct number of resources loaded');
                t.is(eventStore.getCount(), 3, 'Correct number of events loaded');

                var resource1   = resourceStore.findRecord('Name', 'resource1');
                t.ok(resource1.getId(), 'Resource resource1 has Id filled');

                var events      = resource1.getEvents(eventStore);

                t.is(events.length, 3, 'Resource resource1 assigned to 3 events');
                t.ok(events[0].getId(), 'Event #0 has Id filled');
                t.ok(events[1].getId(), 'Event #1 has Id filled');

                t.is(events[0].getResourceId(), resource1.getId(), 'Event #0 has correct ResourceId');
                t.is(events[1].getResourceId(), resource1.getId(), 'Event #0 has correct ResourceId');

                next();
            },

            function (next) {
                var event1          = eventStore.findRecord('Name', 'event1');
                var event2          = eventStore.findRecord('Name', 'event2');
                var event3          = eventStore.findRecord('Name', 'event3');
                var resource1       = resourceStore.findRecord('Name', 'resource1');
                var resource2       = resourceStore.findRecord('Name', 'resource2');

                var addedResources  = resourceStore.add([{ Name : 'resource3' }]);

                event2.assign(addedResources[0]);

                resourceStore.remove(resource2);

                eventStore.remove(event3);

                event1.setName('EVENT-1');

                resource1.setName('RESOURCE-1');

                crud.sync(next, function () { t.fail('Sync failed'); });
            },

            function (next) {
                t.isDeeply(resourceStore.getRemovedRecords(), [], 'No removed records');
                t.isDeeply(resourceStore.getModifiedRecords(), [], 'No modified records');

                t.isDeeply(eventStore.getRemovedRecords(), [], 'No removed records');
                t.isDeeply(eventStore.getModifiedRecords(), [], 'No modified records');

                var event1          = eventStore.findRecord('Name', 'EVENT-1');
                var event2          = eventStore.findRecord('Name', 'event2');
                var event3          = eventStore.findRecord('Name', 'event3');
                var resource1       = resourceStore.findRecord('Name', 'RESOURCE-1');
                var resource2       = resourceStore.findRecord('Name', 'resource2');
                var resource3       = resourceStore.findRecord('Name', 'resource3');

                t.ok(event1, 'EVENT-1 found');
                t.ok(resource1, 'RESOURCE-1 found');
                t.notOk(event1.dirty, 'EVENT-1 is not dirty');
                t.notOk(resource1.dirty, 'RESOURCE-1 is not dirty');

                t.notOk(event3, 'event3 not found');
                t.notOk(resource2, 'resource2 not found');

                t.ok(resource3, 'resource3 found');

                t.ok(resource3.getId(), 'Resource resource3 has Id filled');

                t.isDeeply(resource3.getEvents(eventStore), [event2], 'Event #1 has resource3 assigned');

                t.is(event2.getResourceId(), resource3.getId(), 'Event #1 has correct ResourceId');

                crud.load(next, function () { t.fail('Load failed'); });
            },

            function (next) {
                t.is(resourceStore.getCount(), 2, 'Correct number of resources loaded');
                t.is(eventStore.getCount(), 2, 'Correct number of events loaded');

                var event1          = eventStore.findRecord('Name', 'EVENT-1');
                var event2          = eventStore.findRecord('Name', 'event2');
                var resource1       = resourceStore.findRecord('Name', 'RESOURCE-1');
                var resource3       = resourceStore.findRecord('Name', 'resource3');

                t.isDeeply(resource1.getEvents(eventStore), [event1], 'Event #0 has resource1 assigned');
                t.isDeeply(resource3.getEvents(eventStore), [event2], 'Event #1 has resource3 assigned');

                next();
            }
        );
    });

    t.it('Prevents from persisiting outdated data', function (t) {

        var resourceStore2  = t.getResourceStore({
            data        : []
        });

        var eventStore2     = t.getEventStore({
            data            : [],
            resourceStore   : resourceStore2
        });

        resourceStore2.eventStore = eventStore2;

        var crud2 = Ext.create('Sch.data.CrudManager', {
            resourceStore   : { store : resourceStore2, storeId : 'resources' },
            eventStore      : { store : eventStore2, storeId : 'events' },
            transport       : {
                load    : Ext.apply({ method : 'POST' }, testConfig.load),
                sync    : Ext.apply({ method : 'POST' }, testConfig.sync)
            },
            listeners       : {
                loadfail    : function () { t.fail('Loading failed'); }
            }
        });

        t.chain(
            function (next) {
                setup(next, testConfig);
            },

            function (next) {
                crud.load(next, function () { t.fail('Load failed'); });
            },

            function (next) {
                crud2.load(next, function () { t.fail('Load failed'); });
            },

            function (next) {
                resourceStore.add([{ Name : 'resource1' }, { Name : 'resource2' }]);

                crud.sync(next, function () { t.fail('Sync failed'); });
            },

            function (next) {
                resourceStore2.add([{ Name : 'resource3' }, { Name : 'resource4' }]);

                crud2.sync(function(){ t.fail('This sync should be failed'); next(); }, function() { t.pass('Sync successfuly failed'); next(); });
            },

            function (next) {}
        );
    });
});
