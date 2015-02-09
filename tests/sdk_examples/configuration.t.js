StartTest(function(t) {

    t.chain(
        { waitFor : 'eventsVisible' },

        function(next) {
            var cmp = t.cq1('schedulergrid');

            t.willFireNTimes(cmp, 'viewchange', 11);

            cmp.on('viewchange', function() {
                t.is(cmp.getSchedulingView().getRowHeight(), 35,'Row height should be constant')
            })
            next();
        },

        { click : ">> button[text=Seconds]" },
        { click : ">> button[text=Minutes]" },
        { click : ">> button[text=Hours]" },
        { click : ">> button[text=Days]" },
        { click : ">> button[text=Weeks]" },
        { click : ">> button[text=Weeks 2]" },
        { click : ">> button[text=Weeks 3]" },
        { click : ">> button[text=Months]" },
        { click : ">> button[text=Years]" },
        { click : ">> button[text=Years 2]" },
        { click : ">> button[text=Day and night shift (custom)]" }
    );
});
