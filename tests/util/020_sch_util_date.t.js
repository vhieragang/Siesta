StartTest(function(t) {

    //======================================================================================================================================================================================================================================================
    t.diag('Sanity')

    t.ok(Sch.util.Date, "Sch.util.Date is here")

    var DATE        = Sch.util.Date

    t.ok(DATE.betweenLesser(new Date(2010, 1, 1), new Date(2010, 1, 1), new Date(2010, 1, 2)), 'betweenLesser reports YES for same start')
    t.notOk(DATE.betweenLesser(new Date(2010, 1, 2), new Date(2010, 1, 1), new Date(2010, 1, 2)), 'betweenLesser reports NO for same end')

    t.is(DATE.constrain(new Date(2010, 1, 1), new Date(2010, 1, 1), new Date(2010, 1, 1)), new Date(2010, 1, 1), 'constrain reports ok for same date');
    t.is(DATE.constrain(new Date(2011, 1, 1), new Date(2010, 1, 1), new Date(2010, 1, 1)), new Date(2010, 1, 1), 'constrain reports ok for later date');
    t.is(DATE.constrain(new Date(2009, 1, 1), new Date(2010, 1, 1), new Date(2010, 1, 1)), new Date(2010, 1, 1), 'constrain reports ok for earlier date');

    t.ok(DATE.intersectSpans(new Date(2010, 1, 1), new Date(2010, 1, 2), new Date(2010, 1, 1), new Date (2010, 1, 2)), 'intersectSpans reports true for same dates')
    t.ok(DATE.intersectSpans(new Date(2010, 1, 1), new Date(2011, 1, 2), new Date(2011, 1, 1), new Date (2011, 1, 12)), 'intersectSpans reports true for partial overlap')
    t.notOk(DATE.intersectSpans(new Date(2010, 1, 1), new Date(2010, 1, 2), new Date(2010, 1, 2), new Date (2010, 1, 3)), 'intersectSpans reports false for same dates')

    //======================================================================================================================================================================================================================================================
    t.diag('Sch.util.Date#compareUnits')

    t.is(DATE.compareUnits(DATE.MINUTE, DATE.YEAR), -1, "Minute is less than year")
    t.is(DATE.compareUnits(DATE.YEAR, DATE.MINUTE), 1, "YEAR is bigger than minute")



    //======================================================================================================================================================================================================================================================
    t.diag('Sch.util.Date#getUnitToBaseUnitRatio')


    t.is(DATE.getUnitToBaseUnitRatio(DATE.WEEK, DATE.DAY),      1 / 7, 'Correct WEEK/DAY ratio')
    t.is(DATE.getUnitToBaseUnitRatio(DATE.SECOND, DATE.MILLI),  1 / 1000, 'Correct SECOND/MILLI ratio')
    t.is(DATE.getUnitToBaseUnitRatio(DATE.QUARTER, DATE.MONTH), 1 / 3, 'Correct QUARTER/MONTH ratio')
    t.is(DATE.getUnitToBaseUnitRatio(DATE.YEAR, DATE.MONTH),    1 / 12, 'Correct YEAR/MONTH ratio')
    t.is(DATE.getUnitToBaseUnitRatio(DATE.YEAR, DATE.QUARTER),  1 / 4, 'Correct YEAR/QUARTER ratio')

    t.is(DATE.getUnitToBaseUnitRatio(DATE.DAY, DATE.WEEK),      7 / 1, 'Correct DAY/WEEK ratio')
    t.is(DATE.getUnitToBaseUnitRatio(DATE.MILLI, DATE.SECOND),  1000 / 1, 'Correct MILLI/SECOND ratio')
    t.is(DATE.getUnitToBaseUnitRatio(DATE.MONTH, DATE.QUARTER), 3 / 1, 'Correct MONTH/QUARTER ratio')
    t.is(DATE.getUnitToBaseUnitRatio(DATE.MONTH, DATE.YEAR),    12 / 1, 'Correct MONTH/YEAR ratio')
    t.is(DATE.getUnitToBaseUnitRatio(DATE.QUARTER, DATE.YEAR),  4 / 1, 'Correct QUARTER/YEAR ratio')


    t.isDateEq(DATE.getNext(new Date(2011, 6, 15), DATE.MONTH, 1), new Date(2011, 7, 1), 'Correct `getNext()` call for months')

    //======================================================================================================================================================================================================================================================
    t.diag('Sch.util.Date#add')

    var base = new Date(2010, 0, 10);

    t.is(DATE.add(base, DATE.MILLI,     2), new Date(2010, 0, 10, 0, 0, 0, 2), 'Add MILLI');
    t.is(DATE.add(base, DATE.SECOND,    2), new Date(2010, 0, 10, 0, 0, 2), 'Add SECOND');
    t.is(DATE.add(base, DATE.MINUTE,    2), new Date(2010, 0, 10, 0, 2), 'Add MINUTE');
    t.is(DATE.add(base, DATE.HOUR,      2), new Date(2010, 0, 10, 2), 'Add HOUR');
    t.is(DATE.add(base, DATE.DAY,       2), new Date(2010, 0, 12), 'Add DAY');
    t.is(DATE.add(base, DATE.WEEK,      2), new Date(2010, 0, 24), 'Add WEEK');
    t.is(DATE.add(base, DATE.MONTH,     2), new Date(2010, 2, 10), 'Add MONTH');
    t.is(DATE.add(base, DATE.QUARTER,   2), new Date(2010, 6, 10), 'Add QUARTER');
    t.is(DATE.add(base, DATE.YEAR,      2), new Date(2012, 0, 10), 'Add YEAR');

    //======================================================================================================================================================================================================================================================
    t.diag('Sch.util.Date#getNext')

    base = new Date(2010, 0, 10);

    t.is(DATE.getNext(new Date(2010, 0, 10), DATE.MILLI,     2), new Date(2010, 0, 10, 0, 0, 0, 2), 'getNext MILLI');

    t.is(DATE.getNext(new Date(2010, 0, 10), DATE.SECOND,    2), new Date(2010, 0, 10, 0, 0, 2), 'getNext SECOND');

    t.is(DATE.getNext(new Date(2010, 0, 10, 0, 2, 30), DATE.MINUTE,    2), new Date(2010, 0, 10, 0, 4), 'getNext MINUTE');
    t.is(DATE.getNext(new Date(2010, 0, 10, 0, 0, 1), DATE.MINUTE,    2), new Date(2010, 0, 10, 0, 2), 'getNext MINUTE #2');

    t.is(DATE.getNext(new Date(2010, 0, 10, 0, 1, 1), DATE.HOUR,      2), new Date(2010, 0, 10, 2), 'getNext HOUR');
    t.is(DATE.getNext(new Date(2010, 0, 10), DATE.HOUR,      2), new Date(2010, 0, 10, 2), 'getNext HOUR #2');

    t.is(DATE.getNext(new Date(2010, 0, 10), DATE.DAY,       2), new Date(2010, 0, 12), 'getNext DAY');
    t.is(DATE.getNext(new Date(2010, 0, 10, 1, 1, 1, 1), DATE.DAY,       2), new Date(2010, 0, 12), 'getNext DAY #2');

    t.is(DATE.getNext(base, DATE.WEEK,      1), new Date(2010, 0, 11), 'getNext WEEK');
    t.is(DATE.getNext(new Date(2010, 0, 10, 1, 1, 1), DATE.WEEK,      1), new Date(2010, 0, 11), 'getNext WEEK');
    t.is(DATE.getNext(new Date(2010, 0, 4), DATE.WEEK,      1, 0), new Date(2010, 0, 10), 'getNext WEEK Sunday');
    t.is(DATE.getNext(new Date(2010, 0, 4), DATE.WEEK,      2), new Date(2010, 0, 18), 'getNext WEEK #2');
    t.is(DATE.getNext(new Date(2010, 0, 4), DATE.WEEK,      2, 3), new Date(2010, 0, 13), 'getNext WEEK #2 Wednesday');
    t.is(DATE.getNext(new Date(2010, 0, 9), DATE.WEEK,      1, 0), new Date(2010, 0, 10), 'getNext WEEK #2 Saturday');

    t.is(DATE.getNext(base, DATE.MONTH,     2), new Date(2010, 2, 1), 'getNext MONTH');
    t.is(DATE.getNext(new Date(2010, 0, 4), DATE.MONTH,     1), new Date(2010, 1, 1), 'getNext MONTH');

    t.is(DATE.getNext(new Date(2012, 2, 15), DATE.QUARTER,   1), new Date(2012, 3, 1), 'getNext QUARTER');
    t.is(DATE.getNext(new Date(2010, 2, 15), DATE.QUARTER,   2), new Date(2010, 6, 1), 'getNext QUARTER #2');

    t.is(DATE.getNext(base, DATE.YEAR,      2), new Date(2012, 0, 1), 'getNext YEAR');

    //======================================================================================================================================================================================================================================================
    t.diag('Sch.util.Date#timeSpanContains')

    var d1 = new Date(2012, 2, 15),
        d2 = new Date(2012, 2, 16);

    t.ok(DATE.timeSpanContains(d1, d2, d1, d2), 'Completely overlapping spans are ok');
    t.notOk(DATE.timeSpanContains(d1, d2, d1, new Date(2012, 2, 16, 0, 0, 0, 1)), 'Not overlapping entirely');
})
