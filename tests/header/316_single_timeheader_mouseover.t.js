StartTest(function (t) {

    t.it('Should highlight headercell when hovering mouse over it', function (t) {
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

        var scheduler = t.getScheduler({
            viewPreset : 'foo',
            width      : 400,
            height     : 200,
            forceFit   : true,
            renderTo   : Ext.getBody(),
            startDate  : new Date(2011, 1, 1),
            endDate    : new Date(2011, 1, 1, 12)
        });

        var hdr = 1;
        var verifyStep = function (next, headerEl) {
            t.hasCls(headerEl, 'x-column-header-over', 'Header cell has over class applied to it');
            next();
        };

        var steps = [
            { waitFor : 'rowsVisible', args : scheduler },

            { action : 'moveCursorTo', target : '.sch-header-row-top .sch-column-header' },

            function (next, headerEl) {

                t.selectorNotExists('.x-column-header-over', 'Should not find default Ext overCls');
                t.hasCls(headerEl, 'sch-column-header-over', 'top header cell has over class applied to it');
                next();
            },

            { action : 'moveCursorTo', target : 'schedulerpanel[lockable=true] => .sch-header-row-middle .sch-column-header' },

            function (next, headerEl) {
                t.is(Ext.select('.sch-column-header-over').getCount(), 1, 'Only 1 cell in hover over state');
                t.hasCls(headerEl, 'sch-column-header-over', 'middle header cell has over class applied to it');
                next();
            },

            { action : 'moveCursorTo', target : 'schedulerpanel[lockable=true] => .sch-header-row-bottom .sch-column-header' },

            function (next, headerEl) {
                t.is(Ext.select('.sch-column-header-over').getCount(), 1, 'Only 1 cell in hover over state');
                t.hasCls(headerEl, 'sch-column-header-over', 'bottom header cell has over class applied to it');
                next();
            },

            { action : 'moveCursorTo', target : [410, 20] },

            function (next, targetEl) {
                t.simulateEvent(scheduler.normalGrid.headerCt.el.down('.x-column-header-inner'), 'mouseleave');
                t.is(Ext.select('.sch-column-header-over').getCount(), 0, 'No header cells in hover over state');
            }
        ];

        t.chain(steps);
    })

    t.it('Should not highlight headercell when trackHeaderOver is false', function (t) {
        var scheduler = t.getScheduler({
            cls             : 'second',
            trackHeaderOver : false,
            renderTo        : Ext.getBody()
        });

        t.chain(
            { waitFor : 'rowsVisible', args : scheduler },

            { action : 'moveCursorTo', target : '.second .sch-column-header' },

            function (next, headerEl) {

                t.selectorNotExists('.second .sch-column-header-over', 'No header cell has the "over class" applied to it');
                t.selectorNotExists('.x-column-header-over', 'Should not find default Ext overCls');
            });
    })
})
