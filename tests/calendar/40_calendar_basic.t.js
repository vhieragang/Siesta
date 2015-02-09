StartTest(function (t) {
    var scheduler, event, event1, event2;

    var setup = function (config) {
        scheduler && scheduler.destroy();

        scheduler = t.getScheduler(Ext.apply({
            orientation : 'calendar',
            startDate   : new Date(2014, 4, 28),
            eventStore  : t.getEventStore({
                data    : [{
                    Id          : 1,
                    StartDate   : new Date(2014, 4, 28, 2),
                    EndDate     : new Date(2014, 4, 28, 4),
                    ResourceId  : 'r1',
                    Name        : 'Test'
                }]
            }),
            renderTo    : Ext.getBody(),
            eventRenderer : function (eventRec, resourceRec, templateData) {
                 templateData.cls = 'event-' + eventRec.getId();
            },
            onEventCreated : function (event) {
                event.setId(this.eventStore.last().getId() + 1);
            }
        }, config));

        event   = scheduler.eventStore.getById(1);
    }

    t.it('Should render week', function (t) {
        setup();

        t.chain(
            { waitForEventsToRender : scheduler },
            function (next) {
                var columns = scheduler.normalGrid.columnManager.getColumns();
                t.is(columns.length, 7, '7 column rendered');

                t.it('Column are fine', function (t) {
                    var start = scheduler.timeAxis.getStart();

                    for (var i = 0; i < columns.length; i++) {
                        t.is(columns[i].start, Sch.util.Date.add(start, 'd', i), 'Column start is correct');
                        t.is(columns[i].end, Sch.util.Date.add(start, 'd', i + 1), 'Column end is correct');
                    }
                });

                var eventEl = scheduler.el.down('.event-1');

                t.ok(eventEl.up('.x-grid-cell-inner').getWidth() - eventEl.getWidth() <= 4, 'Event width is correct');

                t.is(scheduler.normalGrid.getStore().getCount(), scheduler.lockedGrid.getStore().getCount(), 'Rows amount is equal');

                next();
            }
        );
    });

    t.it('Drag drop should work correct', function (t) {
        setup();

        t.chain(
            { waitForEventsToRender : scheduler },
            function (next) {
                scheduler.normalGrid.columnManager.getColumns()[0].setWidth(100);
                scheduler.normalGrid.columnManager.getColumns()[1].setWidth(100);
                next();
            },
            { drag : '.event-1', offset : [20, 20], by : [-40, 0] },
            function (next) {
                var event = scheduler.eventStore.getAt(0);
                t.is(event.getStartDate(), new Date(2014, 4, 27, 2), 'Event start date is correct');
                next();
            },
            { drag : '.event-1', offset : [20, 20], by : [-40, 0] },
            function (next) {
                var event = scheduler.eventStore.getAt(0);
                t.is(event.getStartDate(), new Date(2014, 4, 26, 2), 'Event start date is correct');
                next();
            }
        );
    });

    t.it('Drag create should work correct', function (t) {
        setup();

        t.chain(
            { waitForEventsToRender : scheduler },
            // drag create
            { action : "drag", target : function () { 
                    return t.safeSelect(".x-grid-item-container > table:nth-child(3) .sch-timetd", scheduler.el.dom); 
                }, offset : [20, 5], by : [0, 31], dragOnly : true
            },
            function (next) {
                t.isApprox(scheduler.el.down('.sch-dragcreator-proxy').getWidth(), 100, 1, 'Proxy width is correct');
                next();
            },
            { action : 'mouseUp' },
            function (next) {
                event1 = scheduler.eventStore.last();
                t.is(event1.getStartDate(), new Date(2014, 4, 26, 2), 'Start date is correct');
                t.is(event1.getEndDate(), new Date(2014, 4, 26, 3), 'End date is correct');
                // TODO: append resource check
                next();
            },
//            // drag create
            { action : "drag", target : function () {
                    return t.safeSelect(".x-grid-item-container > table:nth-child(4) .sch-timetd", scheduler.el.dom);
                }, offset : [97, 8], by : [-4, 30]
            },
            function (next) {
                event2 = scheduler.eventStore.last();
                t.is(event2.getStartDate(), new Date(2014, 4, 26, 3), 'Start date is correct');
                t.is(event2.getEndDate(), new Date(2014, 4, 26, 4), 'End date is correct');
                // TODO: append resource check
                next();
            },
            { action : "drag", target : ".sch-event", by : [1, 21] },
            { waitFor : 1000 },
            function (next) {
                t.is(event1.getStartDate(), new Date(2014, 4, 26, 2, 30), 'Start date is correct');
                t.is(event1.getEndDate(), new Date(2014, 4, 26, 3, 30), 'End date is correct');

                var events = t.getFirstScheduleCellEl(scheduler).query('.sch-event');
                Ext.each(events, function (event) {
                    t.isApprox(Ext.fly(event).getWidth(), 50, 1, 'Event width is correct');
                });
                next();
            }
        );
    });

    t.it('getDateFromCoordinate works correct', function (t) {
        setup();

        t.chain(
            { waitForEventsToRender : scheduler },
            function (next) {
                scheduler.normalGrid.columnManager.getColumns()[0].setWidth(100);
                scheduler.normalGrid.columnManager.getColumns()[1].setWidth(100);

                var view = scheduler.getSchedulingView();
                t.is(view.getDateFromCoordinate([0, 0], null, true), scheduler.getStartDate(), 'Date from coordinate is correct');

                var columnWidth = scheduler.normalGrid.columnManager.getColumns()[0].getWidth();
                t.is(view.getDateFromCoordinate([columnWidth, 0], null, true), Sch.util.Date.add(scheduler.getStartDate(), 'd', 1), 'Date from coordinate is correct');

                // todo check bottom right corner
            }
        )
    });

    t.it('Should react and refresh view if scheduler is resized', function (t) {
        scheduler && scheduler.destroy();

        scheduler = t.getScheduler({
            mode        : 'calendar',
            width       : 600,
            renderTo    : Ext.getBody(),
            startDate   : new Date(2014, 4, 26),
            eventStore  : t.getEventStore({
                data    : [{
                    Id          : 1,
                    StartDate   : new Date(2014, 4, 26, 2),
                    EndDate     : new Date(2014, 4, 26, 4)
                }]
            })
        });

        function verifyFit() {
            var totalColWidth = 0;

            Ext.Array.each(scheduler.query('weekview-day'), function(col) {
                totalColWidth += col.getWidth();
            });

            t.isApprox(totalColWidth, scheduler.normalGrid.getWidth(), 'Columns should be fit to the available space');
        }

        var event, eventWidth;

        t.chain(
            { waitForEventsToRender : scheduler },
            { waitFor : 500 },
            function (next) {
                event       = scheduler.el.down('.sch-event');
                eventWidth  = event.getWidth();

                verifyFit();

                // event element is rendered to have 2px from left/right sides
                t.isApprox(event.getWidth(), scheduler.down('weekview-day').getWidth(), 5, 'Event should match the column width');

                scheduler.setWidth(500);

                next();
            },
            { waitFor : 100 },
            function (next) {

                event       = scheduler.el.down('.sch-event');

                t.isLess(event.getWidth(), eventWidth, 'Event width should decrease');

                verifyFit();
            }
        )
    });

    t.it('View preset should be consumed corectly', function (t) {
        scheduler && scheduler.destroy();

        var startDate = new Date(2014, 4, 26);

        scheduler = t.getScheduler({
            mode        : 'calendar',
            width       : 600,
            renderTo    : Ext.getBody(),
            startDate   : new Date(2014, 4, 26),
            eventStore  : t.getEventStore({
                data    : [{
                    Id          : 1,
                    StartDate   : new Date(2014, 4, 26, 2),
                    EndDate     : new Date(2014, 4, 26, 4)
                }]
            })
        });

        t.chain(
            { waitForEventsToRender : scheduler },
            function (next) {
                t.waitForEvent(scheduler.timeAxisViewModel, 'reconfigure', next);
                scheduler.switchViewPreset('day', scheduler.timeAxis.getStart(), scheduler.timeAxis.getEnd());
            },
            function (next) {
                t.isApprox(scheduler.el.down('.sch-event').getWidth(), scheduler.normalGrid.down('gridcolumn').getWidth() - 4, 1, 'Width is correct');

                t.waitForEvent(scheduler.timeAxisViewModel, 'reconfigure', next);
                scheduler.switchViewPreset('week', scheduler.timeAxis.getStart(), scheduler.timeAxis.getEnd());
            },
            function (next) {
                t.isApprox(scheduler.el.down('.sch-event').getWidth(), scheduler.normalGrid.down('gridcolumn').getWidth() - 4, 1, 'Width is correct');
            }
        );
    });

});