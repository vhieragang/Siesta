StartTest(function(t) {

    var scheduler = t.getScheduler({
        renderTo : Ext.getBody()
    });

    t.waitForRowsVisible(scheduler, function() {
        var lockedView = scheduler.lockedGrid.getView();
        var normalView = scheduler.normalGrid.getView();

        t.willFireNTimes(normalView, 'itemupdate', 1, '1 item update event should be fired on normal view')
        t.willFireNTimes(lockedView, 'itemupdate', 1, '.. and same for locked view')

        t.wontFire(scheduler.getView(), 'refresh', 'Top view should not refresh in full')
        t.wontFire(normalView, 'refresh', 'Normal view should not refresh in full')
        t.wontFire(lockedView, 'refresh', 'Locked view should not refresh in full')

        scheduler.eventStore.add([
            scheduler.eventStore.first().copy(null),
            scheduler.eventStore.first().copy(null)
        ]);
    });    
})    

