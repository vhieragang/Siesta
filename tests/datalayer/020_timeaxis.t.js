StartTest(function (t) {
    var DATE = Sch.util.Date;

    function getTimeAxis(config, t) {
        var ta = new Sch.data.TimeAxis();

        if (!config.start) {
            config.start = new Date(2012, 2, 25);
            config.end   = new Date(2012, 2, 26);
        }

        ta.reconfigure(Ext.apply({
            unit                : DATE.HOUR,
            increment           : 6,
            resolutionUnit      : DATE.HOUR,
            resolutionIncrement : 1,
            weekStartDay        : 1,
            mainUnit            : DATE.HOUR,
            shiftUnit           : DATE.HOUR,
            shiftIncrement      : 6,
            defaultSpan         : 1
        }, config || {}));

        if (ta.autoAdjust) {
            t.is(ta.visibleTickStart, 0, '`visibleTickStart` should be always 0 for `autoAdjust` case')
            t.is(ta.visibleTickEnd, ta.getCount(), '`visibleTickEnd` should be always a ticks number for `autoAdjust` case')
        } else {
            t.isGreater(ta.visibleTickStart, 0, '`visibleTickStart` should be always >= for not `autoAdjust` case')
            t.isLess(ta.visibleTickStart, 1, '`visibleTickStart` should be always < 1 for not `autoAdjust` case')

            t.isLE(ta.visibleTickEnd, ta.getCount(), '`visibleTickEnd` should be always <= ticks count for not `autoAdjust` case')
            t.isGreater(ta.visibleTickEnd, ta.getCount() - 1, '`visibleTickEnd` should be always > ticks count - 1 for not `autoAdjust` case')
        }

        return ta;
    }

    t.it('Basics', function (t) {
        var ta = new Sch.data.TimeAxis();
        t.is(ta.getStart(), null, 'Ok to ask for start date on a non configured axis');
        t.is(ta.getEnd(), null, 'Ok to ask for end date on a non configured axis');

        var ta = getTimeAxis({}, t);
        ta.setResolution(DATE.MINUTE, 11);
        t.isDeeply(ta.getResolution(), { unit : DATE.MINUTE, increment : 11}, 'setResolution/getResolution');

        t.is(ta.getUnit(), DATE.HOUR, 'getUnit');
        t.is(ta.getIncrement(), 6, 'getIncrement');

        t.notOk(ta.dateInAxis(new Date(2008, 1, 1)), 'dateInAxis false');
        t.ok(ta.dateInAxis(new Date(2012, 2, 25)), 'dateInAxis true');
        t.ok(ta.dateInAxis(new Date(2012, 2, 25, 23, 59)), 'dateInAxis true');
        t.notOk(ta.dateInAxis(new Date(2012, 2, 26)), 'dateInAxis false');

        t.ok(ta.timeSpanInAxis(new Date(2012, 2, 25), new Date(2012, 2, 26)), 'timeSpanInAxis true');
        t.ok(ta.timeSpanInAxis(new Date(2012, 2, 24), new Date(2012, 2, 26)), 'timeSpanInAxis true');
        t.ok(ta.timeSpanInAxis(new Date(2012, 2, 25), new Date(2012, 2, 27)), 'timeSpanInAxis true');
        t.notOk(ta.timeSpanInAxis(new Date(2011, 2, 25), new Date(2011, 2, 26)), 'timeSpanInAxis false');
    });

    t.it('Shifting', function (t) {
        var ta = getTimeAxis({
            start               : new Date(2012, 1, 25),
            end                 : new Date(2012, 1, 26)
        }, t);
        
        ta.shift(6, DATE.HOUR);
        t.is(ta.getStart(), new Date(2012, 1, 25, 6));
        t.is(ta.getEnd(), new Date(2012, 1, 26, 6));

        ta.shiftNext();
        t.is(ta.getStart(), new Date(2012, 1, 25, 12));
        t.is(ta.getEnd(), new Date(2012, 1, 26, 12));

        ta.shiftNext(6);
        t.is(ta.getStart(), new Date(2012, 1, 25, 18));
        t.is(ta.getEnd(), new Date(2012, 1, 26, 18));
        
        ta.shiftPrevious(12);
        t.is(ta.getStart(), new Date(2012, 1, 25, 6));
        t.is(ta.getEnd(), new Date(2012, 1, 26, 6));

        ta.shiftPrevious();
        t.is(ta.getStart(), new Date(2012, 1, 25, 0));
        t.is(ta.getEnd(), new Date(2012, 1, 26));
    });

    // Testing filtering
    t.it('Should be possible to filter the time axis', function (t) {
        var ta = getTimeAxis({}, t);

        ta.filterBy(function (tick) {
            return tick.start.getHours() === 0;
        });

        t.is(ta.getCount(), 1, '1 item in time axis after filtering');
        t.is(ta.first().get('start'), new Date(2012, 2, 25), 'Correct start of filtered tick');
        t.notOk(ta.isContinuous(), 'No longer a continuous time axis');

        ta.clearFilter();

        t.throwsOk(function() {
            window.console && (console.error = console.warn = Ext.emptyFn); // Get rid of warning
            ta.filterBy(function() { return false; });
        }, 'Invalid')
    });


    t.it('Should be possible to prevent a reconfigure action', function (t) {
        var ta = getTimeAxis({}, t);

        t.willFireNTimes(ta, 'reconfigure', 1);

        var fn = function () {
            return false;
        };

        ta.on('beforereconfigure', fn);

        ta.setTimeSpan(new Date(2011, 1, 1), new Date(2011, 5, 5));

        t.is(ta.getStart(), new Date(2012, 2, 25), 'Returned false from beforereconfigure handler, preventing actual reconfigure');

        ta.un('beforereconfigure', fn);

        t.isFiredWithSignature(ta, 'beforereconfigure', function (obs, start, end) {
            return obs === ta &&
                start - new Date(2012, 1, 1) === 0 &&
                end - new Date(2012, 1, 5) === 0;
        });

        ta.setTimeSpan(new Date(2012, 1, 1), new Date(2012, 1, 5));
    });
    
    t.it('roundDate', function (t) {
        t.it('SECOND', function (t) {
            var ta = getTimeAxis({
                unit                : DATE.MINUTE,
                increment           : 30,
                resolutionUnit      : DATE.SECOND,
                resolutionIncrement : 30,
                mainUnit            : DATE.MINUTE,
                start               : new Date(2012, 1, 1, 1),
                end                 : new Date(2012, 1, 2)
            }, t);
            
            t.expect(ta.roundDate(new Date(2012, 1, 1, 1, 1, 59), new Date(2012, 1, 1, 1, 1, 49))).toEqual(new Date(2012, 1, 1, 1, 1, 49));
            t.expect(ta.roundDate(new Date(2012, 1, 1, 1, 2, 20), new Date(2012, 1, 1, 1, 1, 49))).toEqual(new Date(2012, 1, 1, 1, 2, 19));
        });
        
        t.it('MINUTE', function (t) {
            var ta = getTimeAxis({
                unit                : DATE.MINUTE,
                increment           : 30,
                resolutionUnit      : DATE.MINUTE,
                resolutionIncrement : 10,
                mainUnit            : DATE.MINUTE,
                start               : new Date(2012, 1, 1, 1),
                end                 : new Date(2012, 1, 2)
            }, t);
            
            t.expect(ta.roundDate(new Date(2012, 1, 1, 1, 20), new Date(2012, 1, 1, 1, 18))).toEqual(new Date(2012, 1, 1, 1, 18));
            t.expect(ta.roundDate(new Date(2012, 1, 1, 1, 25), new Date(2012, 1, 1, 1, 18))).toEqual(new Date(2012, 1, 1, 1, 28));
        });
        
        t.it('HOUR', function (t) {
            var ta = getTimeAxis({
                unit                : DATE.DAY,
                increment           : 2,
                resolutionUnit      : DATE.HOUR,
                resolutionIncrement : 2,
                mainUnit            : DATE.DAY,
                start               : new Date(2012, 1, 1, 1),
                end                 : new Date(2012, 1, 20)
            }, t);
            
            t.expect(ta.roundDate(new Date(2012, 1, 1, 12), new Date(2012, 1, 1, 10))).toEqual(new Date(2012, 1, 1, 12));
            t.expect(ta.roundDate(new Date(2012, 1, 1, 13), new Date(2012, 1, 1, 10))).toEqual(new Date(2012, 1, 1, 14));
        });
        
        t.it('DAY', function (t) {
            var ta = getTimeAxis({
                unit                : DATE.MONTH,
                increment           : 4,
                resolutionUnit      : DATE.DAY,
                resolutionIncrement : 4,
                mainUnit            : DATE.DAY,
                start               : new Date(2012, 1, 1, 1),
                end                 : new Date(2012, 11, 20)
            }, t);
            
            t.expect(ta.roundDate(new Date(2012, 1, 10), new Date(2012, 1, 7))).toEqual(new Date(2012, 1, 11));
            t.expect(ta.roundDate(new Date(2012, 1, 8), new Date(2012, 1, 7))).toEqual(new Date(2012, 1, 7));
        });

        t.it('MONTH', function (t) {
            var ta = getTimeAxis({
                unit                : DATE.YEAR,
                increment           : 2,
                resolutionUnit      : DATE.MONTH,
                resolutionIncrement : 4,
                mainUnit            : DATE.MONTH,
                start               : new Date(2012, 1, 1, 1),
                end                 : new Date(2012, 11, 20)
            }, t);
            
            t.expect(ta.roundDate(new Date(2012, 2, 10), new Date(2012, 1, 7))).toEqual(new Date(2012, 1, 7));
            t.expect(ta.roundDate(new Date(2012, 3, 8), new Date(2012, 1, 7))).toEqual(new Date(2012, 5, 7));
        });
        
        t.it('YEAR', function (t) {
            var ta = getTimeAxis({
                unit                : DATE.YEAR,
                increment           : 4,
                resolutionUnit      : DATE.YEAR,
                resolutionIncrement : 2,
                mainUnit            : DATE.YEAR,
                start               : new Date(2010, 1, 1, 1),
                end                 : new Date(2024, 11, 20)
            }, t);
            
            t.expect(ta.roundDate(new Date(2012, 2), new Date(2011, 5))).toEqual(new Date(2011, 5));
            t.expect(ta.roundDate(new Date(2013, 3), new Date(2011, 5))).toEqual(new Date(2013, 5));
        });
    });

    t.describe('floorDate', function (t) {

        t.it('SECOND', function (t) {
            var ta = getTimeAxis({
                unit                : DATE.MINUTE,
                increment           : 30,
                resolutionUnit      : DATE.MINUTE,
                resolutionIncrement : 30,
                mainUnit            : DATE.MINUTE,
                start               : new Date(2012, 1, 1, 1),
                end                 : new Date(2012, 1, 2)
            }, t);

            // the actual unit/resolution unit of the time axis does not matter for `relativeToStart = false`
            t.expect(ta.floorDate(new Date(2012, 1, 1, 1, 1, 59), false, DATE.SECOND, 30)).toEqual(new Date(2012, 1, 1, 1, 1, 30));
            t.expect(ta.floorDate(new Date(2012, 1, 1, 2, 1, 1), false, DATE.SECOND, 30)).toEqual(new Date(2012, 1, 1, 2, 1, 0));
        });
        
        t.it('MINUTE', function (t) {
            var ta = getTimeAxis({
                unit                : DATE.MINUTE,
                increment           : 30,
                resolutionUnit      : DATE.MINUTE,
                resolutionIncrement : 30,
                mainUnit            : DATE.MINUTE,
                start               : new Date(2012, 1, 1, 1),
                end                 : new Date(2012, 1, 2)
            }, t);

            t.expect(ta.floorDate(new Date(2012, 1, 1, 1, 29, 10), false, DATE.MINUTE)).toEqual(new Date(2012, 1, 1, 1, 0));
            t.expect(ta.floorDate(new Date(2012, 1, 1, 1, 59, 10), false, DATE.MINUTE)).toEqual(new Date(2012, 1, 1, 1, 30));

            t.expect(ta.floorDate(new Date(2012, 1, 1, 1, 59), true, DATE.MINUTE)).toEqual(new Date(2012, 1, 1, 1, 30));
            t.expect(ta.floorDate(new Date(2012, 1, 1, 2, 1), true, DATE.MINUTE)).toEqual(new Date(2012, 1, 1, 2, 0));
            
            // the actual unit/resolution unit of the time axis does not matter for `relativeToStart = false`
            t.expect(ta.floorDate(new Date(2012, 1, 1, 1, 59), false, DATE.MINUTE, 30)).toEqual(new Date(2012, 1, 1, 1, 30));
            t.expect(ta.floorDate(new Date(2012, 1, 1, 2, 1), false, DATE.MINUTE, 30)).toEqual(new Date(2012, 1, 1, 2, 0));
        });

        t.it('HOUR', function (t) {
            var ta = getTimeAxis({
                unit                : DATE.HOUR,
                increment           : 2,
                resolutionUnit      : DATE.HOUR,
                resolutionIncrement : 2,
                mainUnit            : DATE.HOUR,
                start               : new Date(2012, 1, 1),
                end                 : new Date(2012, 1, 2)
            }, t);

            t.expect(ta.floorDate(new Date(2012, 1, 1, 1), false, DATE.HOUR, 1)).toEqual(new Date(2012, 1, 1, 1));
            t.expect(ta.floorDate(new Date(2012, 1, 1, 1), false, DATE.HOUR, 2)).toEqual(new Date(2012, 1, 1, 0));
            t.expect(ta.floorDate(new Date(2012, 1, 1, 1, 59), false, DATE.HOUR, 1)).toEqual(new Date(2012, 1, 1, 1));
            t.expect(ta.floorDate(new Date(2012, 1, 1, 1, 59), false, DATE.HOUR, 2)).toEqual(new Date(2012, 1, 1, 0));
            t.expect(ta.floorDate(new Date(2012, 1, 1, 2, 59), false, DATE.HOUR)).toEqual(new Date(2012, 1, 1, 2));
            t.expect(ta.floorDate(new Date(2012, 1, 1, 3, 59), true, DATE.HOUR)).toEqual(new Date(2012, 1, 1, 2));
        });

        t.it('DAY', function (t) {
            var ta = getTimeAxis({
                unit                : DATE.DAY,
                increment           : 2,
                resolutionUnit      : DATE.HOUR,
                resolutionIncrement : 2,
                mainUnit            : DATE.DAY,
                start               : new Date(2012, 1, 1),
                end                 : new Date(2012, 1, 6)
            }, t);

            t.expect(ta.floorDate(new Date(2012, 1, 1, 1, 1, 1), false, DATE.DAY)).toEqual(new Date(2012, 1, 1, 0));
            t.expect(ta.floorDate(new Date(2012, 1, 5, 1, 1, 1), false, DATE.DAY, 3)).toEqual(new Date(2012, 1, 4, 0));
            t.expect(ta.floorDate(new Date(2012, 1, 4, 1, 1, 1), false, DATE.DAY, 3)).toEqual(new Date(2012, 1, 4, 0));
            t.expect(ta.floorDate(new Date(2012, 1, 3, 1, 1, 1), false, DATE.DAY, 3)).toEqual(new Date(2012, 1, 1, 0));
            
            t.expect(ta.floorDate(new Date(2012, 1, 3, 18), true, DATE.DAY)).toEqual(new Date(2012, 1, 3));
            t.expect(ta.floorDate(new Date(2012, 1, 4, 18), true, DATE.DAY)).toEqual(new Date(2012, 1, 3));
            t.expect(ta.floorDate(new Date(2012, 1, 3, 19), true, DATE.HOUR)).toEqual(new Date(2012, 1, 3, 18));
        });

        t.it('WEEK starting Monday', function (t) {
            var ta = getTimeAxis({
                unit                : DATE.WEEK,
                weekStartDay        : 1,
                increment           : 1,
                resolutionUnit      : DATE.DAY,
                resolutionIncrement : 1,
                mainUnit            : DATE.WEEK,
                start               : new Date(2014, 3, 1)
            }, t);

            t.expect(ta.floorDate(new Date(2014, 3, 1), false)).toEqual(new Date(2014, 2, 31));
            t.expect(ta.floorDate(new Date(2014, 3, 2), false)).toEqual(new Date(2014, 2, 31));
            t.expect(ta.floorDate(new Date(2014, 3, 3), false)).toEqual(new Date(2014, 2, 31));
            t.expect(ta.floorDate(new Date(2014, 3, 4), false)).toEqual(new Date(2014, 2, 31));
            t.expect(ta.floorDate(new Date(2014, 3, 5), false)).toEqual(new Date(2014, 2, 31));
            t.expect(ta.floorDate(new Date(2014, 3, 6), false)).toEqual(new Date(2014, 2, 31));
            t.expect(ta.floorDate(new Date(2014, 3, 7), false)).toEqual(new Date(2014, 3, 7));
        });

        t.it('WEEK starting Tuesday', function (t) {
            var ta = getTimeAxis({
                unit                : DATE.WEEK,
                weekStartDay        : 2,
                increment           : 1,
                resolutionUnit      : DATE.DAY,
                resolutionIncrement : 1,
                mainUnit            : DATE.WEEK,
                start               : new Date(2014, 3, 1)
            }, t);

            t.expect(ta.floorDate(new Date(2014, 3, 1), false)).toEqual(new Date(2014, 3, 1));
            t.expect(ta.floorDate(new Date(2014, 3, 2), false)).toEqual(new Date(2014, 3, 1));
            t.expect(ta.floorDate(new Date(2014, 3, 3), false)).toEqual(new Date(2014, 3, 1));
            t.expect(ta.floorDate(new Date(2014, 3, 4), false)).toEqual(new Date(2014, 3, 1));
            t.expect(ta.floorDate(new Date(2014, 3, 5), false)).toEqual(new Date(2014, 3, 1));
            t.expect(ta.floorDate(new Date(2014, 3, 6), false)).toEqual(new Date(2014, 3, 1));
            t.expect(ta.floorDate(new Date(2014, 3, 7), false)).toEqual(new Date(2014, 3, 1));
        });

        t.it('WEEK starting Wednesday', function (t) {
            var ta = getTimeAxis({
                unit                : DATE.WEEK,
                weekStartDay        : 3,
                increment           : 1,
                resolutionUnit      : DATE.DAY,
                resolutionIncrement : 1,
                mainUnit            : DATE.WEEK,
                start               : new Date(2014, 3, 1)
            }, t);

            t.expect(ta.floorDate(new Date(2014, 3, 1), false)).toEqual(new Date(2014, 2, 26));
            t.expect(ta.floorDate(new Date(2014, 3, 2), false)).toEqual(new Date(2014, 3, 2));
            t.expect(ta.floorDate(new Date(2014, 3, 3), false)).toEqual(new Date(2014, 3, 2));
            t.expect(ta.floorDate(new Date(2014, 3, 4), false)).toEqual(new Date(2014, 3, 2));
            t.expect(ta.floorDate(new Date(2014, 3, 5), false)).toEqual(new Date(2014, 3, 2));
            t.expect(ta.floorDate(new Date(2014, 3, 6), false)).toEqual(new Date(2014, 3, 2));
            t.expect(ta.floorDate(new Date(2014, 3, 7), false)).toEqual(new Date(2014, 3, 2));
        });

        t.it('WEEK starting Thursday', function (t) {
            var ta = getTimeAxis({
                unit                : DATE.WEEK,
                weekStartDay        : 4,
                increment           : 1,
                resolutionUnit      : DATE.DAY,
                resolutionIncrement : 1,
                mainUnit            : DATE.WEEK,
                start               : new Date(2014, 3, 1)
            }, t);

            t.expect(ta.floorDate(new Date(2014, 3, 1), false)).toEqual(new Date(2014, 2, 27));
            t.expect(ta.floorDate(new Date(2014, 3, 2), false)).toEqual(new Date(2014, 2, 27));
            t.expect(ta.floorDate(new Date(2014, 3, 3), false)).toEqual(new Date(2014, 3, 3));
            t.expect(ta.floorDate(new Date(2014, 3, 4), false)).toEqual(new Date(2014, 3, 3));
            t.expect(ta.floorDate(new Date(2014, 3, 5), false)).toEqual(new Date(2014, 3, 3));
            t.expect(ta.floorDate(new Date(2014, 3, 6), false)).toEqual(new Date(2014, 3, 3));
            t.expect(ta.floorDate(new Date(2014, 3, 7), false)).toEqual(new Date(2014, 3, 3));

        });

        t.it('WEEK starting Friday', function (t) {
                var ta = getTimeAxis({
                unit                : DATE.WEEK,
                weekStartDay        : 5,
                increment           : 1,
                resolutionUnit      : DATE.DAY,
                resolutionIncrement : 1,
                mainUnit            : DATE.WEEK,
                start               : new Date(2014, 3, 1)
            }, t);

            t.expect(ta.floorDate(new Date(2014, 3, 1), false)).toEqual(new Date(2014, 2, 28));
            t.expect(ta.floorDate(new Date(2014, 3, 2), false)).toEqual(new Date(2014, 2, 28));
            t.expect(ta.floorDate(new Date(2014, 3, 3), false)).toEqual(new Date(2014, 2, 28));
            t.expect(ta.floorDate(new Date(2014, 3, 4), false)).toEqual(new Date(2014, 3, 4));
            t.expect(ta.floorDate(new Date(2014, 3, 5), false)).toEqual(new Date(2014, 3, 4));
            t.expect(ta.floorDate(new Date(2014, 3, 6), false)).toEqual(new Date(2014, 3, 4));
            t.expect(ta.floorDate(new Date(2014, 3, 7), false)).toEqual(new Date(2014, 3, 4));
        });

        t.it('WEEK starting Saturday', function (t) {
            var ta = getTimeAxis({
                unit                : DATE.WEEK,
                weekStartDay        : 6,
                increment           : 1,
                resolutionUnit      : DATE.DAY,
                resolutionIncrement : 1,
                mainUnit            : DATE.WEEK,
                start               : new Date(2014, 3, 1)
            }, t);

            t.expect(ta.floorDate(new Date(2014, 3, 1), false)).toEqual(new Date(2014, 2, 29));
            t.expect(ta.floorDate(new Date(2014, 3, 2), false)).toEqual(new Date(2014, 2, 29));
            t.expect(ta.floorDate(new Date(2014, 3, 3), false)).toEqual(new Date(2014, 2, 29));
            t.expect(ta.floorDate(new Date(2014, 3, 4), false)).toEqual(new Date(2014, 2, 29));
            t.expect(ta.floorDate(new Date(2014, 3, 5), false)).toEqual(new Date(2014, 3, 5));
            t.expect(ta.floorDate(new Date(2014, 3, 6), false)).toEqual(new Date(2014, 3, 5));
            t.expect(ta.floorDate(new Date(2014, 3, 7), false)).toEqual(new Date(2014, 3, 5));
        });

        t.it('WEEK starting Sunday', function (t) {
                var ta = getTimeAxis({
                unit                : DATE.WEEK,
                weekStartDay        : 0,
                increment           : 1,
                resolutionUnit      : DATE.DAY,
                resolutionIncrement : 1,
                mainUnit            : DATE.WEEK,
                start               : new Date(2014, 3, 1)
            }, t);

            t.expect(ta.floorDate(new Date(2014, 3, 1), false)).toEqual(new Date(2014, 2, 30));
            t.expect(ta.floorDate(new Date(2014, 3, 2), false)).toEqual(new Date(2014, 2, 30));
            t.expect(ta.floorDate(new Date(2014, 3, 3), false)).toEqual(new Date(2014, 2, 30));
            t.expect(ta.floorDate(new Date(2014, 3, 4), false)).toEqual(new Date(2014, 2, 30));
            t.expect(ta.floorDate(new Date(2014, 3, 5), false)).toEqual(new Date(2014, 2, 30));
            t.expect(ta.floorDate(new Date(2014, 3, 6), false)).toEqual(new Date(2014, 3, 6));
            t.expect(ta.floorDate(new Date(2014, 3, 7), false)).toEqual(new Date(2014, 3, 6));
        });
        
        t.it('YEAR', function (t) {
            var ta = getTimeAxis({
                unit                : DATE.YEAR,
                increment           : 5,
                resolutionUnit      : DATE.HOUR,
                resolutionIncrement : 2,
                mainUnit            : DATE.DAY,
                start               : new Date(2012, 1, 1),
                end                 : new Date(2012, 1, 6)
            }, t);

            t.expect(ta.floorDate(new Date(2012, 1, 1, 1, 1, 1), false, DATE.YEAR, 5)).toEqual(new Date(2011, 0, 1, 0));
            t.expect(ta.floorDate(new Date(2015, 1, 1, 1, 1, 1), false, DATE.YEAR, 5)).toEqual(new Date(2011, 0, 1, 0));
            t.expect(ta.floorDate(new Date(2016, 1, 1, 1, 1, 1), false, DATE.YEAR, 5)).toEqual(new Date(2016, 0, 1, 0));
            t.expect(ta.floorDate(new Date(2020, 1, 1, 1, 1, 1), false, DATE.YEAR, 5)).toEqual(new Date(2016, 0, 1, 0));
        });
    })

    t.it('Should reconfigure after setTimeSpan called with current span', function (t) {
        var ta = getTimeAxis({
            unit                : DATE.HOUR,
            increment           : 2,
            resolutionUnit      : DATE.HOUR,
            resolutionIncrement : 2,
            mainUnit            : DATE.HOUR,
            start               : new Date(2012, 1, 1),
            end                 : new Date(2012, 1, 2)
        }, t);

        t.ok(ta.isContinuous(), 'Continuous time axis');

        t.it('Should not fire when passed exactly the dates of the timeaxis', function(t) {
            t.wontFire(ta, 'reconfigure');
            ta.setTimeSpan(ta.getStart(), ta.getEnd());
        })

        t.it('Should not fire when passed dates that will be floored/ceiled to match those of the timeaxis', function(t) {
            t.wontFire(ta, 'reconfigure');
            ta.setTimeSpan(ta.getStart(), new Date(ta.getEnd()-1));
        })
    })

    t.it('getDateFromTick', function (t) {
        var ta = getTimeAxis({
            unit                : DATE.HOUR,
            increment           : 1,
            resolutionUnit      : DATE.MINUTE,
            resolutionIncrement : 10,
            mainUnit            : DATE.HOUR,
            start               : new Date(2012, 1, 1),
            end                 : new Date(2012, 1, 2)
        }, t);

        t.is(ta.getCount(), 24, '24h in a day');

        t.is(ta.getDateFromTick(0), new Date(2012, 1, 1));
        t.is(ta.getDateFromTick(0.5), new Date(2012, 1, 1, 0, 30));

        t.is(ta.getDateFromTick(0.2), new Date(2012, 1, 1, 0, 12));
        t.is(ta.getDateFromTick(0.2, 'round'), new Date(2012, 1, 1, 0, 10));
        t.is(ta.getDateFromTick(0.2, 'floor'), new Date(2012, 1, 1, 0, 10));

        t.is(ta.getDateFromTick(24), new Date(2012, 1, 2));

        t.is(ta.getDateFromTick(25), null);
        t.is(ta.getDateFromTick(-1), null);
    })

    t.it('getTickFromDate', function (t) {
        var ta = getTimeAxis({
            unit                : DATE.HOUR,
            increment           : 1,
            resolutionUnit      : DATE.MINUTE,
            resolutionIncrement : 10,
            mainUnit            : DATE.HOUR,
            start               : new Date(2012, 1, 1),
            end                 : new Date(2012, 1, 2)
        }, t);

        t.is(ta.getTickFromDate(new Date(2012, 1, 1)), 0);
        t.is(ta.getTickFromDate(new Date(2012, 1, 1, 0, 30)), 0.5);

        t.is(ta.getTickFromDate(new Date(2012, 1, 1, 0, 12)), 0.2);
        t.is(ta.getTickFromDate(new Date(2012, 1, 1, 0, 24)), 0.4);
        t.is(ta.getTickFromDate(new Date(2012, 1, 1, 0, 36)), 0.6);

        t.is(ta.getTickFromDate(new Date(2012, 1, 2)), 24);

        t.is(ta.getTickFromDate(new Date(2011, 1, 1)), -1);
        t.is(ta.getTickFromDate(new Date(2013, 1, 1)), -1);
    })

    t.it('getTickFromDate when ticks are not whole (`autoAdjust : false`)', function (t) {
        var ta = getTimeAxis({
            autoAdjust          : false,
            mainUnit            : DATE.WEEK,
            unit                : DATE.WEEK,
            increment           : 1,
            resolutionUnit      : DATE.DAY,
            resolutionIncrement : 10,
            start               : new Date(2013, 8, 1),
            end                 : new Date(2014, 2, 1)
        }, t);

        t.is(ta.getTickFromDate(new Date(2013, 8, 0)), -1, 'Point outside of the time axis results in -1');
        t.is(ta.getTickFromDate(new Date(2014, 2, 1, 0, 30)), -1, 'Point outside of the time axis results in -1');

        t.is(ta.getTickFromDate(new Date(2013, 8, 1)), ta.visibleTickStart, 'The tick of the time span start should be equal to `visibleTickStart');
        t.is(ta.getTickFromDate(new Date(2014, 2, 1)), ta.visibleTickEnd, 'The end of the time span start should be equal to `visibleTickEnd');
        
        t.is(ta.getTickFromDate(new Date(2013, 8, 2)), 1, 'The start of the 2nd (full) tick should be at 1');
        t.is(ta.getDateFromTick(1), new Date(2013, 8, 2), 'The opposite conversion should work')
        
        t.is(ta.getDateFromTick(ta.visibleTickStart), new Date(2013, 8, 1))
        t.is(ta.getDateFromTick(ta.visibleTickEnd), new Date(2014, 2, 1))
    })
    
    t.it('getTickFromDate when ticks are not whole (`autoAdjust : false`) and increment is > 1', function (t) {
        var ta = getTimeAxis({
            autoAdjust          : false,
            mainUnit            : DATE.DAY,
            unit                : DATE.DAY,
            increment           : 5,
            resolutionUnit      : DATE.DAY,
            resolutionIncrement : 10,
            start               : new Date(2014, 0, 1, 12),
            end                 : new Date(2014, 0, 12)
        }, t);
        
        t.is(ta.adjustedEnd, new Date(2014, 0, 16), 'Correctly adjusted the end of timeaxis according to increment')

        t.is(ta.getTickFromDate(new Date(2014, 0, 0)), -1, 'Point outside of the time axis results in -1');
        t.is(ta.getTickFromDate(new Date(2014, 0, 12, 0, 30)), -1, 'Point outside of the time axis results in -1');

        t.is(ta.getTickFromDate(new Date(2014, 0, 1, 12)), ta.visibleTickStart, 'The tick of the time span start should be equal to `visibleTickStart');
        t.is(ta.getTickFromDate(new Date(2014, 0, 12)), ta.visibleTickEnd, 'The end of the time span start should be equal to `visibleTickEnd');
        
        t.is(ta.getTickFromDate(new Date(2014, 0, 6)), 1, 'The start of the 2nd (full) tick should be at 1');
        t.is(ta.getDateFromTick(1), new Date(2014, 0, 6), 'The opposite conversion should work')
        
        t.is(ta.getDateFromTick(ta.visibleTickStart), new Date(2014, 0, 1, 12))
        t.is(ta.getDateFromTick(ta.visibleTickEnd), new Date(2014, 0, 12))
    })
    
    
    t.it('getTicks', function (t) {
        var ta = getTimeAxis({
            unit                : DATE.HOUR,
            increment           : 1,
            resolutionUnit      : DATE.MINUTE,
            resolutionIncrement : 10,
            mainUnit            : DATE.HOUR,
            start               : new Date(2012, 1, 1),
            end                 : new Date(2012, 1, 2)
        }, t);

        var ticks = ta.getTicks();

        t.is(ticks.length, 24);
        t.is(ticks[0].start, new Date(2012, 1, 1));
        t.is(ticks[0].end, new Date(2012, 1, 1, 1));
    })
    
    t.it('forEachAuxInterval + autoAdjust : false', function (t) {
        var ta = getTimeAxis({
            autoAdjust          : false,
            unit                : DATE.HOUR,
            increment           : 1,
            resolutionUnit      : DATE.MINUTE,
            resolutionIncrement : 10,
            mainUnit            : DATE.HOUR,
            start               : new Date(2012, 1, 1, 15, 15),
            end                 : new Date(2012, 1, 1, 17, 25)
        }, t);
        
        var ticks = ta.getTicks();

        t.is(ticks[ 0 ].start, new Date(2012, 1, 1, 15, 15));
        t.is(ticks[ ticks.length - 1 ].end, new Date(2012, 1, 1, 17, 25));
        
        ta.forEachAuxInterval(Sch.util.Date.HOUR, 1, function (start, end, i) {
            switch (i) {
                case 0 : 
                    t.is(start, new Date(2012, 1, 1, 15, 15))
                    t.is(end, new Date(2012, 1, 1, 16))
                break
                case 2 : 
                    t.is(start, new Date(2012, 1, 1, 17))
                    t.is(end, new Date(2012, 1, 1, 17, 25))
                break
            }
        })
    })
    
})
