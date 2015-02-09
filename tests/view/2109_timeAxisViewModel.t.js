StartTest(function (t) {
    t.describe('Should get sane tickWidth from getTickWidth method', function (t) {
        var scheduler = t.getScheduler({
            viewPreset : 'dayAndWeek',
            startDate  : new Date(2010, 0, 1),
            endDate    : new Date(2010, 0, 17),
            renderTo   : Ext.getBody()
        });

        var view = scheduler.getSchedulingView();
        var model = scheduler.timeAxisViewModel;

        scheduler.setTimeColumnWidth(50);
        view.setRowHeight(100);

        t.is(model.getTickWidth(), 50, 'horizontal: tickWidth got assigned correct value');

        scheduler.setOrientation('vertical');

        t.is(model.getTickWidth(), 50, 'vertical: tickWidth got assigned correct value');
    })

    t.describe('Should get sane tickWidth from getSnapPixelAmount method', function (t) {

        var ta = new Sch.data.TimeAxis({
            unit                : Sch.util.Date.MINUTE,
            increment           : 30,
            resolutionUnit      : Sch.util.Date.MINUTE,
            resolutionIncrement : 30,
        });

        var model = new Sch.view.model.TimeAxis({
            snapToIncrement : true,
            forceFit        : false,
            timeAxis        : ta,
            tickWidth       : 100
        });

        t.is(model.getSnapPixelAmount(), 100, '1 minute == 3.33333333px');
    });

    t.it('Should get 4 arguments in header renderer', function (t) {

        var isCalled;
        var eventStore = t.getEventStore();

        Sch.preset.Manager.registerPreset("header", {
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
                middle : {
                    unit      : "DAY",
                    increment : 1,

                    renderer  : function (startDate, endDate, headerConfig, cellIdx, eStore) {
                        isCalled = true;

                        t.is(startDate, new Date(2010, 1, 1), 'Start of the cell is ok')
                        t.is(endDate, new Date(2010, 1, 2), 'End of the cell is ok')
                        t.isObject(headerConfig, 'headerConfig is ok')
                        t.is(cellIdx, 0, 'index is ok');
                        t.is(eStore, eventStore, 'eventStore is passed');
                        t.is(arguments.length, 5, 'Exactly 5 args passed');
                    }
                }
            }
        });

        // a scheduler with 3 level headers
        var scheduler = t.getScheduler({
            viewPreset : 'header',
            renderTo   : Ext.getBody(),
            eventStore : eventStore,
            startDate  : new Date(2010, 1, 1),
            endDate    : new Date(2010, 1, 2)
        });

        t.ok(isCalled)
    });
})

