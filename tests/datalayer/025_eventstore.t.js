StartTest(function(t) {

    t.it('Basic instantiation', function(t) {
        var store = Ext.create('Sch.data.EventStore', {
            data : [{ }]
        });

        t.isInstanceOf(store.first(), Sch.model.Event, 'Store should be configured with Sch.model.Event');

        store = Ext.create('Sch.data.EventStore', {
            model : 'Sch.model.Event',
            data  : [{ }]
        });

        t.isInstanceOf(store.first(), Sch.model.Event, 'Should use EventModel when specifying model as String');

        Ext.define('Sch.model.Event2', {
            extend : 'Sch.model.Event'
        });

        store = Ext.create('Sch.data.EventStore', {
            model : 'Sch.model.Event2',
            data  : [{ }]
        });

        t.isInstanceOf(store.first(), Sch.model.Event, 'Should be ok to subclass EventModel');

        t.throwsOk(function(){
            var store = Ext.create('Sch.data.EventStore', {
                model : Ext.define('Ext.ux.Mod', { extend : 'Ext.data.Model', proxy : 'memory' })
            });
        }, 'The model for the EventStore must subclass Sch.model.Event');

    })

    t.it('getEventsInTimeSpan + getTotalTimeSpan', function(t) {
        var store = Ext.create('Sch.data.EventStore', {
            data : [
                { Id : 1, ResourceId: 'c2', Name : 'Linda', StartDate : "2010-12-09", EndDate : "2010-12-13"}
            ]
        });

        var rs = new Sch.data.ResourceStore();
        store.setResourceStore(rs);

        t.is(store.resourceStore, rs, 'Should find resourceStore set on the eventStore');
        store.setResourceStore();

        t.is(store.getEventsInTimeSpan(new Date(2010, 11, 9), new Date(2010, 11, 13)).getCount(), 1, 'getEventsInTimeSpan');
        t.is(store.getEventsInTimeSpan(new Date(2010, 11, 9), new Date(2010, 11, 10), false).getCount(), 0, 'getEventsInTimeSpan partial miss');
        t.is(store.getEventsInTimeSpan(new Date(2010, 11, 9), new Date(2010, 11, 13), false).getCount(), 1, 'getEventsInTimeSpan get 1');

        t.isDeeplyStrict(store.getTotalTimeSpan(), { start : new Date(2010, 11, 9), end : new Date(2010, 11, 13) }, 'getTotalTimeSpan');

        store.add(new Sch.model.Event({
            StartDate : new Date(2009, 1, 1)
        }));

        t.isDeeplyStrict(store.getTotalTimeSpan(), { start : new Date(2009, 1, 1), end : new Date(2010, 11, 13) }, 'getTotalTimeSpan 2');

        store.remove(store.first());
    })

    t.it('getTotalTimeSpan partial data', function(t) {
        var store = Ext.create('Sch.data.EventStore', {
            data : [
                { StartDate : "2010-12-09" }
            ]
        });

        t.isDeeplyStrict(store.getTotalTimeSpan(), { start : new Date(2010, 11, 9), end : new Date(2010, 11, 9) }, 'Missing end date');

        store.first().set({
            StartDate   : null,
            EndDate     : new Date(2009, 1, 1)
        });

        t.isDeeplyStrict(store.getTotalTimeSpan(), { start : null, end : new Date(2009, 1, 1) }, 'Missing start date');
    })

    t.it('getByInternalId + append', function(t) {
        var store = Ext.create('Sch.data.EventStore', {
            data : [
                { ResourceId: 'c2', Name : 'Linda', StartDate : "2010-12-09", EndDate : "2010-12-13"}
            ]
        });

        t.is(store.getByInternalId(store.first().internalId), store.first(), 'getByInternalId');

        store.append({ Id : 2 });

        t.ok(store.getById(2), 'Found record after "append"');
    })
    
    
    t.it('Index by resource id', function (t) {
        var store = new Sch.data.EventStore({
            data : [
                { ResourceId: 1, Id : 1 }
            ]
        });
        
        t.verifyIndexByResource(store)
        
        store.add([
            { ResourceId: 1, Id : 2 },
            { ResourceId: 1, Id : 3 },
            { ResourceId: 2, Id : 4 }
        ])
        
        t.verifyIndexByResource(store)
        
        store.remove(store.first())
        
        t.verifyIndexByResource(store)
        
        store.remove(store.last())
        
        t.verifyIndexByResource(store)
        
        var event   = store.add({ ResourceId: 3, Id : 5 })[ 0 ]
        
        t.verifyIndexByResource(store)
        
        event.setResourceId(1)
        
        t.verifyIndexByResource(store)
        
        store.removeAll()
        
        t.verifyIndexByResource(store)
        
        store.loadData([
            { ResourceId: 1, Id : 1 }
        ])
        
        t.verifyIndexByResource(store)
    });
    
    t.it('Should update event cache', function (t) {
        var store, setup = function (cfg) {
            store = new Sch.data.EventStore(Ext.apply({
                data    : [
                    { ResourceId: 1, Id : 1 },
                    { ResourceId: 1, Id : 2 },
                    { ResourceId: 2, Id : 3 },
                    { ResourceId: 2, Id : 4 }
                ],
                proxy   : {
                    type    : 'memory',
                    reader  : 'json'
                }
            }, cfg || {}));
        }
        
        t.it('Should update cache after event add', function (t) {
            t.methodIsCalledNTimes('fillIndexByResource', 'Sch.data.EventStore', 1, 'Cache refreshed only once');
            setup();
            
            store.add({ ResourceId : 2, Id : 5 });
            t.verifyIndexByResource(store, 'Cache updated after record added');
        });
        
        t.it('Should update cache after event update', function (t) {
            t.methodIsCalledNTimes('fillIndexByResource', 'Sch.data.EventStore', 1, 'Cache refreshed only once');
            setup();
            
            var record = store.getAt(1).setResourceId(2);
            t.verifyIndexByResource(store, 'Cache updated after record added');
        });
        
        t.it('Should update cache after event remove', function (t) {
            t.methodIsCalledNTimes('fillIndexByResource', 'Sch.data.EventStore', 1, 'Cache refreshed only once');
            setup();
            
            var record = store.getAt(0);
            store.remove(record);
            t.verifyIndexByResource(store, 'Cache updated after record removed');
        });
        
        t.it('Should update cache after addFilter was called', function (t) {
            t.methodIsCalledNTimes('fillIndexByResource', 'Sch.data.EventStore', 2, 'Cache refreshed twice');
            setup();
            
            store.addFilter(new Ext.util.Filter({
                filterFn: function (item) {
                    return item.getResourceId() === 2;
                }
            }));
            
            t.verifyIndexByResource(store, 'Cache updated after filter is added');
        });
    });
})
