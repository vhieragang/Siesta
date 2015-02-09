StartTest(function(t) {
    t.diag("Current timezone: " + t.getTimeZone())

    var DATE        = Sch.util.Date

    t.it('Only for Brazil time zone', function (t) {

        if (new Date(2011, 9, 16).getHours() === 23 &&
            new Date(2011, 9, 16, 1).getTimezoneOffset() !== new Date(2011, 9, 16).getTimezoneOffset()
        ) {
            t.isDateEq(
                DATE.getStartOfNextDay(new Date(2011, 9, 15)),
                new Date(2011, 9, 16, 1),
                'Correct cross-DST next day found'
            )

            t.isDateEq(
                DATE.getStartOfNextDay(new Date(2011, 1, 19)),
                new Date(2011, 1, 20),
                'Correct cross-DST next day found'
            )
        }
    })

    t.it('Generating timeaxis in various configs should work full year, handling DST boundaries', function (t) {
        var oneYearFromNow = Ext.Date.add(new Date(), Ext.Date.YEAR, 1),
            DATE = Sch.util.Date;
    
        function testResolution(resolution, increment) {
            var cursor = new Date(),
                now = new Date();
    
            Ext.Date.clearTime(cursor);
    
            increment = increment || 1;
    
            while (cursor < oneYearFromNow) {
                cursor = DATE.add(cursor, resolution, increment);
            }
    
            t.pass('Forward one year using ' + resolution + ' resolution');
    
            while (cursor > now) {
                cursor = DATE.add(cursor, resolution, -increment);
            }
            t.pass('Backward one year using ' + resolution + ' resolution');
    
            cursor = new Date();
            while (cursor < oneYearFromNow) {
                cursor = DATE.getNext(cursor, resolution, increment, 1);
            }
            t.pass('Reached next year using getNext, with ' + resolution + ' resolution starting day Monday');
    
            cursor = new Date();
            while (cursor < oneYearFromNow) {
                cursor = DATE.getNext(cursor, resolution, increment, 0);
            }
            t.pass('Reached next year using getNext, with ' + resolution + ' resolution starting day Sunday');
        }
    
        t.diag('Making sure we can walk one year in all resolutions, thereby passing DST boundaries along the path')
    
        // Too slow
        //testResolution(DATE.SECOND);
    
        // skip testing
        if (!Ext.isIE9m) {
            testResolution(DATE.MINUTE);
            testResolution(DATE.HOUR);
            testResolution(DATE.HOUR, 2);
            testResolution(DATE.HOUR, 6);
        } else {
            t.diag("Skipped some resolutions because of slow JS engine")
        }
    
        testResolution(DATE.DAY);
        testResolution(DATE.WEEK);
        testResolution(DATE.MONTH);
    })

    t.it('Some dst scenario for `getNext`', function (t) {
        if (new Date(2010, 9, 17).getHours() === 23) {
            var next = DATE.getNext(new Date(2010, 9, 16), DATE.WEEK, 1, 0);
    
            t.is(next, new Date(2010, 9, 17, 1), 'Found following Sunday for getNext WEEK, adjusted +1 hr')
    
            t.is(DATE.getNext(next, DATE.WEEK, 1, 0), new Date(2010, 9, 24), 'Found following Sunday for getNext WEEK, readjusted to 00:00')
        }
    })

    
    t.it("getDurationInDays should work across DST", function (t) {
        // DST change in Moscow timezone, occurs 2001/03/25
        t.is(DATE.getDurationInDays(new Date(2001, 2, 23), new Date(2001, 2, 26)), 3, "3 days")
        
        t.is(DATE.getDurationInDays(new Date(2001, 2, 23), new Date(2006, 6, 1)), 1926, "3 days")
    })
})
