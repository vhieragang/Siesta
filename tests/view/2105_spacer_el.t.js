StartTest(function(t) {
//    t.diag('A spacerEl must be part of locked grid view after view refresh etc');
//
//    // Since Ext 4.1.2, this is handled by a locked grid view bottom border
//    // We shouldn't have to care about the spacer el normally, only when the
//    // width of the locked section is defined (as for gantt) and the locked
//    // grid should be horizontally scrollable
//
//    var scheduler = t.getScheduler({
//        viewPreset  : 'year',
//        startDate   : new Date(2012, 0, 1),
//        endDate     : new Date(2012, 3, 1),
//        renderTo    : Ext.getBody(),
//        height      : 150
//    });
//
//    t.waitForRowsVisible(scheduler, function() {
//        var spacerId = scheduler.lockedGrid.getView().el.dom.id + '-spacer';
//        var spacer = Ext.get(spacerId);
//        var scrollbarSize = Ext.getScrollbarSize().height;
//
//        // At this point there is no scrollbar in the normal section
//        t.ok(spacer, 'Found spacer el after render');
//
//        scheduler.zoomIn();
//
//        // Now there is a scrollbar in the normal section, spacer required
//        scheduler.getView().refresh();
//        spacer = Ext.get(spacerId);
//        t.ok(spacer, 'Found spacer el after getView().refresh()');
//        t.is(spacer.getHeight(), scrollbarSize, '1. Spacer has correct height');
//
//        scheduler.resourceStore.add(new Sch.model.Resource());
//        spacer = Ext.get(spacerId);
//        t.ok(spacer, 'Found spacer el after resource add');
//        t.is(spacer.getHeight(), scrollbarSize, '2. Spacer has correct height');
//
//        scheduler.eventStore.add(scheduler.eventStore.first().copy());
//        spacer = Ext.get(spacerId);
//        t.ok(spacer, 'Found spacer el after event add');
//        t.is(spacer.getHeight(), scrollbarSize, '3. Spacer has correct height');
//
//        scheduler.lockedGrid.getView().refresh();
//        spacer = Ext.get(spacerId);
//        t.ok(spacer, 'Found spacer el after locked grid refresh');
//        t.is(spacer.getHeight(), scrollbarSize, '4. Spacer has correct height');
//
//        scheduler.normalGrid.getView().refresh();
//        spacer = Ext.get(spacerId);
//        t.ok(spacer, 'Found spacer el after normal grid refresh');
//        t.is(spacer.getHeight(), scrollbarSize, '5. Spacer has correct height');
//    });
//
//    var schedulerLockedScrollable = t.getScheduler({
//        viewPreset  : 'year',
//        startDate   : new Date(2012, 0, 1),
//        endDate     : new Date(2012, 3, 1),
//        renderTo    : Ext.getBody(),
//        height      : 150,
//        lockedGridConfig : { width : 50 }
//    });
//
//    t.waitForRowsVisible(schedulerLockedScrollable, function() {
//        var scheduler = schedulerLockedScrollable;
//
//        var spacerId = scheduler.lockedGrid.getView().el.dom.id + '-spacer';
//        var spacer = Ext.get(spacerId);
//        var scrollbarSize = Ext.getScrollbarSize().height;
//
//        // At this point there is no scrollbar in the normal section
//        t.ok(spacer, 'Found spacer el after render');
//
//        scheduler.zoomIn();
//
//        // Now there is a scrollbar in the normal section, spacer required
//        spacer = Ext.get(spacerId);
//        t.ok(spacer, 'Found spacer el after zooming in');
//        t.is(spacer.getHeight(), scrollbarSize, '5. Spacer has correct height');
//
//        scheduler.getView().refresh();
//        spacer = Ext.get(spacerId);
//        t.ok(spacer, 'Found spacer el after getView().refresh()');
//        t.is(spacer.getHeight(), scrollbarSize, '1. Spacer has correct height');
//
//        scheduler.resourceStore.add(new Sch.model.Resource());
//        spacer = Ext.get(spacerId);
//        t.ok(spacer, 'Found spacer el after resource add');
//        t.is(spacer.getHeight(), scrollbarSize, '2. Spacer has correct height');
//
//        scheduler.eventStore.add(scheduler.eventStore.first().copy());
//        spacer = Ext.get(spacerId);
//        t.ok(spacer, 'Found spacer el after event add');
//        t.is(spacer.getHeight(), scrollbarSize, '3. Spacer has correct height');
//
//        scheduler.lockedGrid.getView().refresh();
//        spacer = Ext.get(spacerId);
//        t.ok(spacer, 'Found spacer el after locked grid refresh');
//        t.is(spacer.getHeight(), scrollbarSize, '4. Spacer has correct height');
//
//        scheduler.normalGrid.getView().refresh();
//        spacer = Ext.get(spacerId);
//        t.ok(spacer, 'Found spacer el after normal grid refresh');
//        t.is(spacer.getHeight(), scrollbarSize, '5. Spacer has correct height');
//    });

})    

