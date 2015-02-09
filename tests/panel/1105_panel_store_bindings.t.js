describe('SchedulerPanel should clean up any listeners attached to its stores', function (t) {

    // http://www.sencha.com/forum/showthread.php?286523-Ext.grid.feature.GroupStore-store-listener-leaks

    // Too many listener leaks in Ext 5
    if (Ext.versions.extjs.isLessThan('5.1')) return;

    t.it('Scheduler not rendered', function(t) {
        var eventStore = t.getEventStore();
        var resourceStore = t.getResourceStore();
        eventStore.on('add', Ext.emptyFn)
        resourceStore.on('remove', Ext.emptyFn)

        t.snapShotListeners(eventStore, 'eventStore')
        t.snapShotListeners(resourceStore, 'resourceStore')

//        var old = resourceStore.addListener;
//        resourceStore.addListener = function() {
//            return old.apply(this, arguments);
//        }

        var s = t.getScheduler({
            eventStore    : eventStore,
            resourceStore : resourceStore
        });

        // Should clean all listeners
        s.destroy();

        t.verifyListeners(eventStore, 'eventStore')

        t.knownBugIn('5.0.1', function(t) {
            t.verifyListeners(resourceStore, 'resourceStore')
        })
    })

    t.it('Scheduler rendered then destroyed', function(t) {
        var eventStore = t.getEventStore();
        var resourceStore = t.getResourceStore();
        eventStore.on('add', Ext.emptyFn)
        resourceStore.on('remove', Ext.emptyFn)

        t.snapShotListeners(eventStore, 'eventStore')
        t.snapShotListeners(resourceStore, 'resourceStore')

        var old = eventStore.addListener;
        eventStore.addListener = eventStore.addManagedListener = function() {
            return old.apply(this, arguments);
        }

        var s = t.getScheduler({
            renderTo      : Ext.getBody(),
            eventStore    : eventStore,
            resourceStore : resourceStore,
            features      : [
                {
                    id                 : 'group',
                    ftype              : 'scheduler_grouping'
                }
            ]
        });

        s.destroy();

        t.verifyListeners(eventStore, 'eventStore')
        t.verifyListeners(resourceStore, 'resourceStore')
    })

    t.it('Scheduler vertical rendered then destroyed', function(t) {
        var eventStore = t.getEventStore();
        var resourceStore = t.getResourceStore();
        eventStore.on('add', Ext.emptyFn)
        resourceStore.on('remove', Ext.emptyFn)

        t.snapShotListeners(eventStore, 'eventStore')
        t.snapShotListeners(resourceStore, 'resourceStore')

        var s = t.getScheduler({
            orientation   : 'vertical',
            renderTo      : Ext.getBody(),
            eventStore    : eventStore,
            resourceStore : resourceStore
        });

        s.destroy();

        t.verifyListeners(eventStore, 'eventStore')
        t.verifyListeners(resourceStore, 'resourceStore')
    });

    t.it('Scheduler tree rendered then destroyed', function(t) {
        var resourceStore = t.getResourceTreeStore();
        var eventStore = t.getEventStore();
        eventStore.on('add', Ext.emptyFn)
        resourceStore.on('remove', Ext.emptyFn)

        t.snapShotListeners(eventStore, 'eventStore')
        t.snapShotListeners(resourceStore, 'resourceStore')

        var s = t.getSchedulerTree({
            renderTo      : Ext.getBody(),
            eventStore    : eventStore,
            resourceStore : resourceStore
        });

        s.destroy();

        t.verifyListeners(eventStore, 'eventStore')
        t.verifyListeners(resourceStore, 'resourceStore')
    });

    t.it('Store remove all', function(t) {

        var s = t.getScheduler({
            renderTo : document.body
        });

        t.chain(
            { waitFor : 'rowsVisible', args : s },

            function() {
                t.firesOnce(s.getSchedulingView(), 'refresh')

                s.eventStore.removeAll();
            }
        )
    });

    t.it('bindAutoTimeSpanListeners flat store', function(t) {
        var eventStore = t.getEventStore();
        var resourceStore = t.getResourceStore();
        eventStore.on('add', Ext.emptyFn)
        resourceStore.on('remove', Ext.emptyFn)

        t.snapShotListeners(eventStore, 'eventStore')
        t.snapShotListeners(resourceStore, 'resourceStore')

        var s = t.getScheduler({
            startDate   : null,
            endDate     : null,
            eventStore  : eventStore,
            resourceStore   : resourceStore,
            renderTo    : document.body
        });

        s.destroy();

        t.verifyListeners(eventStore, 'eventStore')
        t.verifyListeners(resourceStore, 'resourceStore')
    });
});
