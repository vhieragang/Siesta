StartTest(function (t) {

    // See issue #1432 for further information.
    //
    // It appears that on all browsers but IE10 (at the time of writing) any event started at the  div.sch-resourcezone
    // element has it's immediate target as div.x-grid-cell-inner (i.e. a resource zone div parent element) 
    // whereas in IE10 it's the div.sch-resourcezone (i.e. actual resource zone div). All resource zone events are
    // intercepted and dispatched as scheduler view/panel event inside the handleScheduleEvent() method, each event
    // was filtered via 
    //
    //    var t = e.getTarget('.' + this.timeCellCls, 2);
    //
    // where timeCellCls is 'sch-timed'. The limit 2 was fine for the case when event's immediate target 
    // is div.x-grid-cell-inner, but for IE10 limit 2 is exhausted at div.x-grid-cell-inner element, since the
    // search's started at div.sch-resourcezone, thus it never reaches td.sch-timed.
    //
    // So the fix is to simply raise the limit to 3, and it might be reasonable to raise it up to 10 or more, 
    // since a user might have further markup inside a resource zone div. And if she has then 'schedule{Event}' events
    // of the schedule view/panel might not be fired again due to the same reason.

    t.it('Resource zones event propogation tests (#1432).', function (t) {

        var eventStore = t.getEventStore({
                data : [
                    { Id : 'e10', ResourceId : 'r2', Name : 'Assignment 1', StartDate : "2011-01-03", EndDate : "2011-01-05"}
                ]
            }),

            zoneStore = new Sch.data.EventStore({
                data  : [
                    {
                        StartDate  : new Date(2011, 0, 2),
                        EndDate    : new Date(2011, 0, 6),
                        ResourceId : 'r1',
                        Cls        : 'myZoneStyle'
                    }
                ]
            }),

            scheduler = t.getScheduler({
                height        : 200,
                width         : 400,
                startDate     : new Date(2011, 0, 2),
                endDate       : new Date(2011, 0, 6),
                viewPreset    : 'dayAndWeek',
                forceFit      : true,
                resourceZones : zoneStore,
                eventStore    : eventStore
            });

        scheduler.render(Ext.getBody());

        t.firesOk(scheduler, 'scheduleclick', 1, 'Resource zone events are reachable');
        t.firesOk(scheduler, 'eventclick', 1, 'Event click is fired');

        t.chain(
            // Clicking anywhere on the first row (completely covered by resource zone) should trigger 1 'scheduleclick'
            { click : '.sch-timetd' },

            // This should trigger 1 'eventclick' and no 'scheduleclick'
            { click : '.sch-event' }
        );
    });

});
