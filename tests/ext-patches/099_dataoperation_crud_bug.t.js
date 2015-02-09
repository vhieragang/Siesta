StartTest(function(t) {
    
    Ext.define('Task', {
        extend: 'Ext.data.Model',
        idProperty : 'Id',
        fields: [
            {name: 'Id',        type: 'int'}
        ]
    });

    var store = Ext.create('Ext.data.TreeStore', {
        model: 'Task',
        proxy       : {
            type    : 'ajax',
            
            api     : {
                create  : 'data/crud_bug/create-tasks.aspx',
                read    : 'data/crud_bug/get-tasks.aspx',
                update  : 'data/crud_bug/update-tasks.aspx'
            },
            reader  : {
                type    : 'json'
            }
        }
    });

    t.loadStoresAndThen(store, function () {
        var model = store.model,
            parent1 = new model(),
            parent2 = new model();

        // http://www.sencha.com/forum/showthread.php?208602-Model-s-Id-field-not-defined-after-sync-in-TreeStore-%28CRUD%29&p=811565#post811565
        store.on('write', function(store, dataObj){
            var records = dataObj.records;
            t.knownBugIn('4.1.0', function(t) {
                t.is(records[0].data.Id, 15, 'Id field for record is defined and has some value when writing');
                t.is(records[1].data.Id, 16, 'Id field for record is defined and has some value when writing');
                
                t.is(store.getById(15).data.parentId, 0, 'parentId is exactly 0 for new root level node');
                t.is(store.getById(16).data.parentId, 0, 'parentId is exactly 0 for new root level node');
            }, 'TreeStore crud issue, Id not populated after create, nodeHash not updated');

            if (store.getById(16) && store.getById(16).data.parentId === null) {
                t.fail('REMOVE THIS ASSERTION + getId override method in Gnt.model.Task');
            }
        });

        store.suspendAutoSync();
        store.getRootNode().appendChild(parent1);
        store.getRootNode().appendChild(parent2);
        store.resumeAutoSync();
        store.sync();
    })
});