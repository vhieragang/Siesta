StartTest(function(t) {
    var scheduler = t.getScheduler({
        renderTo        : Ext.getBody()
    });
    
    /**
    * @event beforeviewchange
    * Fires before the current view changes to a new view type or a new time span. Return false to abort this action.
    * @param {Sch.mixin.SchedulerPanel} scheduler The scheduler object
    * @param {Object} preset The new preset
    * @param {Date} start The new start date
    * @param {Date} end The new end date
    */

    scheduler.on('beforeviewchange', function() {
        t.ok(arguments[0] instanceof Sch.SchedulerPanel, 'beforeviewchange 1st arg ok');
        t.is(arguments[1], 'year', 'beforeviewchange 2nd arg ok');
        t.isDateEqual(arguments[2], new Date(2010, 0, 1), 'beforeviewchange 3rd arg ok');
        t.isDateEqual(arguments[3], new Date(2011, 0, 1), 'beforeviewchange 4th arg ok');
    });

    scheduler.on('viewchange', function() {
        t.ok(arguments[0] instanceof Sch.SchedulerPanel, 'viewchange 1st arg ok');
    });
    t.willFireNTimes(scheduler, 'beforeviewchange', 1);
    t.willFireNTimes(scheduler, 'viewchange', 1);
    
    t.chain(
        { waitFor : 'RowsVisible' },
        function () {
            scheduler.switchViewPreset('year', new Date(2010, 0, 1), new Date(2011, 0, 1));
        }
    )
})    

