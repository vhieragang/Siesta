StartTest(function (t) {
    var scheduler;
    
    var testingScenario = function (t, config) {
        var schedulingView, middleDate, startDate, endDate, zoomLevels;
        
        var setup       = function (next) {
            scheduler && scheduler.destroy();
            
            scheduler       = t.getScheduler(Ext.apply({
                renderTo        : Ext.getBody()
            }, config));
            
            schedulingView  = scheduler.getSchedulingView();
            
            middleDate      = new Date((scheduler.getEnd() - scheduler.getStart()) / 2 + (scheduler.getStart() - 0));
            
            startDate       = scheduler.getStart();
            endDate         = scheduler.getEnd();
            
            zoomLevels      = scheduler.zoomLevels;
            
            t.waitForEventsToRender(scheduler, next);
        };
        
        t.it('`zoomToLevel` should work', function (t) {
            t.chain(
                setup,
                
                function (next) {
                    schedulingView.scrollHorizontallyTo(schedulingView.getCoordinateFromDate(middleDate) - schedulingView.getWidth() / 2);
        
                    var currentZoomLevel    = scheduler.getCurrentZoomLevelIndex();
                    var nextZoomLevel       = Math.floor(currentZoomLevel) + 1;
        
                    // timeout increased, had to introduce another scroll, waiting for scroll event is not robust
                    t.waitForEvent(scheduler.columnLinesFeature, 'columnlinessynced', next);
                    scheduler.zoomToLevel(nextZoomLevel);
                },
                { waitFor : 100 },
                function (next) {
                    t.columnLinesSynced(scheduler);
                    
                    //                                                                 1h threshold
                    t.isApprox(scheduler.getViewportCenterDate() - 0, middleDate - 0, 60 * 60 * 1000, "Center date is kept approximately in the center while zooming");
        
                    next();
                },
                function (next) {
                    var prevFactor      = 1e10;
                    var centerDate      = scheduler.getViewportCenterDateCached();
                    
                    var steps           = [];
        
                    Ext.Array.each(zoomLevels, function (level, i) {
                        steps.push(
                            function (next) {
                                t.diag('Zooming to level ' + i);
                                t.waitForEvent(scheduler.columnLinesFeature, 'columnlinessynced', next);

                                scheduler.zoomToLevel(i);
                                
                                var nextZoomLevel = scheduler.zoomLevels[i];
                                var preset = Sch.preset.Manager.getPreset(nextZoomLevel.preset);
                                var unit = Sch.util.Date.getUnitByName(nextZoomLevel.resolutionUnit || preset.getBottomHeader().unit);
                                
                                t.is(scheduler.timeAxis.resolutionIncrement, nextZoomLevel.resolution, 'Increment is correct');
                                t.is(scheduler.timeAxis.resolutionUnit, unit, 'Unit is correct');
                                
                            },
                            // additional wait after `columnlinessynced` event - fixes sporadic failures in IE
                            { waitFor : 100 },
                            function (next) {
                                t.columnLinesSynced(scheduler);
                                t.is(scheduler.getCurrentZoomLevelIndex(), i, "After zooming to level, `getCurrentZoomLevelIndex` returns exactly that value");
                                t.is(scheduler.getViewportCenterDateCached(), centerDate, "Center date should not change while zooming");
                
                                var currentFactor   = scheduler.getMilliSecondsPerPixelForZoomLevel(zoomLevels[ i ]);
                
                                t.isLess(currentFactor, prevFactor, "Zooming factor should monotonically decrease");
                
                                prevFactor          = currentFactor;
                                
                                next();
                            }
                        );
                    });
                    
                    t.chain(steps, next);
                }
            );
        });
        
        
        t.it('`zoomToLevel` should work 2', function (t) {
            t.chain(
                setup,
                
                function (next) {
                    scheduler.zoomToLevel(zoomLevels.length - 1);
                    
                    var availableWidth  = schedulingView.getTimeAxisViewModel().getAvailableWidth();
                    var prevLevel       = Math.floor(scheduler.getCurrentZoomLevelIndex());
                    var prevColsNum     = scheduler.timeAxis.getCount();
        
                    scheduler.timeAxis.on('reconfigure', function (timeAxis) {
                        t.ok(timeAxis.autoAdjust, 'correct timeAxis.autoAdjust value');
                    });
        
                    t.willFireNTimes(scheduler.timeAxis, 'reconfigure', 1);
                    
                    var level           = scheduler.zoomToSpan({
                        start   : startDate,
                        end     : endDate
                    });
        
                    t.isLess(level, prevLevel, "Zoomed out to " + level + " level (from " + prevLevel + ")");
                    
                    // not relevant for infinite scroll mode
                    if (!scheduler.infiniteScroll) {
                        t.isGE(
                            availableWidth, 
                            Math.round((endDate - startDate) / scheduler.getMilliSecondsPerPixelForZoomLevel(zoomLevels[ level ])), 
                            "It`s enough place to fit columns"
                        );
                        t.isLess(availableWidth, zoomLevels[prevLevel].width * prevColsNum, "And at "+prevLevel+" level it wasn`t enough place to fit columns");
                    }
                    
                    next();
                }
            );
        });
    };

    t.it('Zooming should work w/o infinite scroll', function (t) {
        testingScenario(t);
    }, 60000);
    
    t.it('Zooming should work w/ infinite scroll', function (t) {
        testingScenario(t, { infiniteScroll : true });
    }, 60000);
});
