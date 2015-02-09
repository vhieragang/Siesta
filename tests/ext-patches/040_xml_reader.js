StartTest(function(t) {
    t.diag('XML reader cannot handle nested XML data in Ext 4.0.x');
    
    // TODO, in progress
    if (Ext.isIE) return;

    var patched = false;
    t.diag('No patch applied');

    var store = Ext.create('Ext.data.TreeStore', {
        proxy: {
            type: 'ajax',
            url: 'ext-patches/data/040_data.xml',
            reader: {
                type: 'xml',
                root: 'nodes',
                record: 'node'
            }
        },
        root : {
            loaded : true,
            expanded : true
        }
    });

    function test(callback) {
    
        var as = t.beginAsync();
        store.on('load', function() {
            if (!patched) {
                t.knownBugIn("4.1.0", function(t) {
                    t.is(store.getRootNode().childNodes.length, 1, 'One child of root node');
                });
            } else {
                t.is(store.getRootNode().childNodes.length, 1, 'One child of root node');
            }
            t.endAsync(as);

            store.getRootNode().removeAll();
            callback && callback();
        }, null, { single : true });

        store.load();
    }

    function applyPatch(callback) {
        Ext.Loader.setConfig({ 
            enabled : true, 
            disableCaching : true,
            paths : { Sch : '../js/Sch' }
        });

        t.requireOk(['Sch.patches.TreeStoreIE', 'Sch.patches.XmlReader'], callback);
        t.diag('Patch applied');
        patched = true;
    }

    t.willFireNTimes(store, 'load', 2);
    test(function() { applyPatch(test); });
});
