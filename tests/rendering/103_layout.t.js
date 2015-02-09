StartTest(function (t) {
    //======================================================================================================================================================================================================================================================
    t.diag('Instantiation');

    var scheduler = t.getScheduler({
        eventResizeHandles : 'both',
        startDate          : new Date(2011, 0, 3),
        endDate            : new Date(2011, 0, 13),
        viewPreset         : 'dayAndWeek',
        width              : 800,
        height             : 600,
        renderTo           : Ext.getBody(),
        viewConfig         : { deferInitialRefresh : false }
    });

    var nbrLayouts = scheduler.layoutCounter,
        eventStore = scheduler.eventStore,
        resourceStore = scheduler.resourceStore;

//    scheduler.view.refresh();
//    t.is(scheduler.layoutCounter, nbrLayouts, 'calling `refresh` on its view.');

    var evt = new eventStore.model({
        Name       : 'New event',
        ResourceId : 'r1',
        StartDate  : new Date(2011, 0, 7),
        EndDate    : new Date(2011, 0, 9)
    });

    t.waitForRowsVisible(scheduler, function () {
        nbrLayouts = scheduler.layoutCounter;

        scheduler.eventStore.add(evt);
        t.is(scheduler.layoutCounter, nbrLayouts, 'adding new Event record.');

        nbrLayouts = scheduler.layoutCounter;
        evt.set('Name', 'New changed');
        t.is(scheduler.layoutCounter, nbrLayouts, 'updating Event record.');

        nbrLayouts = scheduler.layoutCounter;
        eventStore.remove(evt);
        t.is(scheduler.layoutCounter, nbrLayouts, 'removing Event record.');
    });
});