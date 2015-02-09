describe('Making sure CRUD works as expected on a TreeStore', function (t) {

    var treeStore = new Ext.data.TreeStore({
        model    : 'Sch.model.Event',
        autoLoad : false,
        autoSync : false,

        proxy : {
            type          : 'ajax',
            actionMethods : { create : "GET", read : "GET", update : "GET", destroy : "GET" },
            api           : {
                read    : 'data/tree-read.js',
                create  : 'data/tree-create.js',
                update  : 'data/tree-update.js',
                destroy : 'data/tree-delete.js'
            },
            reader        : { type : 'json' }
        },

        root : {
            expanded : true
        }
    });

    var originalData;

    t.it('Creating a record', function (t) {

        t.chain(
            { waitForStoresToLoad : [treeStore] },

            function (next) {
                t.is(treeStore.getRootNode().childNodes.length, 1, '1 top-level task')
                t.ok(!treeStore.getNodeById(4), 'No new record yet')

                treeStore.getRootNode().appendChild({
                    StartDate : new Date(2010, 1, 22),
                    EndDate   : new Date(2010, 1, 23),
                    Name      : 'New task'
                })

                t.is(treeStore.getNewRecords().length, 1, '1 records has been added')

                // can't use Ext.clone because in IE8 it also clones the non-enumerable properties like "constructor /  toString / valueOf" etc
                originalData = Ext.apply({}, treeStore.getNewRecords()[0].data);

                t.ok(originalData.isLast, 'New record is last')

                // CREATE listener
                treeStore.on('write', next, null, { single : true, delay : 50 });

                t.diag("Sync (ADD) operation started");
                treeStore.sync()
            },

            function (next, store, operation) {

                t.is(operation.action, 'create', 'Correct operation completed')
                t.is(operation.getRecords().length, 1, 'A single record will be created')

                t.ok(treeStore.getNodeById(4), 'New record appeared')

                // Id should not be part of original data, add it to be able to easily compare both objects
                originalData.Id = operation.getRecords()[0].get('Id');

                t.isDeeply(originalData, treeStore.getNodeById(4).data, 'Created task data intact');
            }
        );
    })

    t.it('Updating a record', function (t) {
        var originalData1;
        var originalData2;

        t.chain(
            function (next) {
                treeStore.getNodeById(2).setStartDate(new Date(2010, 1, 8));
                treeStore.getNodeById(3).setStartDate(new Date(2010, 1, 8));

                t.is(treeStore.getUpdatedRecords().length, 2, '2 records updated')

                // can't use Ext.clone because in IE8 it also clones the non-enumerable properties like "constructor /  toString / valueOf" etc
                originalData1 = Ext.apply({}, treeStore.getUpdatedRecords()[0].data),
                originalData2 = Ext.apply({}, treeStore.getUpdatedRecords()[1].data);

                // UPDATE listener
                treeStore.on('write', next, null, { single : true, delay : 50 });

                t.diag("Sync (UPDATE) operation started");
                treeStore.sync()
            },

            function (next, store, operation) {

                t.is(operation.action, 'update', 'Correct operation completed')
                t.is(operation.getRecords().length, 2, '2 records were updated')

                t.isDeeply(originalData1, treeStore.getNodeById(originalData1.Id).data, 'First task data intact');
                t.isDeeply(originalData2, treeStore.getNodeById(originalData2.Id).data, 'Second data intact');

            }
        );
    })

    t.it('Removing a record', function (t) {

        t.chain(
            function (next) {

                var as = t.beginAsync();

                // DESTROY listener
                treeStore.on('write', function(store, operation) {
                    t.is(operation.action, 'destroy', 'Destroy operation completed')
                    t.notOk(treeStore.getNodeById(2), 'Record no longer in store')

                    t.endAsync(as);
                }, null, { single : true, delay : 50 });

                treeStore.getNodeById(2).remove()

                treeStore.sync()
            }
        )
    })
})
