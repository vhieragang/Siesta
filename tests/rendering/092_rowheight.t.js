StartTest(function(t) {
    
    t.it('Part1', function (t) {
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
                var scheduleRowEl   = Ext.get(sv.getNode(0))
                var lockedRowEl     = Ext.get(lv.getNode(0));
                
                t.isApprox(scheduleRowEl.getHeight(), 100, 'Normal row height ok');
                t.isApprox(lockedRowEl.getHeight(), 100, 'Locked row height ok');
                
                t.rowHeightsAreInSync(scheduler, 'Row heights in sync after rendering');
                
                sv.setRowHeight(50);
                
                var scheduleRowEl   = Ext.get(sv.getNode(0))
                var lockedRowEl     = Ext.get(lv.getNode(0));
                
                t.isApprox(scheduleRowEl.getHeight(), 50, 'Locked row height ok after setRowHeight');
                t.isApprox(lockedRowEl.getHeight(), 50, 'Locked row height ok after setRowHeight');
    
                t.rowHeightsAreInSync(scheduler, 'Row heights in sync after setRowHeight');
    
                sv.setRowHeight(100);
                eventStore.last().setResourceId('c1');
                next();
            },
    
            function(next) {
                var scheduleRowEl   = Ext.get(sv.getNode(0)),
                    lockedRowEl     = Ext.get(lv.getNode(0));
                
                t.isApprox(lockedRowEl.getHeight(), 200, 'Locked row height ok with multiple events overlapping');
                t.rowHeightsAreInSync(scheduler, 'Row heights should be in sync with multiple events overlapping');
    
//                scheduler.lockedGrid.getView().onUpdate(resourceStore, resourceStore.first());
//                t.rowHeightsAreInSync(scheduler, 'After row update locked grid');
//    
//                eventStore.remove(eventStore.last());
                next();
            }
//            ,
//           
//            { waitFor : function() { return sv.el.select('.sch-event').getCount() === 1; } },
//    
//            function(next) {
//                var scheduleRowEl   = Ext.get(sv.getNode(0)),
//                    lockedRowEl     = Ext.get(lv.getNode(0));
//    
//                t.isApprox(lockedRowEl.getHeight(), 100, 'Locked row height ok after removing event');
//                t.rowHeightsAreInSync(scheduler, 'after removing event');
//    
//                eventStore.add(eventStore.last().copy());
//    
//                t.isApprox(lockedRowEl.getHeight(), 200, 'Locked row height ok after adding event');
//                t.is(scheduleRowEl.getHeight(), lockedRowEl.getHeight(), 'Row heights in sync');
//                t.rowHeightsAreInSync(scheduler, 'after adding event');
//    
//                sv.on('refresh', function() {
//                    scheduleRowEl   = Ext.get(sv.getNode(0)),
//                    lockedRowEl     = Ext.get(lv.getNode(0));
//                    
//                    t.isApprox(lockedRowEl.getHeight(), 200, 'Locked row height ok after scheduler view refresh');
//                    t.rowHeightsAreInSync(scheduler, 'after scheduling view refresh');
//    
//                }, null, { single : true });
//                
//                sv.refresh();
//    
//                lv.on('refresh', function() {
//                    scheduleRowEl   = Ext.get(sv.getNode(0)),
//                    lockedRowEl     = Ext.get(lv.getNode(0));
//                    
//                    t.isApprox(lockedRowEl.getHeight(), 200, 'Locked row height ok after locked view refresh');
//                    t.rowHeightsAreInSync(scheduler, 'after locked view refresh');
//                }, null, { single : true });
//                
//                var newRes = new Sch.model.Resource();
//                resourceStore.add(newRes);
//    
//                t.rowHeightsAreInSync(scheduler, 'after adding new row');
//    
//                // If scheduler view is refreshed (and as a result gets more rows) before locked view, it should not break
//                resourceStore.suspendEvents();
//                resourceStore.add(new Sch.model.Resource());
//                resourceStore.resumeEvents();
//                sv.refresh();
//            }
        );
    })
    

    t.it('Vertical row height should be in sync after shiftNext', function (t) {
        var res2 = Ext.create('Sch.data.ResourceStore', {
            model : 'Sch.model.Resource',
            data : [
                {Id : 'c1', Name : 'Foo'}
            ]
        })
            
        // Store holding all the events
        var ev2 = t.getEventStore({
            data : [
                {ResourceId: 'c1', Name : 'Mike', StartDate : "2010-12-09 07:45", EndDate : "2010-12-09 11:00"},
                {ResourceId: 'c1', Name : 'Linda', StartDate : "2010-12-09 07:45", EndDate : "2010-12-09 11:00"}
            ]
        });
    
        var scheduler2 = t.getScheduler({
            viewPreset      : 'hourAndDay',
            startDate       : new Date(2010, 11, 9, 8),
            endDate         : new Date(2010, 11, 9, 20),
            rowHeight       : 100,    
            height          : 150,
            orientation     : 'vertical',
            resourceStore   : res2,
            eventStore      : ev2
        });
        scheduler2.render(Ext.getBody());
    
        var svVert = scheduler2.getSchedulingView(),
            lvVert = scheduler2.lockedGrid.getView();
    
        t.waitForRowsVisible(scheduler2, function() {
            scheduler2.shiftNext();
    
            t.is(
                Ext.fly(lvVert.getNode(0)).getHeight(),
                Ext.fly(svVert.getNode(0)).getHeight(),
                'Vertical row height in sync after shiftNext'
            );
        });
    });
})    
