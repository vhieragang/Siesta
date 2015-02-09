StartTest(function(t) {
    var scheduler = t.getScheduler({ renderTo : Ext.getBody() });
    var xy;
    var dx = 100;
    var dy = 100;

    t.chain(

        { drag : Ext.grid.View.prototype.itemSelector + ':nth-child(2) .sch-event', by : [10, 0], dragOnly : true },

        { waitFor : 'selector', args : '.sch-dragdrop-tip' },

        function(next, els) {
            var el = els[0];

            xy = Ext.fly(el).getXY();

            next()
        },
        { waitFor : 200 },

        { action : 'moveMouse', by : [dx, dy] },
        { waitFor : 200 },

        function(next) {
            var newXY = Ext.select('.sch-dragdrop-tip').first().getXY();

            t.isApprox(newXY[0], xy[0]+dx, 1, 'Tip moved horizontally');
            t.isApprox(newXY[1], xy[1]+dy, 1, 'Tip moved vertically');
            next()
        },

        { action : 'mouseUp' }
    );
})
