StartTest(function(t) {

    // Here we test addStore method of Sch.crud.AbstractManager class

    t.expectGlobal('TestCrudManager1');

    var resourceStore   = t.getResourceStore(),
        eventStore      = t.getEventStore();

    Ext.define('TestCrudManager1', {
        extend      : 'Sch.crud.AbstractManager'
    });

    var crud;

    t.it('Constructor accepts stores list', function (t) {

        crud    = Ext.create('TestCrudManager1', {
            stores      : [
                { store : resourceStore, storeId : 'resources' },
                { store : eventStore, storeId : 'events' }
            ]
        });

        t.is(crud.stores.length, 2, 'Stores array has correct number of elements');
        t.is(crud.stores[0].storeId, 'resources', '0th has correct storeId');
        t.ok(crud.stores[0].store === resourceStore, '0th has correct store');

        t.is(crud.stores[1].storeId, 'events', '1st has correct storeId');
        t.ok(crud.stores[1].store === eventStore, '1st has correct store');
    });

    t.it('addStores appends singular store', function (t) {

        var newStore = new Ext.data.JsonStore({
            fields  : ['f1', 'f2'],
            storeId : 'smth1'
        });

        crud.addStore(newStore);

        t.is(crud.stores.length, 3, 'Stores array has correct number of elements');
        t.is(crud.stores[2].storeId, 'smth1', '2nd has correct storeId');
        t.ok(crud.stores[2].store === newStore, '2nd has correct store');

    });

    t.it('addStores appends multiple stores', function (t) {

        var newStore1 = new Ext.data.JsonStore({
            fields  : ['f1', 'f2'],
            storeId : 'smth2'
        });

        var newStore2 = new Ext.data.JsonStore({
            fields  : ['f1', 'f2'],
            storeId : 'smth3'
        });

        crud.addStore([ newStore1, newStore2 ]);

        t.is(crud.stores.length, 5, 'Stores array has correct number of elements');
        t.is(crud.stores[3].storeId, 'smth2', '2nd has correct storeId');
        t.ok(crud.stores[3].store === newStore1, '2nd has correct store');
        t.is(crud.stores[4].storeId, 'smth3', '2nd has correct storeId');
        t.ok(crud.stores[4].store === newStore2, '2nd has correct store');

    });

    t.it('addStores inserts singular store', function (t) {

        var newStore = new Ext.data.JsonStore({
            fields  : ['f1', 'f2'],
            storeId : 'smth4'
        });

        crud.addStore(newStore, 0);

        t.is(crud.stores.length, 6, 'Stores array has correct number of elements');
        t.is(crud.stores[0].storeId, 'smth4', '0th has correct storeId');
        t.ok(crud.stores[0].store === newStore, '0th has correct store');

    });

    t.it('addStores inserts multiple stores', function (t) {

        var newStore1 = new Ext.data.JsonStore({
            fields  : ['f1', 'f2'],
            storeId : 'smth5'
        });

        var newStore2 = new Ext.data.JsonStore({
            fields  : ['f1', 'f2'],
            storeId : 'smth6'
        });

        crud.addStore([ newStore1, newStore2 ], 0);

        t.is(crud.stores.length, 8, 'Stores array has correct number of elements');
        t.is(crud.stores[0].storeId, 'smth5', '0th has correct storeId');
        t.ok(crud.stores[0].store === newStore1, '0th has correct store');
        t.is(crud.stores[1].storeId, 'smth6', '1st has correct storeId');
        t.ok(crud.stores[1].store === newStore2, '1st has correct store');

    });

    t.it('addStores inserts singular store -2 elements before specified store', function (t) {

        var newStore = new Ext.data.JsonStore({
            fields  : ['f1', 'f2'],
            storeId : 'smth7'
        });

        crud.addStore(newStore, -2, crud.getStore('smth3'));

        t.is(crud.stores.length, 9, 'Stores array has correct number of elements');
        t.is(crud.stores[5].storeId, 'smth7', '5th has correct storeId');
        t.ok(crud.stores[5].store === newStore, '5th has correct store');

    });

    t.it('addStores inserts multiple stores -2 elements before specified store', function (t) {

        var newStore1 = new Ext.data.JsonStore({
            fields  : ['f1', 'f2'],
            storeId : 'smth8'
        });

        var newStore2 = new Ext.data.JsonStore({
            fields  : ['f1', 'f2'],
            storeId : 'smth9'
        });

        crud.addStore([ newStore1, newStore2 ], -2, crud.getStore('smth3'));

        t.is(crud.stores.length, 11, 'Stores array has correct number of elements');
        t.is(crud.stores[6].storeId, 'smth8', '6th has correct storeId');
        t.ok(crud.stores[6].store === newStore1, '6th has correct store');
        t.is(crud.stores[7].storeId, 'smth9', '7th has correct storeId');
        t.ok(crud.stores[7].store === newStore2, '7th has correct store');

        t.it('removeStore correctly removes stores', function (t) {

            crud.removeStore('smth8');

            crud.removeStore(newStore2);

            crud.removeStore(crud.getStore('smth3'));

            t.is(crud.stores.length, 8, 'Stores array has correct number of elements');

            t.notOk(crud.getStore('smth3'), 'No smth3 store registered');
            t.notOk(crud.getStore('smth8'), 'No smth8 store registered');
            t.notOk(crud.getStore('smth9'), 'No smth9 store registered');
        });
    });

    t.it('Constructor accepts sub-stores list', function (t) {

        var newStore = new Ext.data.JsonStore({
            fields  : ['f1', 'f2'],
            storeId : 'smth'
        });

        var subStore = new Ext.data.JsonStore({
            fields  : ['ff1', 'ff2']
        });

        crud    = Ext.create('TestCrudManager1', {
            stores      : [
                { store : resourceStore, storeId : 'resources' },
                { store : eventStore, storeId : 'events' },
                {
                    store   : newStore,
                    stores  : [
                        { storeId : 'f1', store : subStore }
                    ]
                }
            ]
        });

        t.is(crud.stores.length, 3, 'Stores array has correct number of elements');
        t.is(crud.stores[0].storeId, 'resources', '0th has correct storeId');
        t.ok(crud.stores[0].store === resourceStore, '0th has correct store');

        t.is(crud.stores[1].storeId, 'events', '1st has correct storeId');
        t.ok(crud.stores[1].store === eventStore, '1st has correct store');

        t.is(crud.stores[2].storeId, 'smth', '2nd has correct storeId');
        t.ok(crud.stores[2].store === newStore, '2nd has correct store');
        t.isDeeply(crud.getStore(newStore).stores, [{ storeId : 'f1', store : subStore }], '2nd has substores list');
    });

    t.it('syncApplySequence config adds stores to alternative sync sequence', function (t) {

        crud    = Ext.create('TestCrudManager1', {
            stores      : [
                { store : resourceStore, storeId : 'resources' },
                { store : eventStore, storeId : 'events' }
            ],
            syncApplySequence : ['events', 'resources']
        });

        t.is(crud.syncApplySequence.length, 2, 'Stores array has correct number of elements');
        t.is(crud.syncApplySequence[0].storeId, 'events', '0th has correct storeId');
        t.is(crud.syncApplySequence[1].storeId, 'resources', '1st has correct storeId');

    });

    t.it('addStoreToApplySequence inserts singular store', function (t) {

        crud    = Ext.create('TestCrudManager1', {
            stores      : [
                { store : resourceStore, storeId : 'resources' },
                { store : eventStore, storeId : 'events' }
            ]
        });

        var newStore = new Ext.data.JsonStore({
            fields  : ['f1', 'f2'],
            storeId : 'smth4'
        });

        crud.addStoreToApplySequence(crud.stores);

        crud.addStore(newStore, 0);

        crud.addStoreToApplySequence(newStore, 1);

        t.is(crud.syncApplySequence.length, 3, 'Stores array has correct number of elements');
        t.is(crud.syncApplySequence[0].storeId, 'resources', '0th has correct storeId');
        t.is(crud.syncApplySequence[1].storeId, 'smth4', '1st has correct storeId');
        t.is(crud.syncApplySequence[2].storeId, 'events', '2nd has correct storeId');

        t.it('removeStore removes store from both arrays', function (t) {
            crud.removeStore('smth4');

            t.is(crud.stores.length, 2, 'Stores array has correct number of elements');
            t.is(crud.stores[0].storeId, 'resources', '0th has correct storeId');
            t.is(crud.stores[1].storeId, 'events', '1st has correct storeId');

            t.is(crud.syncApplySequence.length, 2, 'Stores array has correct number of elements');
            t.is(crud.syncApplySequence[0].storeId, 'resources', '0th has correct storeId');
            t.is(crud.syncApplySequence[1].storeId, 'events', '1st has correct storeId');
        });

    });

    t.it('addStoreToApplySequence inserts singular store (position relative to existing store)', function (t) {

        crud    = Ext.create('TestCrudManager1', {
            stores      : [
                { store : resourceStore, storeId : 'resources' },
                { store : eventStore, storeId : 'events' }
            ]
        });

        var newStore = new Ext.data.JsonStore({
            fields  : ['f1', 'f2'],
            storeId : 'smth4'
        });

        crud.addStoreToApplySequence(crud.stores);

        crud.addStore(newStore, 0);

        crud.addStoreToApplySequence(newStore, 1, crud.getStore('resources'));

        t.is(crud.syncApplySequence.length, 3, 'Stores array has correct number of elements');
        t.is(crud.syncApplySequence[0].storeId, 'resources', '0th has correct storeId');
        t.is(crud.syncApplySequence[1].storeId, 'smth4', '1st has correct storeId');
        t.is(crud.syncApplySequence[2].storeId, 'events', '2nd has correct storeId');

        t.it('removeStoreFromApplySequence removes store', function (t) {
            crud.removeStoreFromApplySequence('smth4');

            t.is(crud.syncApplySequence.length, 2, 'Stores array has correct number of elements');
            t.is(crud.syncApplySequence[0].storeId, 'resources', '0th has correct storeId');
            t.is(crud.syncApplySequence[1].storeId, 'events', '1st has correct storeId');
        });

    });

});
