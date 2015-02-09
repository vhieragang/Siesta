StartTest(function(t) {

    // Here we test sync() method of Sch.crud.AbstractManager class

    t.expectGlobal('TestTransport');
    t.expectGlobal('TestEncoder');
    t.expectGlobal('TestCrudManager1');

    var sent;

    // dummy transport implementation
    // just waits for 50ms and then calls the successful callback
    Ext.define('TestTransport', {
        sendRequest : function (config) {
            var r   = response[sent],
                me  = this;

            sent++;

            window.setTimeout(function () {
                config.success.call(config.scope || this, r);
                if (r && r.success) {
                    t.is(me.revision, r.revision, 'revision applied');
                }
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

    var someStore1, someStore2, crud, added1, added2, response;

    var initTestData = function () {

        // reset requests number
        sent        = 0;

        response    = [];

        someStore1  = new Ext.data.JsonStore({
            storeId : 'someStore1',
            fields  : ['id', 'ff1', 'ff2'],
            data    : [
                { id : 11, ff1 : '11', ff2 : '111' },
                { id : 12, ff1 : '22', ff2 : '222' },
                { id : 13, ff1 : '33', ff2 : '333' }
            ]
        });

        someStore2  = new Ext.data.TreeStore({
            storeId : 'someStore2',
            fields  : ['id', 'f1', 'f2'],
            root    : {
                expanded    : true,
                children    : [
                    { id : 1, f1 : '11', f2 : '111' },
                    { id : 2, f1 : '22', f2 : '222' },
                    { id : 3, f1 : '33', f2 : '333' },
                    { id : 4, f1 : '44', f2 : '444' }
                ]
            }
        });

        crud    = Ext.create('TestCrudManager1', {
            stores      : [ someStore1, someStore2 ],
            revision    : 1
        });

        // init stores changes
        // someStore1
        someStore1.remove(someStore1.getById(11));
        someStore1.getById(12).set('ff1', '-22');
        added1  = someStore1.add({ 'ff1' : 'new', 'ff2' : 'new' });
        // someStore2
        someStore2.getRootNode().removeChild(someStore2.getNodeById(4));
        someStore2.getNodeById(3).set('f1', '-33');
        added2  = someStore2.getNodeById(3).appendChild({ f1 : '55', f2 : '555' });

        // server response for this set of changes
        response.push({
            revision    : 2,
            success     : true,
            someStore1  : {
                rows    : [
                    { $PhantomId : added1[0].getId(), id : 14 },
                    { id : 12, ff2 : '-222' }
                ],
                removed : [{ id : 11 }]
            },
            someStore2  : {
                rows    : [
                    { $PhantomId : added2.getId(), id : 5 },
                    { id : 3, f2 : '-333' }
                ],
                removed : [{ id : 4 }]
            }
        });
    };

    t.it('Delays the sending of sync packet while previous is not responded', function (t) {

        initTestData();

        // we expect one syncdelayed since one of sync() calls are delayed
        t.willFireNTimes(crud, 'syncdelayed', 1);
        // successful sync() calls have to return following events
        t.willFireNTimes(crud, 'beforesync', 2);
        t.willFireNTimes(crud, 'beforesyncapply', 2);
        t.willFireNTimes(crud, 'sync', 2);

        // call sync for the 1st time
        crud.sync();

        // add one more record
        var a = someStore1.add({ 'ff1' : 'another new', 'ff2' : 'another new' });
        // server response for this change
        response.push({
            success     : true,
            revision    : 3,
            someStore1  : {
                rows    : [
                    { $PhantomId : a[0].getId(), id : 15 }
                ]
            }
        });

        // now we call sync again but the 1st call is not responded yet
        // so crud manager will delay 2nd sync call and re-call it
        // after 1st packet get responded
        crud.sync();

        t.is(sent, 1, 'Sent only 1st sync packet');

        t.waitFor(200, function () {
            t.is(sent, 2, 'And now 2nd sync packet is sent as well');

            t.it('Applies response to someStore1', function (t) {
                t.notOk(someStore1.getModifiedRecords().length, 'has no dirty updated records');
                t.notOk(someStore1.getRemovedRecords().length, 'has no dirty removed records');

                t.is(someStore1.getById(14).get('ff1'), 'new', 'added record has correct ff1 field value');
                t.is(someStore1.getById(14).get('ff2'), 'new', 'added record has correct ff2 field value');

                t.is(someStore1.getById(12).get('ff2'), '-222', 'updated record has correct ff2 field value');

                t.is(someStore1.getById(15).get('ff1'), 'another new', 'another added record has correct ff1 field value');
                t.is(someStore1.getById(15).get('ff2'), 'another new', 'another added record has correct ff2 field value');
            });

            t.it('Applies response to someStore2', function (t) {
                t.notOk(someStore2.getModifiedRecords().length, 'has no dirty updated records');
                t.notOk(someStore2.getRemovedRecords().length, 'has no dirty removed records');

                t.is(someStore2.getNodeById(5).get('f1'), '55', 'added record has correct f1 field value');
                t.is(someStore2.getNodeById(5).get('f2'), '555', 'added record has correct f2 field value');

                t.is(someStore2.getNodeById(3).get('f2'), '-333', 'updated record has correct f2 field value');
            });

            scenario2();
        });
    });

    t.it('Fires syncfail on AJAX errors', function (t) {

        var resourceStore   = t.getResourceStore({}, 5);

        var crud            = new Sch.data.CrudManager({
            resourceStore   : resourceStore,
            eventStore      : t.getEventStore({
                resourceStore   : resourceStore
            }, 5),
            transport       : {
                sync    : {
                    url : 'foo'
                }
            }
        });

        t.willFireNTimes(crud, 'syncfail', 1);

        resourceStore.add({ Name : 'bar' });

        var async   = t.beginAsync();

        crud.sync(function () { t.endAsync(async); }, function () { t.endAsync(async); });

    });

    function scenario2 () {
        t.it('Fires syncfail event if response is empty', function (t) {

            initTestData();

            t.willFireNTimes(crud, 'syncfail', 1);

            response.length = 0;

            var called  = 0,
                scope   = {};

            crud.sync(
                function () { t.ok(scope === this, 'callback scope is correct'); },
                function () {
                    t.ok(scope === this, 'errback scope is correct');
                    called++;
                },
                scope
            );

            t.waitFor(200, function () {
                t.is(called, 1, 'errback was called');
                scenario3();
            });
        });
    }

    function scenario3 () {
        t.it('Fires syncfail event if response.success is empty', function (t) {

            initTestData();

            t.willFireNTimes(crud, 'syncfail', 1);

            delete response[0].success;

            var called  = 0,
                scope   = {};

            crud.sync(
                function () { t.ok(scope === this, 'callback scope is correct'); },
                function () {
                    t.ok(scope === this, 'errback scope is correct');
                    called++;
                },
                scope
            );

            t.waitFor(200, function () {
                t.is(called, 1, 'errback was called');
            });
        });
    }

});
