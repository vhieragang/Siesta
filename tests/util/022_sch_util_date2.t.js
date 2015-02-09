StartTest(function(t) {
    var D = Sch.util.Date;

    t.describe("Sch.util.Date#getDurationInUnit()", function(t) {
        t.is(D.getDurationInUnit(new Date(2010, 1, 1, 0, 0), new Date(2012, 1, 1),          D.YEAR),    2,      'YEAR');
        t.is(D.getDurationInUnit(new Date(2010, 0, 1, 0, 0), new Date(2010, 6, 1),          D.QUARTER), 2,      'QUARTER');
        t.is(D.getDurationInUnit(new Date(2010, 1, 1, 0, 0), new Date(2010, 6, 1),          D.MONTH),   5,      'MONTH');
        t.is(D.getDurationInUnit(new Date(2012, 0, 2, 0, 0), new Date(2012, 0, 16),         D.WEEK),    2,      'WEEK');
        t.is(D.getDurationInUnit(new Date(2010, 1, 1, 0, 0), new Date(2010, 1, 6),          D.DAY),     5,      'DAY');
        t.is(D.getDurationInUnit(new Date(2010, 1, 1, 0, 0), new Date(2010, 1, 1, 10),      D.HOUR),    10,     'HOUR');
        t.is(D.getDurationInUnit(new Date(2010, 1, 1, 0, 0), new Date(2010, 1, 1, 0, 1),    D.MINUTE),  1,      'MINUTE');
        t.is(D.getDurationInUnit(new Date(2010, 1, 1, 0, 0), new Date(2010, 1, 1, 0, 1),    D.SECOND),  60,     'SECOND');
        t.is(D.getDurationInUnit(new Date(2010, 1, 1, 0, 0), new Date(2010, 1, 1, 0, 1),    D.MILLI),   60000,  'MILLI');
    });

    t.describe("Sch.util.Date#compareWithPrecision() method", function(t) {

        t.it("Should compare date with given precision which is often corresponds to a time unit", function(t) {
            t.ok(
                D.compareWithPrecision(new Date(), new Date()) === 0 &&
                D.compareWithPrecision(new Date(2014, 7, 18, 12, 30), new Date(2014, 7, 18, 12, 31)) === -1 &&
                D.compareWithPrecision(new Date(2014, 7, 18, 12, 31), new Date(2014, 7, 18, 12, 30)) === +1,
                "Comparison with default precision works"
            );

            t.ok(
                D.compareWithPrecision(new Date(2014, 7, 18, 12, 30, 10, 500), new Date(2014, 7, 18, 12, 30, 10, 600), D.SECOND) ===  0 &&
                D.compareWithPrecision(new Date(2014, 7, 18, 12, 30, 10, 500), new Date(2014, 7, 18, 12, 30, 11, 500), D.SECOND) === -1 &&
                D.compareWithPrecision(new Date(2014, 7, 18, 12, 30, 11, 500), new Date(2014, 7, 18, 12, 30, 10, 500), D.SECOND) === +1,
                "Comparison with second precision works"
            );

            t.ok(
                D.compareWithPrecision(new Date(2014, 7, 18, 12, 30, 10, 500), new Date(2014, 7, 18, 12, 30, 20, 600), D.MINUTE) ===  0 &&
                D.compareWithPrecision(new Date(2014, 7, 18, 12, 30, 10, 500), new Date(2014, 7, 18, 12, 31, 20, 500), D.MINUTE) === -1 &&
                D.compareWithPrecision(new Date(2014, 7, 18, 12, 31, 11, 500), new Date(2014, 7, 18, 12, 30, 10, 500), D.MINUTE) === +1,
                "Comparison with minute precision works"
            );

            t.ok(
                D.compareWithPrecision(new Date(2014, 7, 18, 12, 30, 10, 500), new Date(2014, 7, 18, 12, 40, 20, 600), D.HOUR) ===  0 &&
                D.compareWithPrecision(new Date(2014, 7, 18, 12, 30, 10, 500), new Date(2014, 7, 18, 13, 31, 20, 500), D.HOUR) === -1 &&
                D.compareWithPrecision(new Date(2014, 7, 18, 13, 31, 11, 500), new Date(2014, 7, 18, 12, 30, 10, 500), D.HOUR) === +1,
                "Comparison with hour precision works"
            );

            t.ok(
                D.compareWithPrecision(new Date(2014, 7, 18, 12, 30, 10, 500), new Date(2014, 7, 18, 12, 40, 20, 600), D.DAY) ===  0 &&
                D.compareWithPrecision(new Date(2014, 7, 18, 23, 59, 10, 500), new Date(2014, 7, 19,  0,  0,  1, 500), D.DAY) === -1 &&
                D.compareWithPrecision(new Date(2014, 7, 19,  0,  0,  1, 500), new Date(2014, 7, 18, 23, 59, 10, 500), D.DAY) === +1,
                "Comparison with day precision works"
            );

            t.ok(
                D.compareWithPrecision(new Date(2014, 7, 18, 12, 30, 10, 500), new Date(2014, 7, 20, 12, 40, 20, 600), D.WEEK) ===  0 &&
                D.compareWithPrecision(new Date(2014, 7, 16, 12, 30, 10, 500), new Date(2014, 7, 19, 13, 31, 20, 500), D.WEEK) === -1 &&
                D.compareWithPrecision(new Date(2014, 7, 19, 13, 31, 11, 500), new Date(2014, 7, 16, 12, 30, 10, 500), D.WEEK) === +1,
                "Comparison with week precision works"
            );

            t.ok(
                D.compareWithPrecision(new Date(2014, 7, 18, 12, 30, 10, 500), new Date(2014, 7, 20, 12, 40, 20, 600), D.MONTH) ===  0 &&
                D.compareWithPrecision(new Date(2014, 7, 16, 12, 30, 10, 500), new Date(2014, 8, 19, 13, 31, 20, 500), D.MONTH) === -1 &&
                D.compareWithPrecision(new Date(2014, 8, 19, 13, 31, 11, 500), new Date(2014, 7, 16, 12, 30, 10, 500), D.MONTH) === +1,
                "Comparison with month precision works"
            );

            t.ok(
                D.compareWithPrecision(new Date(2014,  7, 18, 12, 30, 10, 500), new Date(2014,  8, 20, 12, 40, 20, 600), D.QUARTER) ===  0 &&
                D.compareWithPrecision(new Date(2014,  7, 16, 12, 30, 10, 500), new Date(2014, 10, 19, 13, 31, 20, 500), D.QUARTER) === -1 &&
                D.compareWithPrecision(new Date(2014, 10, 19, 13, 31, 11, 500), new Date(2014,  7, 16, 12, 30, 10, 500), D.QUARTER) === +1,
                "Comparison with quarter precision works"
            );

            t.ok(
                D.compareWithPrecision(new Date(2014,  7, 18, 12, 30, 10, 500), new Date(2014,  8, 20, 12, 40, 20, 600), D.YEAR) ===  0 &&
                D.compareWithPrecision(new Date(2014,  7, 16, 12, 30, 10, 500), new Date(2015, 10, 19, 13, 31, 20, 500), D.YEAR) === -1 &&
                D.compareWithPrecision(new Date(2015, 10, 19, 13, 31, 11, 500), new Date(2014,  7, 16, 12, 30, 10, 500), D.YEAR) === +1,
                "Comparison with year precision works"
            );
        });
    });
});
