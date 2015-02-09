StartTest(function(t) {
    var ta = new Sch.data.TimeAxis({
        continuous : false
    });

    ta.reconfigure({
        unit    : Sch.util.Date.DAY,
        start   : new Date(2012, 2, 25),
        end     : new Date(2012, 2, 26)
    });

    t.ok(ta.timeSpanInAxis(new Date(2012, 2, 25), new Date(2012, 2, 26)), 'Time span matching time axis start end should be "in axis"');
    t.ok(ta.timeSpanInAxis(new Date(2012, 2, 24), new Date(2012, 2, 26)), 'Time span starting before time axis start should be "in axis"');
    t.ok(ta.timeSpanInAxis(new Date(2012, 2, 25), new Date(2012, 2, 27)), 'Time span ending after time axis end should be "in axis"');
    t.ok(ta.timeSpanInAxis(new Date(2012, 2, 24), new Date(2012, 2, 27)), 'Time span starting before and ending after time axis end should be "in axis"');
})    
