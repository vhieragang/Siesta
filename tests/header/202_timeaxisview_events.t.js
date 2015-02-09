StartTest(function (t) {
    Sch.preset.Manager.registerPreset("threelevels", {
        timeColumnWidth   : 20,
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
                increment  : 1,
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

    t.it('Clicking, Double clicking and right clicking any time header row should fire an event', function (t) {

        var timeAxis = t.getTimeAxis('threelevels', {
            start : new Date(2011, 1, 1),
            end   : new Date(2011, 1, 3)
        });

        var view = new Sch.view.HorizontalTimeAxis({
            timeAxis    : timeAxis,
            model       : new Sch.view.model.TimeAxis({
                viewPreset : 'threelevels',
                timeAxis   : timeAxis
            }),
            containerEl : document.body
        });

        t.willFireNTimes(view, 'refresh', 1);

        view.model.update(300);

        t.willFireNTimes(view, 'timeheaderdblclick', 3);

        view.on('timeheaderdblclick', function (col, start, end, e) {

            t.ok(col instanceof Sch.view.HorizontalTimeAxis, 'Bottom row header ok');
            t.isDateEqual(start, new Date(2011, 1, 1, 0), 'Bottom row StartDate ok');
            t.isDateEqual(end, new Date(2011, 1, 1, 1), 'Bottom row EndDate ok');
            t.ok(!!e.getTarget, 'e ok');

        }, null, { single : true });

        t.doubleClick(view.containerEl.down('.sch-header-row-bottom .sch-column-header'));

        view.on('timeheaderdblclick', function (col, start, end, e) {

            t.ok(col instanceof Sch.view.HorizontalTimeAxis, 'Middle row header ok');
            t.isDateEqual(start, new Date(2011, 1, 1, 0), 'Middle row StartDate ok');
            t.isDateEqual(end, new Date(2011, 1, 2, 0), 'Middle row EndDate ok');
            t.ok(!!e.getTarget, 'e ok');

        }, null, { single : true });

        t.doubleClick(view.containerEl.down('.sch-header-row-middle .sch-column-header'));

        view.on('timeheaderdblclick', function (col, start, end, e) {

            t.ok(col instanceof Sch.view.HorizontalTimeAxis, 'Top row header ok');
            t.isDateEqual(start, new Date(2011, 1, 1, 0), 'Top row StartDate ok');
            t.isDateEqual(end, new Date(2011, 1, 3, 0), 'Top row EndDate ok');
            t.ok(!!e.getTarget, 'e ok');

        }, null, { single : true });

        t.doubleClick(view.containerEl.down('.sch-header-row-top .sch-column-header'));

        t.willFireNTimes(view, 'timeheaderclick', 3);
        t.click(view.containerEl.down('.sch-header-row-top .sch-column-header'));
        t.click(view.containerEl.down('.sch-header-row-middle .sch-column-header'));
        t.click(view.containerEl.down('.sch-header-row-bottom .sch-column-header'));

        t.willFireNTimes(view, 'timeheadercontextmenu', 1);

        t.rightClick(view.containerEl.down('.sch-header-row-bottom .sch-column-header'));

        view.destroy();
        document.body.innerHTML = '';
    });

    t.iit('Header events should bubble up and be exposed through the Panel', function (t) {
        var sched = t.getScheduler({
            renderTo    : document.body,
            viewPreset  : 'threelevels',
            height      : 150
        });

        t.it('timeheaderclick', function(t) {
            t.willFireNTimes(sched, 'timeheaderclick', 1);

            t.chain(
                { waitFor       : 100 },
                { click         : '.sch-column-header', offset : [ 15, 15 ] }
            );
        });

        t.it('timeheadercontextmenu', function(t) {
            t.willFireNTimes(sched, 'timeheadercontextmenu', 1);

            t.chain(
                { waitFor       : 100 },
                { rightclick         : '.sch-column-header', offset : [ 5, 5 ] }
            );
        });

        t.it('timeheaderdblclick', function(t) {
            t.willFireNTimes(sched, 'timeheaderdblclick', 1);

            t.chain(
                { waitFor       : 100 },
                { doubleclick         : '.sch-column-header', offset : [ 5, 5 ] }
            );
        });
    });

})
