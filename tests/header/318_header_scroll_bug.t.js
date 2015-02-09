StartTest(function (t) {
    t.diag('Bug with scrollToDate after setTimeSpan');


    var scheduler = t.getScheduler({
        viewPreset  : 'weekAndDay',
        renderTo    : Ext.getBody(),
        startDate   : new Date(2011, 0, 1),
        endDate     : new Date(2011, 0, 20),
        height      : 250
    });

    t.waitForRowsVisible(scheduler, function () {
        t.chain(
            function(next) {
                scheduler.setTimeSpan(new Date(2011, 0, 2), new Date(2011, 0, 11));
                scheduler.scrollToDate(new Date(2011, 0, 5));
                
                next();
            },
            
            { waitFor : 100},
            
            
            function(next) {
                var normal = scheduler.normalGrid;
                
                t.is(normal.headerCt.el.dom.scrollLeft, normal.view.el.dom.scrollLeft,
                    'Header scrollLeft should be equal to body scrollLeft');
            }
            
        );
        
    });
})    
