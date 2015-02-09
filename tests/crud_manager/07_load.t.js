StartTest(function(t) {

    // Here we test load() method of Sch.crud.AbstractManager class

    t.expectGlobal('TestTransport');
    t.expectGlobal('TestEncoder');
    t.expectGlobal('TestCrudManager1');

    var sent    = 0;

    // dummy transport implementation
    // just waits for 50ms and then calls the successful callback
    Ext.define('TestTransport', {
        sendRequest : function (config) {
            var r   = response[sent];

            sent++;

            window.setTimeout(function () {
                config.success.call(config.scope || this, r);
            }, 50);
        }
    });

    // dummy encoder, does nothing
    Ext.define('TestEncoder', {
        encode : function (data) { return data; },
        decode : function (data) { return data; }
    });

    Ext.define('TestCrudManager1', {
        extend  : 'Sch.crud.AbstractManager',
        mixins  : [ 'TestTransport', 'TestEncoder' ]
    });

    var someStore1, someStore2, crud,
        response    = [];

    var initTestData = function () {

        someStore1  = new Ext.data.JsonStore({
            storeId : 'someStore1',
            fields  : ['id', 'ff1', 'ff2'],
            proxy   : { type : 'memory' }
        });

        someStore2  = new Ext.data.TreeStore({
            storeId : 'someStore2',
            fields  : ['id', 'f1', 'f2'],
            proxy   : { type : 'memory' }
        });

        crud    = Ext.create('TestCrudManager1', {
            stores : [ someStore1, someStore2 ]
        });

        // server response for this set of changes
        response.push({
            success     : true,
            revision    : 99,
            someStore1  : {
                rows    : [
                    { id : 11, ff1 : '11', ff2 : '111' },
                    { id : 12, ff1 : '22', ff2 : '222' },
                    { id : 13, ff1 : '33', ff2 : '333' }
                ]
            },
            someStore2  : {
                rows    : [
                    { id : 0, f1 : 'root', f2 : 'root', children : [
                        { id : 1, f1 : '11', f2 : '111', leaf : true },
                        { id : 2, f1 : '22', f2 : '222', leaf : true },
                        { id : 3, f1 : '33', f2 : '333', leaf : true },
                        { id : 4, f1 : '44', f2 : '444', leaf : true },
                        { id : 5, f1 : '55', f2 : '555',
                            children : [
                                { id : 6, f1 : '66', f2 : '666', leaf : true },
                                { id : 7, f1 : '77', f2 : '777', leaf : true }
                            ]
                         }
                     ]}
                ]
            }
        });
    };

    t.it('Loads data', function (t) {

        initTestData();

        t.willFireNTimes(crud, 'beforeload', 1);
        t.willFireNTimes(crud, 'beforeloadapply', 1);
        t.willFireNTimes(crud, 'load', 1);
        t.willFireNTimes(crud, 'nochanges', 1);

        crud.load();

        t.is(sent, 1, 'Load packet sent');

        t.waitFor(200, function () {

            t.is(crud.revision, 99, 'revision applied');

            t.it('Applies response to someStore1', function (t) {
                t.notOk(someStore1.getModifiedRecords().length, 'has no dirty updated records');
                t.notOk(someStore1.getRemovedRecords().length, 'has no dirty removed records');

                t.is(someStore1.getById(11).get('ff1'), '11', '#11: correct ff1 field value');
                t.is(someStore1.getById(11).get('ff2'), '111', '#11: correct ff2 field value');

                t.is(someStore1.getById(12).get('ff1'), '22', '#12: correct ff1 field value');
                t.is(someStore1.getById(12).get('ff2'), '222', '#12: correct ff2 field value');

                t.is(someStore1.getById(13).get('ff1'), '33', '#13: correct ff1 field value');
                t.is(someStore1.getById(13).get('ff2'), '333', '#13: correct ff2 field value');
            });

            t.it('Applies response to someStore2', function (t) {
                t.notOk(someStore2.getModifiedRecords().length, 'has no dirty updated records');
                t.notOk(someStore2.getRemovedRecords().length, 'has no dirty removed records');

                t.is(someStore2.getNodeById(1).get('f1'), '11', 'correct f1 field value');
                t.is(someStore2.getNodeById(1).get('f2'), '111', 'correct f2 field value');

                t.is(someStore2.getNodeById(2).get('f1'), '22', 'correct f1 field value');
                t.is(someStore2.getNodeById(2).get('f2'), '222', 'correct f2 field value');

                t.is(someStore2.getNodeById(3).get('f1'), '33', 'correct f1 field value');
                t.is(someStore2.getNodeById(3).get('f2'), '333', 'correct f2 field value');

                t.is(someStore2.getNodeById(4).get('f1'), '44', 'correct f1 field value');
                t.is(someStore2.getNodeById(4).get('f2'), '444', 'correct f2 field value');

                t.is(someStore2.getNodeById(5).get('f1'), '55', 'correct f1 field value');
                t.is(someStore2.getNodeById(5).get('f2'), '555', 'correct f2 field value');

                t.is(someStore2.getNodeById(6).get('f1'), '66', 'correct f1 field value');
                t.is(someStore2.getNodeById(6).get('f2'), '666', 'correct f2 field value');

                t.is(someStore2.getNodeById(7).get('f1'), '77', 'correct f1 field value');
                t.is(someStore2.getNodeById(7).get('f2'), '777', 'correct f2 field value');
            });

        });
    });


    t.it('Fires loadfail on AJAX errors', function (t) {

        var resourceStore   = t.getResourceStore({}, 5);

        var crud            = new Sch.data.CrudManager({
            resourceStore   : resourceStore,
            eventStore      : t.getEventStore({
                resourceStore   : resourceStore
            }, 5),
            transport       : {
                load    : {
                    url : 'foo'
                }
            }
        });

        t.willFireNTimes(crud, 'loadfail', 1);

        var async   = t.beginAsync();

        crud.load(function () { t.endAsync(async); }, function () { t.endAsync(async); });

    });

});
