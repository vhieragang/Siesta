StartTest(function(t) {
    t.diag('TreeStore throws exception in IE when loading & parsing nested data in Ext 4.0.x');
    // TODO, in progress
    if (Ext.isIE) return;

    function test() {
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
    
        var as = t.beginAsync();
        store.on('load', function() {
            t.pass('store loaded without exception');
            t.endAsync(as);
        }, null, { single : true });

        store.load();
    }

    function applyPatch(callback) {
        Ext.Loader.setConfig({ 
            enabled : true, 
            disableCaching : true,
            paths : { Sch : '../js/Sch' }
        });

        t.diag('Patch applied');
        patched = true;
        t.requireOk('Sch.patches.TreeStoreIE', callback);
    }

    applyPatch(test);
});
