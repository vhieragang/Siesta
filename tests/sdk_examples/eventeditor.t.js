StartTest(function (t) {
    var scheduler = t.cq1('schedulergrid');

    t.it('should render some events', function (t) {

        t.chain(
            { waitFor : 'eventsVisible' },

            function() {
                t.expect(t.cq1('schedulergrid actioncolumn').getWidth()).toBeLessThan(40);
            }
        );

    })

    t.it('should change timespan', function (t) {

        t.willFireNTimes(scheduler, 'viewchange', 2);

        t.chain(
            { click : ".icon-previous" },
            { click : ".icon-next" }
        );

    });

    t.it('should change orientation', function (t) {

        t.willFireNTimes(scheduler, 'orientationchange', 2);

        t.chain(
            { click : ".icon-vertical" },
            { click : ".icon-horizontal" }
        );

    })

    t.it('should clear all row events', function (t) {

        t.chain(
            { click   : Ext.grid.View.prototype.itemSelector + ":nth-child(1) .delete" },
            { waitFor : 'selectorNotFound', args : Ext.grid.View.prototype.itemSelector + ':nth-child(1) .sch-event' }
        );

    });

    t.it('should clear all events', function (t) {

        t.chain(
            { click   : ".icon-cleardatabase" },
            { waitFor : 'selectorNotFound', args : '.sch-event' }
        );

    });
});
