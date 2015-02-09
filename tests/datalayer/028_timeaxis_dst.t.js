StartTest(function (t) {
    t.diag("Current timezone: " + t.getTimeZone())

    var DATE = Sch.util.Date;

    var ta, ticks

    var setup = function () {
        ta = new Sch.data.TimeAxis();

        ta.reconfigure({
            unit                : DATE.HOUR,
            increment           : 6,
            resolutionUnit      : DATE.HOUR,
            resolutionIncrement : 1,
            weekStartDay        : 1,
            mainUnit            : DATE.HOUR,
            shiftUnit           : DATE.HOUR,
            shiftIncrement      : 1,
            defaultSpan         : 1,

            start : new Date(2012, 2, 25),
            end   : new Date(2012, 2, 26)
        });

        ticks = ta.getTicks();
    }

    t.describe('Swedish Timezone tests', function (t) {
        if (Ext.Date.isDST(new Date(2012, 2, 25, 0)) || !Ext.Date.isDST(new Date(2012, 2, 26, 0))) {
            t.diag("Skipping the test because its supposed to run in the Swedish timezone")
            return
        }

        t.it('Day split by 6 hours, crossing DST time moves forward 1 hr', function (t) {
            setup()

            t.is(ticks.length, 4, '4 ticks in a days split by 6 hours');

            t.is(ticks[0].start, new Date(2012, 2, 25, 0), 'Increment 6 tick 0 start');
            t.is(ticks[0].end, new Date(2012, 2, 25, 7), 'Increment 6 tick 0 end');

            t.is(ticks[1].start, new Date(2012, 2, 25, 7), 'Increment 6 tick 1 start');
            t.is(ticks[1].end, new Date(2012, 2, 25, 12), 'Increment 6 tick 1 end');

            t.is(ticks[2].start, new Date(2012, 2, 25, 12), 'Increment 6 tick 2 start');
            t.is(ticks[2].end, new Date(2012, 2, 25, 18), 'Increment 6 tick 2 end');

            t.is(ticks[3].start, new Date(2012, 2, 25, 18), 'Increment 6 tick 3 start');
            t.is(ticks[3].end, new Date(2012, 2, 26, 0), 'Increment 6 tick 3 end');
        });

        t.it('Day split by 6 hours, start at 2pm, crossing DST time moves forward 1 hr', function (t) {
            setup()

            // reconfigure will reset the increment to 1 if its not provided in the config
            ta.reconfigure({
                increment : 6,
                start     : new Date(2012, 2, 24, 14),
                end       : new Date(2012, 2, 25, 14)
            });

            ticks = ta.getTicks();

            t.is(ticks.length, 4, '4 ticks in a days split by 6 hours');

            t.is(ticks[0].start, new Date(2012, 2, 24, 14), 'Increment 6 (2pm) tick 0 start');
            t.is(ticks[0].end, new Date(2012, 2, 24, 20), 'Increment 6 (2pm) tick 0 end');

            t.is(ticks[1].start, new Date(2012, 2, 24, 20), 'Increment 6 (2pm) tick 1 start');
            t.is(ticks[1].end, new Date(2012, 2, 25, 3), 'Increment 6 (2pm) tick 1 end');

            t.is(ticks[2].start, new Date(2012, 2, 25, 3), 'Increment 6 (2pm) tick 2 start');
            t.is(ticks[2].end, new Date(2012, 2, 25, 8), 'Increment 6 (2pm) tick 2 end');

            t.is(ticks[3].start, new Date(2012, 2, 25, 8), 'Increment 6 (2pm) tick 3 start');
            t.is(ticks[3].end, new Date(2012, 2, 25, 14), 'Increment 6 (2pm) tick 3 end');
        })

        t.it('Day split by 6 hours, crossing DST time moves backward 1 hr', function (t) {
            setup()

            ta.reconfigure({
                increment : 6,
                start     : new Date(2012, 9, 28),
                end       : new Date(2012, 9, 29)
            });

            ticks = ta.getTicks();

            t.is(ticks[0].start, new Date(2012, 9, 28, 0), 'Increment 6 tick 0 start, backwards');
            t.is(ticks[0].end, new Date(2012, 9, 28, 5), 'Increment 6 tick 0 end, backwards');

            t.is(ticks[1].start, new Date(2012, 9, 28, 5), 'Increment 6 tick 1 start, backwards');
            t.is(ticks[1].end, new Date(2012, 9, 28, 12), 'Increment 6 tick 1 end, backwards');

            t.is(ticks[2].start, new Date(2012, 9, 28, 12), 'Increment 6 tick 2 start, backwards');
            t.is(ticks[2].end, new Date(2012, 9, 28, 18), 'Increment 6 tick 2 end, backwards');

            t.is(ticks[3].start, new Date(2012, 9, 28, 18), 'Increment 6 tick 3 start, backwards');
            t.is(ticks[3].end, new Date(2012, 9, 29, 0), 'Increment 6 tick 3 end, backwards');
        })

        t.it('Day split by 5 hours, crossing DST time moves backward 1 hr', function (t) {
            setup()

            ta.reconfigure({
                start     : new Date(2012, 9, 28),
                end       : new Date(2012, 9, 29),
                increment : 5
            });

            ticks = ta.getTicks();

            t.is(ticks[0].start, new Date(2012, 9, 28, 0), 'Increment 5 tick 0 start, backwards');
            t.is(ticks[0].end, new Date(2012, 9, 28, 4), 'Increment 5 tick 0 end, backwards');

            t.is(ticks[1].start, new Date(2012, 9, 28, 4), 'Increment 5 tick 1 start, backwards');
            t.is(ticks[1].end, new Date(2012, 9, 28, 10), 'Increment 5 tick 1 end, backwards');

            t.is(ticks[2].start, new Date(2012, 9, 28, 10), 'Increment 5 tick 2 start, backwards');
            t.is(ticks[2].end, new Date(2012, 9, 28, 15), 'Increment 5 tick 2 end, backwards');

            t.is(ticks[3].start, new Date(2012, 9, 28, 15), 'Increment 5 tick 3 start, backwards');
            t.is(ticks[3].end, new Date(2012, 9, 28, 20), 'Increment 5 tick 3 end, backwards');
        })


        t.it('Day split by 10 hours, start at 23, crossing DST time moves forward 1 hr', function (t) {
            setup()

            ta.reconfigure({
                increment : 10,
                start     : new Date(2012, 2, 24, 23),
                end       : new Date(2012, 2, 26, 5)
            });

            ticks = ta.getTicks();


            // Without DST cross, 23 9 19 5
            // With DST Expected axis: 23 10 19 5
            t.is(ticks[0].start, new Date(2012, 2, 24, 23), 'Increment 10 tick 0 start');
            t.is(ticks[0].end, new Date(2012, 2, 25, 10), 'Increment 10 tick 0 end');

            t.is(ticks[1].start, new Date(2012, 2, 25, 10), 'Increment 10 tick 1 start');
            t.is(ticks[1].end, new Date(2012, 2, 25, 19), 'Increment 10 tick 1 end');

            t.is(ticks[2].start, new Date(2012, 2, 25, 19), 'Increment 10 tick 2 start');
            t.is(ticks[2].end, new Date(2012, 2, 26, 5), 'Increment 10 tick 2 end');
        })
    })

    t.it('Brazil timezone issue #1642 (GMT-0200 (BRST))', function (t) {
        var ta = new Sch.data.TimeAxis();

        ta.reconfigure({
            unit                : DATE.DAY,
            resolutionUnit      : DATE.DAY,
            resolutionIncrement : 1,
            mainUnit            : DATE.WEEK,
            weekStartDay        : 0,
            start               : new Date(2014, 9, 20),
            end                 : new Date(2015, 1, 19)
        });

        var dt          = new Date(2014, 9, 13);
        var firstTick   = ta.getTicks()[0];
        var pos         = ta.getTickFromDate(new Date(2014, 9, 13));

        t.is(ta.getStart().getDate(), 19, 'Axis should be "floored" to start date on previous Sunday')
        t.is(ta.getStart().getDay(), 0, 'Axis should be start on the provided start day')

        t.is(firstTick.end, new Date(2014, 9, 20), 'First tick should end on Monday 00:00')

        t.is(pos, -1)
    })
})
