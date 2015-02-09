StartTest(function(t) {
    // please note, that this test preloads the patch for TreeView, that allows us to use our own NodeStore instance

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
                name        : 'two foo',
                expanded    : true,

                children    : [
                    {
                        id          : 3,
                        name        : 'yo yo',
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
                name    : 'yo foo'
            },
            {
                id      : 6,
                leaf    : true,
                name    : 'foo quix'
            }
        ]
    }

    treeStore.load()

    var treePanel       = new Ext.tree.Panel({
        store           : treeStore,
        rootVisible     : false,
        bufferedRenderer: false,

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

        width           : 800,
        height          : 600,
        renderTo        : Ext.getBody()
    })

    t.isaOk(treePanel.getView(), My.TreeView, "Correct class for view")

    var id = function (id) { return treeStore.getNodeById(id) }


    t.notOk(treeStore.isTreeFiltered(), "Tree store is not filtered")

    // filtering

    t.firesOk({
        observable      : treePanel.getView(),
        events          : { refresh : 1 },
        during          : function () {
            var view = treePanel.getView()
            treeStore.filterTreeBy(function (node) {
                return node.get('name').match(/yo/)
            })
        },

        desc            : 'Only 1 refresh event should be fired when filtering the tree store'
    })

    t.ok(treeStore.isTreeFiltered(), "Tree store is now filtered")

    t.isDeeply(treeStore.getRange(), [ id(2), id(3), id(4), id(5) ], 'Only matching nodes and their parents left in view after filtering')

    t.is(treePanel.getView().getNodes().length, 4, 'View was updated as well')

    // clearing filter, should restore original state

    treeStore.clearTreeFilter()

    t.notOk(treeStore.isTreeFiltered(), "Tree store is not filtered again")

    t.isDeeply(treeStore.getRange(), [ id(1), id(2), id(3), id(4), id(5), id(6) ], 'Clearing filter restored all nodes')

    t.is(treePanel.getView().getNodes().length, 6, 'View was updated as well')


    // hiding some nodes

    treeStore.hideNodesBy(function (node) {
        return node.getId() == 3
    })

    t.isDeeply(treeStore.getRange(), [ id(1), id(2), id(5), id(6) ], '`hideNodesBy` should hide node 3 and its child node 4')

    t.is(treePanel.getView().getNodes().length, 4, 'Should remain only 4 nodes in view')

    // show all nodes again

    treeStore.showAllNodes()

    t.isDeeply(treeStore.getRange(), [ id(1), id(2), id(3), id(4), id(5), id(6) ], 'Clearing filter restored all nodes')

    t.is(treePanel.getView().getNodes().length, 6, 'View was updated as well')

    // now trying first to hide some nodes and then filter - effects should combine

    treeStore.hideNodesBy(function (node) {
        return node.getId() == 3
    })

    treeStore.filterTreeBy({
        filter     : function (node) {
            return node.get('name').match(/yo/)
        }
    })

    t.isDeeply(treeStore.getRange(), [ id(5) ], 'Hiding + filtering works, different arguments format also works')

    t.is(treePanel.getView().getNodes().length, 1, 'View was updated as well')

    // now clearing filter, hidden nodes should remain hidden

    treeStore.clearTreeFilter()

    t.isDeeply(treeStore.getRange(), [ id(1), id(2), id(5), id(6) ], '`hideNodesBy` should hide node 3 and its child node 4')

    t.is(treePanel.getView().getNodes().length, 4, 'Should remain only 4 nodes in view')

    // now restoring

    treeStore.showAllNodes()

    t.isDeeply(treeStore.getRange(), [ id(1), id(2), id(3), id(4), id(5), id(6) ], '`showAllNodes` showed all nodes')
})
