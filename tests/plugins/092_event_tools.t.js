StartTest(function (t) {

    t.it('Basic show/hide', function (t) {
        var plug = new Sch.plugin.EventTools({
            items : [
                { type : 'details', handler : Ext.emptyFn, tooltip : 'Show Event Details' },
                { type : 'foooo', handler : Ext.emptyFn, tooltip : 'Show Event Details' },
                { type : 'bar', handler : Ext.emptyFn, tooltip : 'Show Event Details' }
            ]
        });

        var schedulerPanel = t.getScheduler({
            renderTo : document.body,
            plugins  : plug,
            height   : 200
        });

        t.chain(
            { waitFor : 'EventsVisible' },

            function (next) {
                t.willFireNTimes(plug, 'show', 2);
                t.willFireNTimes(plug, 'hide', 2);

                next();
            },
            { action : 'moveCursorTo', target : '.sch-event' },
            { action : 'moveCursorTo', target : '.sch-column-header' },
            { waitFor : 1000 },
            { action : 'moveCursorTo', target : '.sch-event' },
            { action : 'moveCursorTo', target : '.sch-column-header' },
            { waitFor : 1000 }
        );
    })

    t.it('No visible tools should prevent the show', function (t) {

        var plug = new Sch.plugin.EventTools({
            items : [
                { type : 'details', handler : Ext.emptyFn, tooltip : 'Show Event Details', visibleFn : function() { return false; } }
            ]
        });

        var schedulerPanel = t.getScheduler({
            renderTo : document.body,
            cls      : 'second-schedule',
            plugins  : plug,
            height   : 200
        });

        t.wontFire(plug, 'show');

        t.chain(
            { waitFor : 'rowsVisible', args : schedulerPanel },
            { action : 'moveCursorTo', target : '.second-schedule .sch-event' }
        );
    });
});
