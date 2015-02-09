StartTest(function(t) {
    t.chain(
        { waitFor : "EventsVisible", args : [] },

        function (next) {
            var view = t.cq1('schedulerpanel').getSchedulingView();
            var slider = t.cq1('#rowHeightSlider');
            t.is(view.getRowHeight(), slider.getValue(), 'slider initial value');

            next();
        },

        { action : "drag", target : "#rowHeightSlider-thumb-0", by : [-16, 3], offset : [6, 5] },

        function (next) {
            var view = t.cq1('schedulerpanel').getSchedulingView();
            var slider = t.cq1('#rowHeightSlider');
            t.is(view.getRowHeight(), slider.getValue(), 'rowHeight should decrease');

            next();
        },

        { action : "drag", target : "#marginSlider-thumb-0", by : [-92, 0], offset : [6, 7] },

        function (next) {
            t.isLess(Ext.getBody().down('.sch-event').getHeight(), 5, 'event height should increase');

            next();
        }
    );
});
