StartTest(function(t) {
    t.diag('Nodes in a TreeStore are not bound to any store(s) unless their parent is expanded');
    t.diag('This has the side effect that update events will not fire from the treestore unless the node is visible');
    
    Ext.define('Task', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'Name',     type: 'string'}
        ]
    });

    var store = Ext.create("Ext.data.TreeStore", {
            
        proxy       : {
            type    : 'memory',
            reader  : {
                type    : 'json'
            }
        },
            
        root        : {
            expanded    : true,
                
            children    : [
                {
                    Id          : 123,
                    Name        : 'asf',
                    children    : [
                        {
                            Id          : 2,
                            Name        : 'asvsav',
                            leaf        : true
                        }
                    ]
                }
            ]
        }
    });
    

    Ext.create('Ext.tree.Panel', {
        width: 500,
        height: 300,
        animate : false,
        rootVisible: false,
        renderTo : document.body,
        store: store,
        columns: [{
            xtype: 'treecolumn', //this is so we know which column will show the tree
            text: 'Task',
            flex: 2,
            dataIndex: 'Name'
        }]
    });

    var child = store.getRootNode().firstChild.firstChild;
    
    t.knownBugIn('4.2.0', function(t) {
        t.willFireNTimes(store, 'update', 2);
    
        child.set('name', 'foo');
        t.isGreater(child.stores.length, 0, 'Model should be bound to a store');
    });

    // Disregard any update events triggered by the expand operation
    store.suspendEvents();
    store.getRootNode().firstChild.expand();
    store.resumeEvents();

    child.set('name', 'bacon');
});
