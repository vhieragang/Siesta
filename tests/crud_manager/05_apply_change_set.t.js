StartTest(function(t) {

    // Here we test applyChangeSetResponse method of Sch.crud.AbstractManager class

    t.expectGlobal('TestCrudManager1');

    Ext.define('TestCrudManager1', {
        extend  : 'Sch.crud.AbstractManager'
    });

    var someStore1, someStore2, crud, added1, added2, response;

    var initTestData = function () {

        someStore1  = new Ext.data.JsonStore({
            storeId : 'someStore1',
            fields  : ['id', 'ff1', 'ff2'],
            data    : [
                { id : 11, ff1 : '11', ff2 : '111' },
                { id : 12, ff1 : '22', ff2 : '222' },
                { id : 13, ff1 : '33', ff2 : '333' }
            ]
        });

        someStore2  = new Ext.data.TreeStore({
            storeId : 'someStore2',
            fields  : ['id', 'f1', 'f2'],
            root    : {
                expanded    : true,
                children    : [
                    { id : 1, f1 : '11', f2 : '111' },
                    { id : 2, f1 : '22', f2 : '222' },
                    { id : 3, f1 : '33', f2 : '333' },
                    { id : 4, f1 : '44', f2 : '444' }
                ]
            }
        });

        crud    = Ext.create('TestCrudManager1', {
            stores      : [ someStore1, someStore2 ]
        });

        // init stores changes
        // someStore1
        someStore1.remove(someStore1.getById(11));
        someStore1.getById(12).set('ff1', '-22');
        added1  = someStore1.add({ 'ff1' : 'new', 'ff2' : 'new' });
        // someStore2
        someStore2.getRootNode().removeChild(someStore2.getNodeById(4));
        someStore2.getNodeById(3).set('f1', '-33');
        added2  = someStore2.getNodeById(3).appendChild({ f1 : '55', f2 : '555' });

        // server response
        response = {
            someStore1  : {
                rows    : [
                    { $PhantomId : added1[0].getId(), id : 14 },
                    { id : 12, ff2 : '-222' }
                ],
                removed : [{ id : 11 }]
            },
            someStore2  : {
                rows    : [
                    { $PhantomId : added2.getId(), id : 5 },
                    { id : 3, f2 : '-333' }
                ],
                removed : [{ id : 4 }]
            }
        };
    };

    t.it('Applies changes to data', function (t) {
        initTestData();

        crud.applyChangeSetResponse(response);

        t.it('someStore1 has correct state after changes applied', function (t) {
            t.notOk(someStore1.getModifiedRecords().length, 'has no dirty updated records');
            t.notOk(someStore1.getRemovedRecords().length, 'has no dirty removed records');

            t.is(someStore1.getById(14).get('ff1'), 'new', 'added record has correct ff1 field value');
            t.is(someStore1.getById(14).get('ff2'), 'new', 'added record has correct ff2 field value');

            t.is(someStore1.getById(12).get('ff2'), '-222', 'updated record has correct ff2 field value');
        });

        t.it('someStore2 has correct state after changes applied', function (t) {
            t.notOk(someStore2.getModifiedRecords().length, 'has no dirty updated records');
            t.notOk(someStore2.getRemovedRecords().length, 'has no dirty removed records');

            t.is(someStore2.getNodeById(5).get('f1'), '55', 'added record has correct f1 field value');
            t.is(someStore2.getNodeById(5).get('f2'), '555', 'added record has correct f2 field value');

            t.is(someStore2.getNodeById(3).get('f2'), '-333', 'updated record has correct f2 field value');
        });
    });

    t.it('Applies changes to data and keeps other dirty records untouched', function (t) {

        initTestData();

        // add some more changed data
        someStore1.add({ 'ff1' : 'another new', 'ff2' : 'another new' });
        someStore1.remove(someStore1.getById(13));
        // to someStore2 as well
        someStore2.getRootNode().removeChild(someStore2.getNodeById(1));
        someStore2.getNodeById(2).set('f1', '-22');
        someStore2.getNodeById(3).appendChild({ f1 : 'new node', f2 : 'new node' });

        // but apply only response for the data modified in initTestData call
        crud.applyChangeSetResponse(response);

        t.it('someStore1 has correct state after changes applied', function (t) {
            t.is(someStore1.getModifiedRecords().length, 1, 'has one added record');
            t.is(someStore1.getRemovedRecords().length, 1, 'has one removed record');

            t.ok(someStore1.getModifiedRecords()[0].phantom, 'has one phantom record');
            t.is(someStore1.getModifiedRecords()[0].get('ff1'), 'another new', 'new record has correct ff1 value');
            t.is(someStore1.getRemovedRecords()[0].data.id, 13, 'has correct removed record');
        });

        t.it('someStore2 has correct state after changes applied', function (t) {
            t.is(someStore2.getNewRecords().length, 1, 'has 1 added record');
            t.is(someStore2.getUpdatedRecords().length, 1, 'has 1 updated record');
            t.is(someStore2.getRemovedRecords().length, 1, 'has 1 removed record');

            t.is(someStore2.getNewRecords()[0].get('f1'), 'new node', 'new record has correct f1 value');
            t.is(someStore2.getNewRecords()[0].get('f2'), 'new node', 'new record has correct f2 value');
            t.is(someStore2.getUpdatedRecords()[0].get('f1'), '-22', 'updated record has correct f1 value');
            t.is(someStore2.getRemovedRecords()[0].data.id, 1, 'has correct removed record');
        });
    });
});
