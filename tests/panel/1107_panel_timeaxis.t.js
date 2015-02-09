StartTest(function (t) {
    t.diag('Should be able to instantiate a scheduler with an existing configured timeaxis');

    var ta = new Sch.data.TimeAxis();

    t.snapShotListeners(ta, 'timeAxis');

    ta.reconfigure({
        start : new Date(2010, 1, 1, 1),
        end   : new Date(2010, 1, 1, 10),
        unit  : Sch.util.Date.HOUR
    });

    var scheduler = t.getScheduler({
        // if there will be any events in the EventStore, the start/end dates will be reset by the scheduler
        eventStore  : new Sch.data.EventStore(),
        timeAxis    : ta,
        startDate   : null,
        endDate     : null,
        viewPreset  : 'hourAndDay'
    });
    t.is(scheduler.getTimeAxis(), ta, 'Using existing timeaxis');

    t.diag("timeAxis should not be touched by scheduler during instantiation, if there's no events");
    t.is(ta.getStart(), new Date(2010, 1, 1, 1), 'Correct start date found');
    t.is(ta.getEnd(), new Date(2010, 1, 1, 10), 'Correct end date found');

    scheduler.destroy();

    t.verifyListeners(ta, 'timeAxis');
})

