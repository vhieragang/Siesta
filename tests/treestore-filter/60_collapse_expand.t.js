StartTest(function(t) {
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
                id          : 1,
                expanded    : true,
                name        : 'one foo',

                children    : [
                    {
                        id          : 2,
                        name        : 'two bar',
                        expanded    : true,

                        children    : [
                            {
                                id          : 3,
                                leaf        : true,
                                name        : 'blarg'
                            },
                            {
                                id          : 4,
                                leaf        : true,
                                name        : 'quix'
                            },
                            {
                                id          : 5,
                                leaf        : true,
                                name        : 'blarg'
                            },
                            {
                                id          : 6,
                                name        : 'quix',
                                leaf        : true
                            }
                        ]
                    }
                ]
            },
            {
                id          : 7,
                name        : 'foo quix',
                children    : []
            }
        ]
    }

    treeStore.load()

    var treePanel       = new Ext.tree.Panel({
        animate         : false,
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

    var getIdRange      = function () {
        return Ext.Array.map(treeStore.getRange(), function (node) { return node.getId() })
    }

// EOF SETUP CODE

    treeStore.filterTreeBy({
        filter          : function (node) {
            return node.get('name').match(/blarg/)
        }
    })

    t.isDeeply(getIdRange(), [ 1, 2, 3, 5 ], 'Filter applied correctly')

    id(2).collapse()

    t.isDeeply(getIdRange(), [ 1, 2 ], 'Filter applied correctly')

    id(2).expand()

    t.isDeeply(getIdRange(), [ 1, 2, 3, 5 ], 'Filter applied correctly')

    id(1).collapse()

    t.isDeeply(getIdRange(), [ 1 ], 'Filter applied correctly')

    id(1).expand()

    t.isDeeply(getIdRange(), [ 1, 2, 3, 5 ], 'Filter applied correctly')
})
