StartTest(function (t) {
    var resourceStore = Ext.create('Sch.data.ResourceStore', {
        model : 'Sch.model.Resource',
        data  : [
            {Id : 'c1', Name : 'Foo'}
        ]
    })

    // Store holding all the events
    var eventStore = t.getEventStore({
        data : [
            {ResourceId : 'c1', Name : 'Mike', StartDate : "2010-12-09 07:45", EndDate : "2010-12-09 11:00"},
            {ResourceId : 'c1', Name : 'Linda', StartDate : "2010-12-09 07:45", EndDate : "2010-12-09 11:00"}
        ]
    });

    var scheduler = t.getScheduler({
        viewPreset                  : 'hourAndDay',
        startDate                   : new Date(2010, 11, 9, 8),
        endDate                     : new Date(2010, 11, 9, 20),
        rowHeight                   : 100,
        height                      : 150,
        lockedGridDependsOnSchedule : true,
        resourceStore               : resourceStore,
        eventStore                  : eventStore
    });

    scheduler.render(Ext.getBody());

    var sv = scheduler.getSchedulingView(),
        lv = scheduler.lockedGrid.getView();

    t.chain(
        { waitFor : 'EventsToRender', args : scheduler },

        function (next) {
            var scheduleRowEl = Ext.get(sv.getNode(0)),
                lockedRowEl = Ext.get(lv.getNode(0));

            t.isApprox(lockedRowEl.getHeight(), 200, 'Locked row height ok');
            t.rowHeightsAreInSync(scheduler, 'Row heights in sync after rendering');

            eventStore.remove(eventStore.last());
            next();
        },

        {
            waitFor : function () {
                return sv.el.select('.sch-event').getCount() === 1;
            } 
        },

        function (next) {
            var scheduleRowEl   = Ext.get(sv.getNode(0)),
                lockedRowEl     = Ext.get(lv.getNode(0));

            t.isApprox(lockedRowEl.getHeight(), 100, 'Locked row height ok after removing event');
            t.rowHeightsAreInSync(scheduler);
            
            eventStore.add(eventStore.last().copy(null));

            t.isApprox(lockedRowEl.getHeight(), 200, 'Locked row height ok after adding event');
            t.rowHeightsAreInSync(scheduler);

            sv.refresh();

            scheduleRowEl = Ext.get(sv.getNode(0)),
                lockedRowEl = Ext.get(lv.getNode(0));

            t.isApprox(lockedRowEl.getHeight(), 200, 'Locked row height ok after scheduler view refresh');
            t.rowHeightsAreInSync(scheduler);

            // need to wait additional 100ms after the scroll event, otherwise, it seems the
            // "scroll" event on the locked view is triggered and messes up the scroll top position of both views
            t.scrollVerticallyTo(sv.el, 50, 100, next)
        },
        function (next) {
            eventStore.fireEvent('datachanged', eventStore);
            t.is(lv.el.dom.scrollTop, 50, 'Scroll intact after eventStore datachanged event');
            t.is(lv.el.dom.scrollTop, sv.el.dom.scrollTop, 'Scroll synced after eventStore datachanged event');

            eventStore.fireEvent('refresh', eventStore);

            next()
        },
        { waitFor : 300 },
        function (next) {
            var scheduleRowEl = Ext.get(sv.getNode(0))
            var lockedRowEl = Ext.get(lv.getNode(0))

            t.isApprox(lockedRowEl.getHeight(), 200, 'Locked row height ok after locked view refresh');

            t.rowHeightsAreInSync(scheduler);

            t.is(lv.el.dom.scrollTop, 50, 'Locked scroll intact after eventStore refresh event');
            t.is(sv.el.dom.scrollTop, 50, 'Normal scroll intact after eventStore refresh event');

            var newRes = new Sch.model.Resource();
            resourceStore.add(newRes);
            t.is(
                Ext.fly(lv.getNodeByRecord(newRes)).getHeight(),
                Ext.fly(sv.getNodeByRecord(newRes)).getHeight(),
                'Row height in sync for new resource'
            );

            // If scheduler view is refreshed (and as a result gets more rows) before locked view, it should not break
            resourceStore.suspendEvents();
            resourceStore.add(new Sch.model.Resource());
            resourceStore.resumeEvents();
            sv.refresh();

            scheduler.getView().refresh();

            next()
        },
        function () {
            // re-loading the event store - row height should reflect that now its only 1 event for resource "c1"
            eventStore.loadData([
                {ResourceId : 'c1', Name : 'Mike', StartDate : "2010-12-09 07:45", EndDate : "2010-12-09 11:00"}
            ])

            t.rowHeightsAreInSync(scheduler);

            var lockedRowEl = Ext.get(lv.getNode(0))

            t.isApprox(lockedRowEl.getHeight(), 100, 'Row height is only for 1 event');
        }
    );
})    
