StartTest(function (t) {

    t.it('Sanity checks + phantom record handling', function(t) {

        var eventStore = Ext.create('Sch.data.EventStore', {
            data  : [
                { Id : 1, Name : 'Linda', StartDate : "2010-12-09", EndDate : "2010-12-13"}
            ],
            proxy : {
                type   : 'ajax',
                reader : {
                    type : 'json'
                }
            }
        });

        var resourceStore = Ext.create('Sch.data.ResourceStore', {
            eventStore : eventStore,
            proxy      : {
                type          : 'ajax',
                api           : {
                    create : 'data/create_resource.js'
                },
                actionMethods : { create : 'GET' }
            }
        });


        eventStore.setResourceStore(resourceStore);

        var res = new resourceStore.model();
        resourceStore.add(res);
        t.isDeeply(eventStore.getEventsForResource(res), [], 'Should not find any events for a new resource');

        var ev = eventStore.first();

        ev.setResource(res);
        t.is(ev.getResource(), res, 'Found phantom resource');
        t.is(res.getEvents()[0], ev, 'Found event by resource');

        var phantomResId = ev.getResourceId();

        t.wait('store');
        resourceStore.on('write', function () {
            t.isnt(ev.getResourceId(), phantomResId, 'Found phantom resource');
            t.is(ev.getResource(), res, 'Found real resource');
            t.endWait('store');

            t.is(ev.getResource(), res, 'Found real resource');

            // Make sure we tolerate sloppy input with mixed types, ResourceId as string '1' and the Id of a Resource as int 1.
            ev.setResourceId('1');
            res.set('Id', 1);
            t.is(eventStore.getEventsForResource(res)[0], ev, 'Should be able to use strings and int mixed, == check instead of ===');

        }, null, { delay : 1 });

        resourceStore.sync();
    });

    t.it('ResourceTreeStore init', function (t) {
        var ts = new Sch.data.ResourceTreeStore();

        var ts = new Sch.data.ResourceTreeStore({
            model : Ext.define('Ext.ux.Mod2', { extend : 'Sch.model.Resource' })
        });

        t.throwsOk(function(){
            var store = Ext.create('Sch.data.ResourceTreeStore', {
                model : Ext.define('Ext.ux.Mod3', { extend : 'Ext.data.Model' })
            });
        }, 'must subclass Sch.model.Resource');
    })

    t.it('Basic instantiation', function(t) {
        var store = new Sch.data.ResourceStore({
            data : [{ }]
        });

        t.isInstanceOf(store.first(), Sch.model.Resource, 'Should use ResourceModel');

        t.throwsOk(function(){
            var store = Ext.create('Sch.data.ResourceStore', {
                model : Ext.define('Ext.ux.Mod4', { extend : 'Ext.data.Model', proxy : 'memory' })
            });
        }, 'must subclass Sch.model.Resource');
    })
})    
