StartTest(function (t) {
    
    var scheduler
    
    var setup = function (config) {
        scheduler && scheduler.destroy()
        
        scheduler = t.getScheduler(Ext.apply({
            height     : 150, // Force vert scrollbar
            viewPreset : 'dayAndWeek',
            renderTo   : Ext.getBody(),
            startDate  : new Date(2000, 0, 1),
            endDate    : new Date(2000, 4, 1),
            plugins     : Ext.create("Sch.plugin.HeaderZoom")
        }, config));
    }

    t.it('Should zoom to span', function(t) {
        setup();
        
        var tAVM        = scheduler.timeAxisViewModel,
            width       = tAVM.getAvailableWidth(),
            view        = scheduler.getSchedulingView(),
            span        = {},
            el          = view.headerCt.el;
        
        
        var steps       = [
            function(next) {
                t.waitForEvent(scheduler.columnLinesFeature, 'columnlinessynced', next);

                scheduler.zoomToSpan({ start: new Date(2001, 0, 1), end: new Date(2031, 0, 1) });
            },
            { waitFor : 100 }
        ];
        
        for (var i = 0; i < 10; i++) {
            steps.push(
                function (next) {
                    var scroll      = view.el.getScroll();
                    
                    span = {
                        start   : tAVM.getDateFromPosition(scroll.left + 100),
                        end     : tAVM.getDateFromPosition(scroll.left + 300)
                    };
                    
                    t.waitForEvent(scheduler.columnLinesFeature, 'columnlinessynced', next)
                    
                    t.dragTo(el, el, function () {}, t, null, false, [100, 0], [300, 0]);  
                },
                // additional wait after `columnlinessynced` event - fixes sporadic failures in IE
                { waitFor : 100 },
                function (next) {
                    t.isApprox(tAVM.getPositionFromDate(span.end) - tAVM.getPositionFromDate(span.start), width, Math.round(width * 0.6), 'Columns fit');
                    t.columnLinesSynced(scheduler, 'Column lines synced');
                    next();
                }
            );
        }
        
        t.chain(steps);
    });
    
    t.it('Should work when we switch orientation', function (t) {
        t.livesOk(function () {
            setup({
                orientation : 'vertical'
            });    
        });

        scheduler.setOrientation('horizontal');
        
        scheduler.zoomToSpan({ start: new Date(2001, 0, 1), end: new Date(2031, 0, 1) });
        
        var tAVM        = scheduler.timeAxisViewModel,
            width       = tAVM.getAvailableWidth(),
            view        = scheduler.getSchedulingView(),
            span        = {},
            el          = view.headerCt.el;
        
        t.chain(
            { waitForEvent: [scheduler.columnLinesFeature, 'columnlinessynced'] },
            function (next) {
                var scroll      = view.el.getScroll();
                
                span = {
                    start   : tAVM.getDateFromPosition(scroll.left + 100),
                    end     : tAVM.getDateFromPosition(scroll.left + 300)
                };
                
                t.waitForEvent(scheduler.columnLinesFeature, 'columnlinessynced', next)
                
                t.dragTo(el, el, function () {}, t, null, false, [100, 0], [300, 0]);  
            },
            // additional wait after `columnlinessynced` event - fixes sporadic failures in IE
            { waitFor : 100 },
            function (next) {
                t.isApprox(tAVM.getPositionFromDate(span.end) - tAVM.getPositionFromDate(span.start), width, Math.round(width * 0.6), 'Columns fit');
                t.columnLinesSynced(scheduler, 'Column lines synced');
                next();
            }
        )
    });
});
