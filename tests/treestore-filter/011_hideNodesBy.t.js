StartTest(function(t) {
    // please note, that this test preloads the patch for TreeView, that allows us to use our own NodeStore instance

// SETUP CODE
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

    var treeStore

    var setup = function () {
        treeStore   = new My.TreeStore({
            proxy       : { type : 'memory', reader : { type : 'json' } },
            root        : { expanded : true, loaded : true },
            rootVisible : false
        })
    }

    var id          = function (id) { return treeStore.getNodeById(id) }
    var range       = function () { return Ext.Array.map(arguments, function (arg) { return id(arg) }) }
    var getIdRange  = function () { return Ext.Array.map(treeStore.getRange(), function (node) { return node.getId() }) }

// EOF SETUP CODE

    // in this test we'll use `hideNodesBy` to hide the 1st child of some task
    // and then we'll collapse that task - collapse is expected to work fine
    // more details in #1081
    t.it('Should allow to hide a first child of some node', function (t) {
        setup()

        treeStore.proxy.data = {
            expanded        : true,
            loaded          : true,
            children        : [
                {
                    id      : 1,
                    leaf    : true,
                    name    : 1
                },
                {
                    id          : 2,
                    name        : 2,
                    expanded    : true,

                    children    : [
                        {
                            id          : 3,
                            name        : 3,
                            expanded    : true,

                            children    : [
                                {
                                    id          : 4,
                                    leaf        : true,
                                    name        : 4
                                }
                            ]
                        },
                        {
                            id      : 5,
                            leaf    : true,
                            name    : 5
                        }
                    ]
                },
                {
                    id      : 6,
                    leaf    : true,
                    name    : 6
                }
            ]
        }

        treeStore.load()

        treeStore.hideNodesBy(function (node) {
            return node.getId() == 3
        })

        t.isDeeply(getIdRange(), [ 1, 2, 5, 6 ], 'Hiding worked as expected')

        id(2).collapse()

        t.isDeeply(getIdRange(), [ 1, 2, 6 ], 'Collapsing works after hiding')

        id(2).expand()

        t.isDeeply(getIdRange(), [ 1, 2, 5, 6 ], 'Expanding works after hiding')
    })


    // see #1110
    t.it('Should allow to hide a 2nd "parent -> single child" groups', function (t) {
        setup()

        treeStore.proxy.data = {
            expanded        : true,
            loaded          : true,
            children        : [
                {
                    id          : 1,
                    name        : 1,
                    expanded    : true,

                    children    : [
                        {
                            id          : 2,
                            leaf        : true,
                            name        : 2
                        }
                    ]
                },
                {
                    id          : 3,
                    name        : 3,
                    expanded    : true,

                    children    : [
                        {
                            id          : 4,
                            leaf        : true,
                            name        : 4
                        }
                    ]
                },
                {
                    id      : 5,
                    leaf    : true,
                    name    : 5
                },
                {
                    id      : 6,
                    leaf    : true,
                    name    : 6
                }
            ]
        }

        treeStore.load()

        t.isDeeply(getIdRange(), [ 1, 2, 3, 4, 5, 6 ], 'Hiding worked as expected')

        treeStore.hideNodesBy(function (node) {
            return node.getId() == 3 || node.getId() == 4
        })

        t.isDeeply(getIdRange(), [ 1, 2, 5, 6 ], 'Hiding worked as expected')

        id(1).collapse()

        t.isDeeply(getIdRange(), [ 1, 5, 6 ], 'Hiding worked as expected')

        id(1).expand()

        t.isDeeply(getIdRange(), [ 1, 2, 5, 6 ], 'Hiding worked as expected')
    })

    // see #1110
    t.it('Should allow to append child to a node, that has hidden "previousSibling" node', function (t) {
        setup()

        treeStore.proxy.data = {
            expanded        : true,
            loaded          : true,
            children        : [
                {
                    id          : 1,
                    name        : 1,
                    leaf        : true
                },
                {
                    id          : 2,
                    name        : 2,
                    expanded    : true,

                    children    : [
                        {
                            id          : 3,
                            leaf        : true,
                            name        : 3
                        }
                    ]
                },
                {
                    id          : 4,
                    name        : 4,
                    leaf        : true
                }
            ]
        }

        treeStore.load()

        t.isDeeply(getIdRange(), [ 1, 2, 3, 4 ], 'Hiding worked as expected')

        treeStore.hideNodesBy(function (node) {
            return node.getId() == 3
        })

        t.isDeeply(getIdRange(), [ 1, 2, 4 ], 'Hiding worked as expected')

        id(2).appendChild({
            id          : 10,
            name        : 10
        })

        t.isDeeply(getIdRange(), [ 1, 2, 10, 4 ], 'Hiding worked as expected')
    })


})
