StartTest(function(t) {

    //======================================================================================================================================================================================================================================================
    t.diag('Sanity')

    t.expectGlobal('My')



    Ext.define('My.Model', {
        extend      : 'Ext.data.Model',

        idProperty  : 'id',
        fields      : [ 'id', 'name' ]
    })


    Ext.define('My.TreeStore', {
        extend      : 'Ext.data.TreeStore',

        model       : 'My.Model',

        mixins      : [
            'Sch.data.mixin.FilterableTreeStore'
        ],

        constructor : function () {
            this.callParent(arguments)

            this.initTreeFiltering()
        }
    })


    Ext.define('My.TreeView', {
        extend      : 'Ext.tree.View',

        alias       : 'widget.filtered-view',

        mixins      : [
            'Sch.mixin.FilterableTreeView'
        ],

        constructor : function () {
            this.callParent(arguments)

            this.initTreeFiltering()
        }
    })


    var treeStore = new My.TreeStore({
        proxy       : { type : 'memory', reader : { type : 'json' } },
        root        : { expanded : true, loaded : true },
        rootVisible : false
    })

    treeStore.proxy.data = {
        expanded        : true,
        loaded          : true,
        children        : [
            {
                id      : 1,
                leaf    : true,
                name    : 'one foo'
            },
            {
                id          : 2,
                name        : 'two bar',
                expanded    : true,

                children    : [
                    {
                        id          : 3,
                        name        : 'foo',
                        expanded    : true,

                        children    : [
                            {
                                id          : 4,
                                leaf        : true,
                                name        : 'yo yo yo'
                            }
                        ]
                    }
                ]
            },
            {
                id      : 5,
                leaf    : true,
                name    : 'yo'
            },
            {
                id          : 6,
                name        : 'foo quix',
                children    : []
            }
        ]
    }

    treeStore.load()


    var treePanel       = new Ext.tree.Panel({
        store           : treeStore,

        viewType        : 'filtered-view',

        columns         : [
            {
                xtype       : 'treecolumn',
                dataIndex   : 'id'
            },
            {
                dataIndex   : 'name'
            }
        ],

        rootVisible     : false,
        width           : 800,
        height          : 600,
        renderTo        : Ext.getBody()
    })

    var id = function (id) { return treeStore.getNodeById(id) }


    // filtering, with "checkParents". Should include the node 2, since its child node 3 matches the filter

    treeStore.filterTreeBy({
        filter          : function (node) {
            return (node.get('name') || '').match(/foo/)
        },
        checkParents    : true
    })

    t.isDeeply(treeStore.getRange(), [ id(1), id(2), id(3), id(6) ], 'Only matching nodes and their parents left in view after filtering')

    // filtering, with "checkParents" and "shallowScan". Should not include the nodes 2 and 3, since 2 does not match
    // and filter should not recurse after finding non-matching parent

    treeStore.filterTreeBy({
        filter          : function (node) {
            return (node.get('name') || '').match(/foo/)
        },
        checkParents    : true,
        shallow         : true
    })

    t.isDeeply(treeStore.getRange(), [ id(1), id(6) ], 'Only matching nodes and their parents left in view after filtering')

    t.is(treePanel.getView().getNodes().length, 2, '2 nodes are visible in the view')
})
