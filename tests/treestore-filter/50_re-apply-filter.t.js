StartTest(function(t) {

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

    var treeStore, treePanel

    var setup = function () {
        treePanel && treePanel.destroy()

        treeStore   = new My.TreeStore({
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
                                    name        : 'foobar',
                                    expanded    : true,

                                    children    : [
                                        {
                                            id          : 5,
                                            leaf        : true,
                                            name        : 'blarg'
                                        }
                                    ]
                                }
                                // eof 4
                            ]
                        },
                        // eof 3
                        {
                            id          : 6,
                            name        : 'blart',
                            leaf        : true
                        }
                    ]
                },
                {
                    id          : 7,
                    expanded    : true,
                    name        : 'foo quix',
                    children    : []
                }
            ]
        }

        treeStore.load()

        treePanel       = new Ext.tree.Panel({
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
    }

    var id          = function (id) { return treeStore.getNodeById(id) }
    var getIdRange  = function () {
        return Ext.Array.map(treeStore.getRange(), function (node) { return node.getId() })
    }

    t.it("Should re-apply the filter, when adding new nodes with `appendChild/insertChild`", function (t) {
        setup()

        treeStore.filterTreeBy({
            filter          : function (node) {
                return node.get('name').match(/foo/)
            }
        })

        t.isDeeply(getIdRange(), [ 1 ], 'Filter applied correctly')


        treeStore.getRootNode().appendChild([
            {
                id      : 'new1',
                name    : 'foo',
                leaf    : true
            },
            {
                id      : 'new11',
                name    : 'bar',
                leaf    : true
            }
        ])

        t.isDeeply(getIdRange(), [ 1, 'new1' ], 'Filter applied correctly')

        treeStore.getRootNode().insertChild(0, {
            id      : 'new111',
            name    : 'foo',
            leaf    : true
        })

        t.isDeeply(getIdRange(), [ 'new111', 1, 'new1' ], 'Filter applied correctly')

        id(7).appendChild([
            {
                id      : 'new71',
                name    : 'bar',
                leaf    : true
            },
            {
                id      : 'new71',
                name    : 'foo',
                leaf    : true
            }
        ])

        t.isDeeply(getIdRange(), [ 'new111', 1, 7, 'new71', 'new1' ], 'Filter applied correctly')
    })


    t.it("Should re-apply filter after loading new dataset", function (t) {
        setup()

        var scopeFilter = {}, scopeHide = {}

        treeStore.filterTreeBy({
            filter          : function (node) {
                if (this != scopeFilter) t.fail("Wrong scope for filter method")

                return node.get('name').match(/foo/)
            },
            scope           : scopeFilter
        })

        treeStore.proxy.data = {
            expanded        : true,
            loaded          : true,
            children        : [
                {
                    id      : 'new2',
                    leaf    : true,
                    name    : 'foo'
                },
                {
                    id      : 'new21',
                    leaf    : true,
                    name    : 'baz'
                },
                {
                    id      : 'new3',
                    leaf    : true,
                    name    : 'foo2'
                },
                {
                    id      : 'new4',
                    leaf    : true,
                    name    : 'hidden'
                }
            ]
        }

        t.firesOk({
            observable      : treePanel.getView(),
            events          : { refresh : '<=3' },
            during          : function () {
                treeStore.load()
            },

            desc            : '3 refresh events should be fired when re-loading the tree store - 1 for ExtJS "removeAll"' +
                ' 1 for our override which fires "clear" event on the treeStore and 1 for fresh data'
        })

        t.isDeeply(getIdRange(), [ 'new2', 'new3' ], 'Filter applied correctly')
    })
})
