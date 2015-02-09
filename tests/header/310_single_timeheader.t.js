StartTest(function (t) {
    t.diag('Double clicking any time header row should fire an event');

    Sch.preset.Manager.registerPreset("foo", {
        timeColumnWidth   : 35,
        rowHeight         : 32,
        displayDateFormat : 'G:i',
        shiftIncrement    : 1,
        shiftUnit         : "DAY",
        timeResolution    : {
            unit      : "MINUTE",
            increment : 15
        },
        defaultSpan       : 24,
        headerConfig      : {
            bottom : {
                unit       : "HOUR",
                increment  : 2,
                dateFormat : 'G'
            },
            middle : {
                unit       : "DAY",
                increment  : 1,
                dateFormat : 'd M'
            },
            top    : {
                unit       : "MONTH",
                increment  : 1,
                dateFormat : 'd M Y'
            }
        }
    });

    var scheduler = t.getScheduler({
        viewPreset  : 'foo',
        renderTo    : Ext.getBody(),
        startDate   : new Date(2011, 1, 1),
        endDate     : new Date(2011, 1, 1, 12)
    });

    t.willFireNTimes(scheduler, 'timeheaderdblclick', 3);

    t.it('should size tables correctly', function(t) {
        var normalGrid = scheduler.normalGrid
        var headerCt = normalGrid.headerCt

        var timeAxisColWidth = headerCt.items.first().getWidth();

        t.isGE(headerCt.el.select('table').getCount(), 3, '3 tables found');
        var table = headerCt.el.down('table');

        t.isGE(table.getWidth(), timeAxisColWidth, 'Correct width for top table')
        t.isGE(table.next().getWidth(), timeAxisColWidth, 'Correct width for mid table')
        t.isGE(table.next().next().getWidth(), timeAxisColWidth, 'Correct width for bottom table')

        var table = headerCt.el.down('table.sch-header-row-top');

        t.is(table.down('td').dom.style.width, table.dom.style.width, 'Correct width for top table td')

        var table = headerCt.el.down('table.sch-header-row-middle');
        t.is(table.down('td').dom.style.width, table.dom.style.width, 'Correct width for mid table td')
    })

    t.chain(
        function(next) {

            scheduler.on('timeheaderdblclick', function (col, start, end, e) {
                t.ok(col instanceof Sch.view.HorizontalTimeAxis, 'Bottom row header ok');
                t.isDateEqual(start, new Date(2011, 1, 1, 0), 'StartDate ok');
                t.isDateEqual(end, new Date(2011, 1, 1, 2), 'EndDate ok');
                t.ok(!!e.getTarget, 'e ok');

                next()
            }, null, { single : true });

            t.doubleClick('.sch-header-row-bottom .sch-column-header', Ext.emptyFn);
        },

        function(next) {
            scheduler.on('timeheaderdblclick', function (col, start, end, e) {
                t.ok(col instanceof Sch.view.HorizontalTimeAxis, 'Middle row header ok');
                t.isDateEqual(start, new Date(2011, 1, 1, 0), 'StartDate ok');
                t.isDateEqual(end, new Date(2011, 1, 2), 'EndDate ok');
                t.ok(!!e.getTarget, 'e ok');

                next()
            }, null, { single : true });

            t.doubleClick('.sch-header-row-middle .sch-column-header', Ext.emptyFn);
        },

        function(next) {
            scheduler.on('timeheaderdblclick', function (col, start, end, e) {
                t.ok(col instanceof Sch.view.HorizontalTimeAxis, 'Top row header ok');
                t.isDateEqual(start, new Date(2011, 1, 1, 0), 'StartDate ok');
                t.isDateEqual(end, new Date(2011, 1, 2), 'EndDate ok');
                t.ok(!!e.getTarget, 'e ok');

                next()
            }, null, { single : true });

            t.doubleClick('.sch-header-row-top .sch-column-header', Ext.emptyFn);
        }
    );
})    
