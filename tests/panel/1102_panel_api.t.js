StartTest(function (t) {

    t.it('Basic API tests', function (t) {

        var scheduler = t.getScheduler({
            height     : 150, // Force vert scrollbar
            viewPreset : 'dayAndWeek',
            cls        : 'first',
            renderTo   : Ext.getBody(),
            startDate  : new Date(2000, 0, 1),
            endDate    : new Date(2000, 4, 1)
        });

        // http://www.sencha.com/forum/showthread.php?273800-4.2.2-Locking-grid-not-respecting-certain-cfg-s
        t.knownBugIn('5.1', function (t) {
            t.isStrict(scheduler.normalGrid.enableColumnMove, false, 'NormalGrid config setting enableColumnMove')
            t.isStrict(scheduler.normalGrid.enableColumnResize, false, 'NormalGrid config setting enableColumnResize')
            t.isStrict(scheduler.normalGrid.enableColumnHide, false, 'NormalGrid config setting enableColumnHide')
        })

        var viewEl = scheduler.getSchedulingView().el;

        t.ok(scheduler.getTimeAxis() instanceof Sch.data.TimeAxis, 'getTimeAxis ok');

        t.is(scheduler.getStart(), new Date(2000, 0, 1), 'setStart/getStart ok');

        t.chain(
            {
                waitFor : 'RowsVisible',
                args    : scheduler
            },

            function (next) {

                t.scrollVerticallyTo(viewEl, 10, next)
            },

            function (next) {
                scheduler.shiftNext(2);

                t.is(scheduler.getStart(), new Date(2000, 0, 3), 'shiftNext ok');

                t.is(viewEl.dom.scrollTop, 10, 'Normal grid: Vertical scroll intact after timeaxis update');

                scheduler.shiftPrevious(2);
                t.is(scheduler.getStart(), new Date(2000, 0, 1), 'shiftPrevious ok');

                scheduler.setEnd(new Date(2000, 1, 1));
                t.is(scheduler.getEnd(), new Date(2000, 1, 1), 'setEnd/getEnd ok');

                scheduler.goToNow();
                var today = new Date();
                today = Ext.Date.clearTime(today);
                t.is(scheduler.getStart(), today, 'goToNow ok');

                t.notOk(scheduler.isReadOnly(), 'getReadOnly ok');
                scheduler.setReadOnly(true);
                t.ok(scheduler.isReadOnly(), 'setReadOnly ok');

                scheduler.setTimeSpan(new Date(2000, 1, 1), new Date(2000, 2, 2));

                t.waitForScrollLeftChange(viewEl, next);
                scheduler.scrollToDate(new Date(2000, 2, 2), true);
            },
            function (next, scrollValue) {
                t.isGreater(scrollValue, 0, 'Scrolled right direction');
                scheduler.getSchedulingView().fitColumns();

                next()
            }
        )

        t.it('should fire item click as usual', function(t) {
            t.willFireNTimes(scheduler, 'itemclick', 2);

            t.chain(
                { click : '.first .x-grid-inner-locked .x-grid-view', offset : [20, '50%']},
                { click : '.first .sch-timelineview', offset : [20, '50%']}
            )
        })
    })

    t.it('Should change timespan if scrollToDate is called with a non-rendered date', function (t) {
        var scheduler = t.getScheduler({
            height    : 100,
            startDate : new Date(2010, 1, 1),
            endDate   : new Date(2010, 3, 1),
            renderTo  : document.body
        });

        t.chain(
            { waitForRowsVisible : scheduler },
            function () {
                t.waitForScrollLeftChange(scheduler.getSchedulingView().el, function () {
                    t.isGreater(scheduler.getSchedulingView().getHorizontalScroll(), 0, 'Should have scrolled too');
                });

                scheduler.scrollToDate(new Date(2008, 1, 1));

                t.ok(scheduler.timeAxis.dateInAxis(new Date(2008, 1, 1)), 'Timeaxis adjusted');
            }
        )
    })

    t.it('Should scroll date to center (without infinite scroll)', function (t) {
        var scheduler = t.getScheduler({
            height    : 100,
            startDate : new Date(2014, 0, 1),
            endDate   : new Date(2014, 1, 1),
            renderTo  : document.body
        });

        var view = scheduler.getSchedulingView();
        var date;

        t.chain(
            { waitFor : 100 },
            function (next) {
                date = new Date(2014, 2, 0);
                t.waitForEvent(view, 'scroll', next);
                scheduler.scrollToDateCentered(date);

            },
            function (next) {
                t.isApprox(scheduler.getViewportCenterDate(), date, 433000, 'Centered date is correct');
                next();
            },
            function (next) {
                date = new Date(2013, 11, 15);
                t.waitForEvent(view, 'scroll', next);
                scheduler.scrollToDateCentered(date);

            },
            function (next) {
                t.isApprox(scheduler.getViewportCenterDate(), date, 433000, 'Centered date is correct');
                next();
            },
            function (next) {
                date = new Date(2014, 0, 15);
                t.waitForEvent(view, 'scroll', next);
                scheduler.scrollToDateCentered(date);

            },
            function (next) {
                t.isApprox(scheduler.getViewportCenterDate(), date, 433000, 'Centered date is correct');
                next();
            },
            function (next) {
                scheduler.destroy();
                next();
            }
        );
    });

    t.it('Should scroll date to center (with infinite scroll)', function (t) {
        var scheduler = t.getScheduler({
            height         : 100,
            infiniteScroll : true,
            startDate      : new Date(2014, 0, 1),
            endDate        : new Date(2014, 1, 1),
            renderTo       : document.body
        });

        var view = scheduler.getSchedulingView();
        var date;

        t.chain(
            { waitFor : 100 },

            function (next) {
                date = new Date(2013, 11, 15);
                t.waitForEvent(view, 'scroll', next);
                scheduler.scrollToDateCentered(date);
            },

            function (next) {
                t.isApprox(scheduler.getViewportCenterDate(), date, 433000, 'Centered date is correct');

                date = new Date(2014, 3, 0);
                t.waitForEvent(view, 'scroll', next);
                scheduler.scrollToDateCentered(date);
            },

            function (next) {
                t.isApprox(scheduler.getViewportCenterDate(), date, 433000, 'Centered date is correct');

                date = new Date(2014, 5, 15);
                t.waitForEvent(view, 'scroll', next);
                scheduler.scrollToDateCentered(date);
            },

            function (next) {
                t.isApprox(scheduler.getViewportCenterDate(), date, 433000, 'Centered date is correct');

                scheduler.destroy();
                next();
            }
        );
    });

    t.it('Should scroll date to center (without infinite scroll)', function (t) {
        var scheduler = t.getScheduler({
            height    : 100,
            startDate : new Date(2014, 0, 1),
            endDate   : new Date(2014, 1, 1),
            renderTo  : document.body
        });

        var view = scheduler.getSchedulingView();
        var date;

        t.chain(
            { waitFor : 100 },
            function (next) {
                date = new Date(2014, 2, 0);
                t.waitForEvent(view, 'scroll', next);
                scheduler.scrollToDateCentered(date);

            },
            function (next) {
                t.isApprox(scheduler.getViewportCenterDate(), date, 433000, 'Centered date is correct');
                next();
            },
            function (next) {
                date = new Date(2013, 11, 15);
                t.waitForEvent(view, 'scroll', next);
                scheduler.scrollToDateCentered(date);

            },
            function (next) {
                t.isApprox(scheduler.getViewportCenterDate(), date, 433000, 'Centered date is correct');
                next();
            },
            function (next) {
                date = new Date(2014, 0, 15);
                t.waitForEvent(view, 'scroll', next);
                scheduler.scrollToDateCentered(date);

            },
            function (next) {
                t.isApprox(scheduler.getViewportCenterDate(), date, 433000, 'Centered date is correct');
                next();
            },
            function (next) {
                scheduler.destroy();
                next();
            }
        );
    });

    t.it('Should handle all weekStartDay options', function (t) {

        // Try a few of the presets using day or lower time unit
        Ext.Array.each(['hourAndDay', 'dayAndWeek', 'weekAndDayLetter'], function(preset) {

            t.diag(preset);

            // Try all weekStartDay options
            for (var weekStartDay = 0; weekStartDay < 7; weekStartDay++) {

                t.diag('Week starting: ' + Ext.Date.dayNames[weekStartDay]);

                for (var startDate = 0; startDate < 7; startDate++) {

                    // Try all week days as the startDate each weekStartDay option
                    var scheduler = t.getScheduler({
                        weekStartDay    : weekStartDay,
                        startDate       : new Date(2014, 3, 6 + startDate),
                        viewPreset      : preset
                    });

                    t.expect(scheduler.getStartDate().getDay()).toBe(preset === 'weekAndDayLetter' ? weekStartDay : startDate);
                    scheduler.destroy();
                }
            }
        })
    });

})    

