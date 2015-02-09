StartTest(function(t) {
    
    var scheduler = t.getScheduler({
        renderTo : Ext.getBody(),
        onEventCreated : function(ev) { ev.set('Name', 'foo'); }
    });

    var fired = {
        'beforedragcreate' : 0,
        'dragcreatestart' : 0,
        'dragcreateend' : 0,
        'afterdragcreate' : 0
    };

    scheduler.on({
        'beforedragcreate' : function() {
            t.ok(arguments[0] instanceof Sch.view.SchedulerGridView &&
                arguments[1] instanceof Sch.model.Resource &&
                arguments[2] instanceof Date &&
                !!arguments[3].getTarget, 'Correct event signature of `beforedragcreate`')
                
            fired.beforedragcreate++; 
        },
        'dragcreatestart' : function() {
            t.ok(arguments[0] instanceof Sch.view.SchedulerGridView &&
                 arguments[1].hasCls('sch-dragcreator-proxy'),
                 'Correct event signature of `dragcreatestart`')

            fired.dragcreatestart++; 
        },
        'dragcreateend' : function() { 
            t.ok(arguments[0] instanceof Sch.view.SchedulerGridView &&
                arguments[1] instanceof Sch.model.Event &&
                arguments[2] instanceof Sch.model.Resource &&
                !!arguments[3].getTarget &&
                arguments[4].hasCls('sch-dragcreator-proxy'),
                'Correct event signature of `dragcreateend`')
            
            var sv = arguments[0];
            var proxy = arguments[0].dragCreator.proxy;

            t.is(proxy.getWidth(), 100, 'Correct width of proxy');
            t.isGreater(proxy.getY(), sv.el.getY(), 'Correct Y position of proxy');
            t.isLess(proxy.getHeight(), Ext.fly(sv.getNode(sv.store.first())).getHeight(), 'Correct height of proxy');

            fired.dragcreateend++;  
        },
        'afterdragcreate' : function() { 
            t.ok(arguments[0] instanceof Sch.view.SchedulerGridView &&
                  arguments[1].hasCls('sch-dragcreator-proxy'),
                 'Correct event signature of `afterdragcreate`')

            fired.afterdragcreate++;  
        }
    });
    
    var eventStore = scheduler.getEventStore();
    var falseFn = function() { return false; };

    eventStore.removeAll();

    t.chain(
        { waitForRowsVisible : scheduler },

        { drag : '.sch-timetd', by : [100, 0] },

        function(next) {
        
            for (var o in fired) {
                t.ok(fired[o] === 1, Ext.String.format("'{0}' event fired", o));
            }
        
            t.ok(eventStore.getCount() === 1, "New event added to store");
        
            t.ok(eventStore.first().get('StartDate') instanceof Date, "StartDate is a valid Date");
            t.ok(eventStore.first().get('EndDate') instanceof Date, 'EndDate is a valid Date');

            t.isLess(eventStore.first().get('StartDate'), eventStore.first().get('EndDate'), "EndDate is greater than start date");

            t.is(eventStore.first().get('Name'), 'foo', "onEventCreated successfully modified the new record");

            scheduler.on('beforedragcreate', falseFn);

            for (var o in fired) {
                fired[o] = 0;
            }

            next();
        },

        { drag : Ext.grid.View.prototype.itemSelector + ':nth-child(2) .sch-timetd', by : [-100, 0] },

        function(next) {
        
            // Make sure no events were fired, e.g. operation didn't start
            t.isDeeply(fired, {
                'beforedragcreate'  : 1,
                'dragcreatestart'   : 0,
                'dragcreateend'     : 0,
                'afterdragcreate'   : 0
            }, 'Only `beforedragcreate` was fired which did not result in any event created');

            t.is(eventStore.getCount(), 1, "No new event added to store");

            scheduler.un('beforedragcreate', falseFn);

            // Try again and make sure that firing 'beforeeventadd' event behaves as expected
            scheduler.on('beforeeventadd', falseFn);

            next()
        },

        { drag :  Ext.grid.View.prototype.itemSelector + ':nth-child(2) .sch-timetd', by : [-100, 0] },

        function() {
            t.it('Should hide proxy after dragging and returning false from beforeeventadd handler', function(t) {

                t.isLess(scheduler.getSchedulingView().dragCreator.getProxy().getTop(), -5000);
            })
        }
    );
});    
