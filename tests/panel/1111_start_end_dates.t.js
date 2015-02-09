StartTest(function(t) {

    // Here we check that panel can get startDate and endDate from eventStore if they were not specified

    t.it('Panel takes start and end dates from event store', function (t) {
        var scheduler = t.getScheduler({
            renderTo        : Ext.getBody(),
            startDate       : null,
            endDate         : null,
            eventStore      : new Sch.data.EventStore({
                data : [
                    { StartDate : new Date(2011, 0, 4), EndDate : new Date(2011, 0, 5) },
                    { StartDate : new Date(2011, 0, 9), EndDate : new Date(2011, 0, 10) }
                ]
            })
        });

        t.is(scheduler.timeAxis.start, new Date(2011, 0, 4), 'proper start date set');
        t.is(scheduler.timeAxis.end, new Date(2011, 0, 10), 'proper end date set');
    });

    // Here we check that panel can get startDate and endDate from eventStore if they were not specified

    t.it('Panel handles an event store with 0 duration content (add a buffer of 1 timeAxis "main unit" to start and end respectively)', function (t) {
        var scheduler = t.getScheduler({
            renderTo        : Ext.getBody(),
            startDate       : null,
            endDate         : null,
            viewPreset      : 'weekAndDayLetter',
            eventStore      : new Sch.data.EventStore({
                data : [
                    { StartDate : new Date(2011, 0, 10), EndDate : new Date(2011, 0, 10) }
                ]
            })
        });

        // Add 1 w on each side of the milestone event
        t.is(scheduler.timeAxis.start, new Date(2011, 0, 3), 'proper start date set');
        t.is(scheduler.timeAxis.end, new Date(2011, 0, 17), 'proper end date set');
    });


    t.it('Panel prevents own refresh while event store is not loaded', function (t) {

        var scheduler = t.getScheduler({
            startDate   : null,
            endDate     : null,
            eventStore  : t.getEventStore({
                data        : null,
                autoLoad    : false,
                proxy       : {
                    url     : 'data/1111_data.js',
                    type    : 'ajax',
                    reader  : {
                        type : 'json',
                        rootProperty : 'events'
                    }
                }
            }),
            resourceStore  : t.getResourceStore({
                data        : null,
                autoLoad    : false,
                proxy       : {
                    url     : 'data/1111_data.js',
                    type    : 'ajax',
                    reader  : {
                        type : 'json',
                        rootProperty : 'resources'
                    }
                }
            }),
            renderTo    : Ext.getBody()
        });

        var view            = scheduler.getSchedulingView(),
            resourceStore   = scheduler.getResourceStore(),
            eventStore      = scheduler.getEventStore();

        // waiting for the very first refresh to complete to not interfere with other refreshes
        t.waitFor(function () { return view.viewReady; }, function () {

            t.willFireNTimes(view, 'refresh', 1, 'refresh event will be fired once');

            resourceStore.on('load', function () { eventStore.load(); });

            t.beginAsync();

            eventStore.on('load', function () {
                t.is(scheduler.timeAxis.start, new Date(2011, 0, 1), 'proper start date set');
                t.is(scheduler.timeAxis.end, new Date(2011, 0, 13), 'proper end date set');
                t.endAsync();
            });

            scheduler.resourceStore.load();

        });
    });


    t.it('Panel prevents own refresh while event store is not loaded (when event store gets loaded before resource store)', function (t) {

        var scheduler = t.getScheduler({
            startDate   : null,
            endDate     : null,
            eventStore  : t.getEventStore({
                data        : null,
                autoLoad    : false,
                proxy       : {
                    url     : 'data/1111_data.js',
                    type    : 'ajax',
                    reader  : {
                        type : 'json',
                        rootProperty : 'events'
                    }
                }
            }),
            resourceStore  : t.getResourceStore({
                data        : null,
                autoLoad    : false,
                proxy       : {
                    url     : 'data/1111_data.js',
                    type    : 'ajax',
                    reader  : {
                        type : 'json',
                        rootProperty : 'resources'
                    }
                }
            }),
            renderTo    : Ext.getBody()
        });

        var view            = scheduler.getSchedulingView(),
            resourceStore   = scheduler.getResourceStore(),
            eventStore      = scheduler.getEventStore();

        // waiting for the very first refresh to complete to not interfere with other refreshes
        t.waitFor(function () { return view.viewReady; }, function () {

            // we pass through the refreshes that happen when grid has no rows (resources store is empty)
            // 1st refresh will happen as the default load listener for event store
            // 2nd refresh will be caused by setTimeSpan()
            // 3rd refresh will be caused by resource store load
            t.willFireNTimes(view, 'refresh', 3, 'refresh event will be fired 3 times');

            eventStore.on('load', function () { resourceStore.load(); });

            var a = t.beginAsync();

            eventStore.on('load', function () {
                t.is(scheduler.timeAxis.start, new Date(2011, 0, 1), 'proper start date set');
                t.is(scheduler.timeAxis.end, new Date(2011, 0, 13), 'proper end date set');
            });
            
            resourceStore.on('load', function () {
                t.waitFor(100, function () { t.endAsync(a); });
            });

            eventStore.load();

        });
    });

    t.it('Panel gets start end dates from new events', function (t) {

        var scheduler = t.getScheduler({
            startDate   : null,
            endDate     : null,
            eventStore  : t.getEventStore({
                data        : []
            }),
            resourceStore  : t.getResourceStore({
                data        : [{ Id : 1, Name : 'foo' }]
            }),
            renderTo    : Ext.getBody()
        });

        var view            = scheduler.getSchedulingView(),
            eventStore      = scheduler.getEventStore();

        // waiting for the very first refresh to complete to not interfere with other refreshes
        t.waitFor(100, function () {

            t.willFireNTimes(view, 'refresh', 1, 'refresh event will be fired 1 times');

            eventStore.add(
                { Id : 10, ResourceId : 1, StartDate : new Date(2010, 1, 1), EndDate : new Date(2010, 2, 2), Cls : 'event-I' },
                { Id : 20, ResourceId : 1, StartDate : new Date(2010, 1, 10), EndDate : new Date(2010, 2, 12), Cls : 'event-II' }
            );

            t.is(scheduler.timeAxis.start, new Date(2010, 1, 1), 'proper start date set');
            t.is(scheduler.timeAxis.end, new Date(2010, 2, 12), 'proper end date set');

            t.selectorExists('.event-I', 'event #10 is rendered');
            t.selectorExists('.event-II', 'event #20 is rendered');

        });
    });


    t.it('Panel gets start end dates from new events', function (t) {

        var scheduler = t.getScheduler({
            startDate   : null,
            endDate     : null,
            eventStore  : t.getEventStore({
                data        : []
            }),
            resourceStore  : t.getResourceStore({
                data        : [{ Id : 1, Name : 'foo' }]
            }),
            renderTo    : Ext.getBody()
        });

        var view            = scheduler.getSchedulingView(),
            eventStore      = scheduler.getEventStore();

        // waiting for the very first refresh to complete to not interfere with other refreshes
        t.waitFor(100, function () {
            t.is(view.getNodes().length, 0, 'No rows before `setTimeSpan');

            t.willFireNTimes(view, 'refresh', 1, 'refresh event will be fired 1 times');

            scheduler.setTimeSpan(new Date(2010, 1, 1), new Date(2010, 1, 10));

            t.is(view.getNodes().length, 1, '1 row after setTimeSpan');
        });
    });

});

