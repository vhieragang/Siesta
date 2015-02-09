StartTest(function(t) {
    var bool = false;

    Sch.preset.Manager.registerPreset("foo", {
        timeColumnWidth   : 35,
        rowHeight         : 32,
        displayDateFormat : 'G:i',
        shiftIncrement    : 1,
        shiftUnit         : "DAY",
        timeResolution    : {
            unit      : "DAY",
            increment : 1
        },
        defaultSpan       : 24,
        headerConfig      : {
            bottom : {
                unit       : "DAY",
                increment  : 1,
                dateFormat : 'Y-m-d'
            },
            middle : {
                unit      : "DAY",
                renderer  : function (startDate, endDate, headerConfig, cellIdx) {
                    return bool ? '<span class="after">foo</span>' : '<span class="before">bar</span>'
                }
            }
        }
    });

    var scheduler = t.getScheduler({
        viewPreset          : 'foo',
        renderTo            : document.body,
        startDate           : new Date(2010, 1, 2),
        endDate             : new Date(2010, 1, 3)
    });

    t.chain(
        { waitFor : 'rowsVisible' },

        function() {
            t.selectorExists('.before', 'should find "before" before redraw');
            t.wontFire(scheduler.getSchedulingView(), 'refresh');

            bool = true

            scheduler.down('timeaxiscolumn').refresh();

            t.selectorNotExists('.before', 'should not find "before" after redraw');
            t.selectorExists('.after', 'should find "after" after redraw');
        }
    )

})
