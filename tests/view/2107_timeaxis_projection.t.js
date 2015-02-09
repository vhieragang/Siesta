StartTest(function(t) {
    Sch.preset.Manager.registerPreset('test', {
        rowHeight           : 24,       
        resourceColumnWidth: 135,       
        timeColumnWidth: 60,

        displayDateFormat: 'G:i',
        shiftIncrement: 1,
        shiftUnit: "WEEK",
        timeResolution: {
            unit: "MINUTE",
            increment: 30
        },
        headerConfig: {
            middle: {
                unit: "HOUR",
                dateFormat: 'G:i'
            }
        }
    });
    
    var scheduler = t.getScheduler({
        viewPreset  : 'test',
        startDate   : new Date(2010, 0, 1),
        endDate     : new Date(2010, 0, 2),
        renderTo    : Ext.getBody()
    });

    var view = scheduler.getSchedulingView();
    var timeaxisStartX = view.el.getX();
    var timeaxisStartY = view.el.getY();

    // HORIZONTAL -----------------------------

    t.is(view.getDateFromXY([timeaxisStartX, -1]), new Date(2010, 0, 1), 'getDateFromX(0) raw, should give start date of the view');
    t.is(view.getDateFromX(timeaxisStartX), new Date(2010, 0, 1), 'getDateFromX(0) raw, should give start date of the view');
    t.isGreater(view.getDateFromX(timeaxisStartX+1), new Date(2010, 0, 1), 'getDateFromX(1) raw, should give > start date of the view');

    t.is(view.getDateFromX(timeaxisStartX, 'floor'), new Date(2010, 0, 1), 'getDateFromX(0) should give start date of the view');
    t.is(view.getDateFromX(timeaxisStartX + 29, 'floor'), new Date(2010, 0, 1), 'getDateFromX(29) should floor to start of view');

    t.is(view.getDateFromX(timeaxisStartX + 14, 'round'), new Date(2010, 0, 1), 'getDateFromX(14) should round down to start date of the view');
    t.is(view.getDateFromX(timeaxisStartX + 15, 'round'), new Date(2010, 0, 1, 0, 30), 'getDateFromX(15) should round up to half hour');
    t.is(view.getDateFromX(timeaxisStartX + 29, 'round'), new Date(2010, 0, 1, 0, 30), 'getDateFromX(29) should round up to half hour');

    Ext.select('.sch-column-header').each(function(cell, coll, i) {
        t.contentLike(cell, Ext.Date.format(new Date(2010, 0, 1, i), 'G:i'), 'Correct horizontal timeaxis header cell text #' + i);
    });

    scheduler.setOrientation('vertical');

    // VERTICAL -----------------------------
    t.is(view.getDateFromXY([-1, timeaxisStartY]), new Date(2010, 0, 1), 'getDateFromX(0) raw, should give start date of the view');
    t.is(view.getDateFromY(timeaxisStartY), new Date(2010, 0, 1), 'getDateFromY(0) raw, should give start date of the view');
    t.isGreater(view.getDateFromY(timeaxisStartY+1), new Date(2010, 0, 1), 'getDateFromY(1) raw, should give > start date of the view');

    t.is(view.getDateFromY(timeaxisStartY, 'floor'), new Date(2010, 0, 1), 'getDateFromY(0) should give start date of the view');
    t.is(view.getDateFromY(timeaxisStartY + 29, 'floor'), new Date(2010, 0, 1), 'getDateFromY(29) should floor to start of view');

    t.is(view.getDateFromY(timeaxisStartY + 14, 'round'), new Date(2010, 0, 1), 'getDateFromY(14) should round down to start date of the view');
    t.is(view.getDateFromY(timeaxisStartY + 15, 'round'), new Date(2010, 0, 1, 0, 30), 'getDateFromY(15) should round up to half hour');
    t.is(view.getDateFromY(timeaxisStartY + 29, 'round'), new Date(2010, 0, 1, 0, 30), 'getDateFromY(29) should round up to half hour');

    Ext.select('.sch-verticaltimeaxis-cell').each(function(cell, coll, i) {
        t.contentLike(cell, Ext.Date.format(new Date(2010, 0, 1, i), 'G:i'), 'Correct vertical timeaxis header cell text #' + i);
    });

})    

