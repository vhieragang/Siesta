StartTest(function(t) {
    var resourceStore = Ext.create('Sch.data.ResourceStore', {
        model : 'Sch.model.Resource',
        data : [
            {Id : 'c1', Name : 'Foo'},
            {Id : 'c2', Name : 'Boo'}
        ]
    }),
        
    // Store holding all the events
    eventStore = t.getEventStore({
        data : [
            {ResourceId: 'c1', Name : 'Mike', StartDate : "2010-12-09 07:45", EndDate : "2010-12-09 11:00"},
            {ResourceId: 'c2', Name : 'Linda', StartDate : "2010-12-09 07:45", EndDate : "2010-12-09 11:00"}
        ]
    });

    var scheduler = t.getScheduler({
        viewPreset      : 'hourAndDay',
        startDate       : new Date(2010, 11, 9, 8),
        endDate         : new Date(2010, 11, 9, 20),
        rowHeight       : 100,
        resourceStore   : resourceStore,
        eventStore      : eventStore
    });


    scheduler.render(Ext.getBody());
    var sv = scheduler.getSchedulingView(),
        lv = scheduler.lockedGrid.getView();
    
    t.chain(
        { waitFor : 'EventsToRender', args : scheduler },
        
        function(next) {
            sv.el.scrollTo('top', 100);
            
            t.waitFor(100, function() {
                eventStore.fireEvent('datachanged');
                t.is(lv.el.dom.scrollTop, sv.el.dom.scrollTop, 'Scroll intact after eventStore datachanged event');
                
                eventStore.fireEvent('refresh');
                t.is(lv.el.dom.scrollTop, sv.el.dom.scrollTop, 'Scroll intact after eventStore refresh event');
            });
        }
    );
})
