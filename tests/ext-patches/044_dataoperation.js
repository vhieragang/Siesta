StartTest(function(t) {
    var originalData, patched, treeStore;

    t.expectGlobal('TestModel');
    Ext.define('TestModel', {
        extend : 'Ext.data.Model',
        idProperty : 'Id',
        fields : ['Id']
    });

    var steps = [
        function(next) {
            treeStore = new Ext.data.TreeStore({
                autoLoad : false,
                autoSync : false,
                model : 'TestModel',
                proxy       : {
                    type            : 'ajax',
                    actionMethods   : { create: "GET", read: "GET", update: "GET", destroy: "GET" }, 
                    api             : { 
                        read    : 'data/tree-read.js', 
                        create  : 'data/tree-create.js', 
                        update  : 'data/tree-update.js', 
                        destroy : 'data/tree-delete.js' 
                    },
                    reader          : { type    : 'json' }
                },
        
                root        : {
                    expanded    : true
                }
            });

            t.waitForStoresToLoad(treeStore, next);
        },
        
        function (next) {
            t.is(treeStore.getRootNode().childNodes.length,  1, '1 top-level task')
            t.ok(!treeStore.getNodeById(4), 'No new record yet')
        
            treeStore.getRootNode().appendChild({
                StartDate       : new Date(2010,1,22),
                EndDate         : new Date(2010,1,23),
                Name            : 'New task'
            })
        
            t.is(treeStore.getNewRecords().length, 1, '1 records has been added')
        
            // can't use Ext.clone because in IE8 it also clones the non-enumerable properties like "constructor /  toString / valueOf" etc
            originalData = Ext.apply({}, treeStore.getNewRecords()[0].data);
        
            t.ok(originalData.isLast, 'New record is last')
        
            // CREATE listener
            treeStore.on('write', next, null, { single : true });
            
            t.diag("Sync (ADD) operation started");
            treeStore.sync()
        },

        function (next, store, operation) {
            if (patched){
                t.ok(treeStore.getNodeById(4), 'New record appeared')
            } else {
                t.knownBugIn('4.1.0', function(t) {
                    t.ok(treeStore.getNodeById(4), 'New record appeared')
                });
                Ext.Loader.setConfig({ 
                    enabled : true, 
                    disableCaching : true,
                    paths : { Sch : '../js/Sch' }
                });

                t.requireOk(['Sch.patches.DataOperation', 'Sch.patches.TreeStore'], function() {
                    t.diag('Patch applied');
                    patched = true;
                    t.chain.apply(t, steps)
                });
            }
        }
    ];
    t.chain.apply(t, steps)
})    
