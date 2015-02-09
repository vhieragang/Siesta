StartTest(function (t) {
    Ext.define('Sch.__Line', {
        extend : 'Ext.data.Model',
        fields : [
            'Date',
            'Text',
            'Cls'
        ]
    });

    var lineStore = Ext.create('Ext.data.JsonStore', {
        model : 'Sch.__Line',
        data  : [
            {
                Date : new Date(2011, 0, 4, 12),
                Cls  : 'foo'
            },
            {
                Date : new Date(2011, 0, 5, 12),
                Cls  : 'foo'
            }
        ]
    });

    var scheduler = t.getScheduler({
        startDate : new Date(2011, 0, 3),
        endDate   : new Date(2011, 0, 13),

        plugins : Ext.create("Sch.plugin.Lines", {
            store : lineStore
        }),

        renderTo : document.body
    });

    t.chain(
        { waitFor : 'selector', args : ['.foo', scheduler.el] },
        { waitFor : 500 },

        // Buffered rendering
        { waitFor : 'selector', args : ['.foo', scheduler.el] },

        function (next, lineEls) {
            t.ok(lineEls.length === 2, 'Lines rendered ok, setting custom line CSS class works');

            var lineXY = Ext.fly(lineEls[0]).getXY();
            t.hasCls(Ext.Element.fromPoint(lineXY[0], lineXY[1] + 1), 'foo', 'Lines rendered on top of schedule');

            var date = scheduler.getSchedulingView().getDateFromXY(lineXY, 'round');
            t.isDateEqual(date, lineStore.first().get('Date'), 'Line rendered in correct place on the time axis');

            lineStore.add(new lineStore.model({
                Date : new Date(2011, 0, 6),
                Cls  : 'otherLineStyle'
            }));

            next();
        },

        { waitFor : 'selector', args : ['.otherLineStyle', scheduler.el] },

        function (next) {
            lineStore.first().set('Cls', 'Moooo');
            next();
        },

        { waitFor : 'selector', args : ['.Moooo', scheduler.el] }
    );
})
