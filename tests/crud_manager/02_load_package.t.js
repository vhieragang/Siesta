StartTest(function(t) {

    // Here we test getLoadPackage method of Sch.crud.AbstractManager class

    t.expectGlobal('TestCrudManager1');

    var resourceStore   = t.getResourceStore(),
        eventStore      = t.getEventStore();

    Ext.define('TestCrudManager1', {
        extend      : 'Sch.crud.AbstractManager'
    });

    var crud    = Ext.create('TestCrudManager1', {
        stores      : [
            { store : resourceStore, storeId : 'resources' },
            { store : eventStore, storeId : 'events' }
        ]
    });

    t.it('Generates load package correctly', function (t) {
        var pack = crud.getLoadPackage();

        t.is(pack.type, 'load', 'Correct package type');
        t.ok(pack.requestId, 'Has some request Id');
        t.is(pack.stores.length, 2, 'Correct size of stores list');
        t.is(pack.stores[0].storeId, 'resources', '0th storeId is correct');
        t.is(pack.stores[0].page, 1, '0th page is correct');
        t.is(pack.stores[0].pageSize, 25, '0th pageSize is correct');

        t.is(pack.stores[1].storeId, 'events', '0th storeId is correct');
        t.is(pack.stores[1].page, 1, '0th page is correct');
        t.is(pack.stores[1].pageSize, 25, '0th pageSize is correct');
    });

});
