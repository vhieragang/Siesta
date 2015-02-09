StartTest(function(t) {

    // Here we test getChangeSetPackage method of Sch.crud.AbstractManager class

    t.expectGlobal('TestCrudManager1', 'TestModel');

    Ext.define('TestModel', {
        extend  : 'Ext.data.Model',

        f3Store : null,

        fields  : ['id', 'f1', 'f2', 'f3'],

        constructor : function (config) {
            if (config.f3) {
                this.f3Store    = config.f3;

                config.f3       = null;//this.f3Store.getRange();
            }
            this.callParent([ config ]);
        },

        get : function (field) {
            if ('f3' == field) return this.f3Store;

            return this.callParent(arguments);
        }
    });

    var resourceStore   = t.getResourceStore(),
        someStore       = new Ext.data.JsonStore({
            model   : 'TestModel',
            data    : [
                { id : 1, f1 : '11', f2 : '111' },
                { id : 2, f1 : '22', f2 : '222' },
                { id : 3, f1 : '33', f2 : '333' },
                { id : 4, f1 : '44', f2 : '444' }
            ]
        }),
        someSubStore    = new Ext.data.JsonStore({
            fields  : ['id', 'ff1', 'ff2'],
            data    : [
                { id : 1, ff1 : '11', ff2 : '111' },
                { id : 2, ff1 : '22', ff2 : '222' },
                { id : 3, ff1 : '33', ff2 : '333' },
                { id : 4, ff1 : '44', ff2 : '444' }
            ]
        });


    Ext.define('TestCrudManager1', {
        extend      : 'Sch.crud.AbstractManager'
    });

    var crud    = Ext.create('TestCrudManager1', {
        stores      : [
            { store : resourceStore, storeId : 'resources' },
            { store : someStore, storeId : 'something', stores : [{ storeId : 'f3' }] }
        ],
        revision    : 1
    });

    t.it('Change set package for not modified data is null', function (t) {
        var pack = crud.getChangeSetPackage();

        t.notOk(pack, 'No changes yet');
    });

    t.it('Change set package for modified data', function (t) {

        resourceStore.getById('r1').set('Name', 'Some Name');
        resourceStore.getById('r3').set('Name', 'Some Other Name');

        resourceStore.remove(resourceStore.getById('r2'));
        resourceStore.remove(resourceStore.getById('r4'));

        var newResource = resourceStore.add({ Name : 'New Resource' });

        someStore.getById(1).set('f1', '-11');
        someStore.getById(2).set('f2', '-222');

        someStore.remove(someStore.getById(3));
        someStore.remove(someStore.getById(4));

        // add record having embedded store
        var newRec = someStore.add({ f1 : '55', f2 : '555', f3: someSubStore });

        // add record to the embedded store
        var newSubRec   = someSubStore.add({ ff1 : 'xx', ff2 : 'xxx' });
        // edit record in the embedded store
        someSubStore.getById(1).set('ff1', '!11');
        // remove record from the embedded store
        someSubStore.remove(someSubStore.getById(4));

        var pack = crud.getChangeSetPackage();

        t.is(pack.type, 'sync', 'Correct package type');
        t.ok(pack.requestId, 'Has some request Id');
        t.ok(pack.revision, 'Has some revision');

        t.isDeeply(pack.resources.added, [{ Name : 'New Resource', '$PhantomId' : newResource[0].getId() }], 'Correct list of added records');
        t.isDeeply(pack.resources.updated, [{ Id : 'r1', Name : 'Some Name' }, { Id : 'r3', Name : 'Some Other Name' }], 'Correct list of updated records');
        t.isDeeply(pack.resources.removed, [{ Id : 'r2' }, { Id : 'r4' }], 'Correct list of removed records');

        t.isDeeply(pack.something.added, [{ f1 : '55', f2 : '555', '$PhantomId' : newRec[0].getId(),
            // embedded store changes
            f3: {
                '$store'    : true,
                added       : [{ ff1 : 'xx', ff2 : 'xxx', '$PhantomId' : newSubRec[0].getId() }],
                updated     : [{ id : 1, ff1 : '!11' }],
                removed     : [{ id : 4 }]
            }
        }], 'Correct list of added records (including embedded store changes)');
        t.isDeeply(pack.something.updated, [{ id : 1, f1 : '-11' }, { id : 2, f2 : '-222' }], 'Correct list of updated records');
        t.isDeeply(pack.something.removed, [{ id : 3 }, { id : 4 }], 'Correct list of removed records');
    });
});
