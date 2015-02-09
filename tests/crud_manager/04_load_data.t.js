StartTest(function(t) {

    // Here we test loadData method of Sch.crud.AbstractManager class

    t.expectGlobal('TestCrudManager1', 'TestModel');

    Ext.define('TestModel', {
        extend  : 'Ext.data.Model',

        f3Store : null,

        fields  : ['id', 'f1', 'f2', 'f3'],

        constructor : function (config) {
            this.callParent(arguments);

            if (this.data.f3) {
                this.f3Store    = this.data.f3;
            }
        },

        get : function (field) {
            if ('f3' == field) {
                if (!this.f3Store) {
                    this.f3Store  = new Ext.data.JsonStore({
                        fields  : ['id', 'a', 'b']
                    });
                }

                return this.f3Store;
            }

            return this.callParent(arguments);
        },

        set : function (field, value) {
            if ('f3' == field) {
                this.f3Store    = value;
                return;
            }

            return this.callParent(arguments);
        }
    });

    var loaded      = 0,
        someStore1  = new Ext.data.JsonStore({
            fields  : ['id', 'ff1', 'ff2']
        }),
        someStore2  = new Ext.data.JsonStore({
            model  : 'TestModel'
        });

    Ext.define('TestCrudManager1', {
        extend      : 'Sch.crud.AbstractManager'
    });

    var crud    = Ext.create('TestCrudManager1', {
        stores      : [
            { store : someStore1, storeId : 'someStore1' },
            { store : someStore2, storeId : 'someStore2', stores : 'f3' }
        ]
    });

    t.it('Loads stores by batch in a proper order', function (t) {

        someStore1.on('datachanged', function () {
            t.is(loaded++, 0, 'someStore1 loaded first');
        }, this, { single : true });

        someStore2.on('datachanged', function () {
            t.is(loaded, 1, 'someStore2 loaded second');
        }, this, { single : true });

        crud.loadData({
            someStore1 : {
                rows : [
                    { id : 11, ff1 : '11', ff2 : '111' },
                    { id : 12, ff1 : '22', ff2 : '222' }
                ]
            },
            someStore2 : {
                rows : [
                    { id : 1, f1 : '11', f2 : '111' },
                    { id : 2, f1 : '22', f2 : '222',
                        f3 : {
                            rows : [
                                { id : 21, a : 'a', b : 'b' },
                                { id : 22, a : 'aa', b : 'bb' }
                            ]
                        }
                    },
                    { id : 3, f1 : '33', f2 : '333' },
                    { id : 4, f1 : '44', f2 : '444' }
                ]
            }
        });

        t.is(someStore1.getCount(), 2, 'someStore1 loaded');
        t.is(someStore2.getCount(), 4, 'someStore2 loaded');
        t.is(someStore2.getById(2).get('f3').getCount(), 2, 'someStore2 sub-store loaded');
        t.isDeeply(someStore2.getById(2).get('f3').getById(21).data, { id : 21, a : 'a', b : 'b' }, 'someStore2 sub-store has correct record #21');
        t.isDeeply(someStore2.getById(2).get('f3').getById(22).data, { id : 22, a : 'aa', b : 'bb' }, 'someStore2 sub-store has correct record #22');
    });

    t.it('Supports empty dataset loading', function (t) {

        var store1  = new Ext.data.TreeStore({
            fields  : [ 'id' ],
            storeId : 'store1',
            root    : {
                expanded : true,
                children : [
                    { id : 1, leaf : true },
                    { id : 2, leaf : true },
                    { id : 3, leaf : true }
                ]
            }
        });

        var store2  = new Ext.data.JsonStore({
            fields  : [ 'id' ],
            storeId : 'store2',
            data    : [
                { id : 1 },
                { id : 2 }
            ]
        });

        var crud        = new TestCrudManager1({
            stores      : [
                { store : store1 },
                { store : store2 }
            ]
        });

        crud.loadData({
            store1 : {
                rows : []
            },
            store2 : {
                rows : []
            }
        });

        t.notOk(store1.getRootNode().firstChild, 'store1 loaded');
        t.is(store2.getCount(), 0, 'store2 loaded');
    });

});
