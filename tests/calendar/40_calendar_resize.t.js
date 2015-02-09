StartTest(function (t) {
    var scheduler, event, event1, event2;
    
    var setup = function (config) {
        scheduler && scheduler.destroy();
        
        scheduler = t.getScheduler(Ext.apply({
            mode        : 'calendar',
            startDate   : new Date(2014, 4, 28),
            eventStore  : t.getEventStore({
                data    : {
                    Id          : 1,
                    StartDate   : new Date(2014, 4, 28, 2),
                    EndDate     : new Date(2014, 4, 28, 4),
                    ResourceId  : 'r1',
                    Name        : 'Test'
                }
            }),
            renderTo    : Ext.getBody(),
            eventRenderer : function (eventRec, resourceRec, templateData) {
                 templateData.cls = eventRec.getResourceId();
            }
        }, config));
        
        event   = scheduler.eventStore.getById(1);
    };
    
    t.it('Resize should work correct w/o snapToIncrement', function (t) {
        setup({
            eventStore  : t.getEventStore({
                data    : [{
                    Id          : 1,
                    StartDate   : new Date(2014, 4, 28, 2),
                    EndDate     : new Date(2014, 4, 28, 4),
                    ResourceId  : 'r1',
                    Name        : 'Test1'
                }, {
                    Id          : 2,
                    StartDate   : new Date(2014, 4, 28, 20),
                    EndDate     : new Date(2014, 4, 28, 23),
                    ResourceId  : 'r2',
                    Name        : 'Test2'
                }]
            }),
            resizeConfig    : {
                showTooltip : false
            }
        });
        
        t.chain(
            // resize start
            { drag: ".r1 .sch-resizable-handle-start", by : [-5, -80] },
            function (next) {
                t.is(event.getResourceId(), 'r1', 'Resource is correct');
                t.is(event.getStartDate(), new Date(2014, 4, 28), 'Start date is correct');
                next();
            },
            // resize end
            { drag: ".r1 .sch-resizable-handle-end", by : [-2, 39] },
            function (next) {
                // todo check dates
                t.is(event.getResourceId(), 'r1', 'Resource is correct');
                t.is(event.getEndDate(), new Date(2014, 4, 28, 5), 'End date is correct');
                
                t.scrollVerticallyTo(scheduler, 1000, next);
            },
            { drag: ".r2 .sch-resizable-handle-end", by : [0, 40] },
            function (next) {
                // todo check dates
                event = scheduler.eventStore.getById(2);
                t.is(event.getResourceId(), 'r2', 'Resource is correct');
                t.is(event.getEndDate(), new Date(2014, 4, 29), 'End date is correct');
                next();
            }
        );
    });
    
    t.it('Resize should work correct w/ snapToIncrement', function (t) {
        setup({
            eventStore  : t.getEventStore({
                data    : [{
                    Id          : 1,
                    StartDate   : new Date(2014, 4, 28, 2),
                    EndDate     : new Date(2014, 4, 28, 4),
                    ResourceId  : 'r1',
                    Name        : 'Test1'
                }, {
                    Id          : 2,
                    StartDate   : new Date(2014, 4, 28, 20),
                    EndDate     : new Date(2014, 4, 28, 23),
                    ResourceId  : 'r2',
                    Name        : 'Test2'
                }]
            }),
            snapToIncrement : true,
            resizeConfig    : {
                showTooltip : false
            }
        });
        
        t.chain(
            // resize start
            { drag: ".r1 .sch-resizable-handle-start", by : [-5, -80] },
            function (next) {
                t.is(event.getResourceId(), 'r1', 'Resource is correct');
                t.is(event.getStartDate(), new Date(2014, 4, 28), 'Start date is correct');
                next();
            },
            // resize end
            { drag: ".r1 .sch-resizable-handle-end", by : [-2, 39] },
            function (next) {
                // todo check dates
                event = scheduler.eventStore.getById(1);
                t.is(event.getResourceId(), 'r1', 'Resource is correct');
                t.is(event.getEndDate(), new Date(2014, 4, 28, 5), 'End date is correct');
                
                t.scrollVerticallyTo(scheduler, 1000, next);
            },
            { drag: ".r2 .sch-resizable-handle-end", by : [0, 40] },
            function (next) {
                // todo check dates
                event = scheduler.eventStore.getById(2);
                t.is(event.getResourceId(), 'r2', 'Resource is correct');
                t.is(event.getEndDate(), new Date(2014, 4, 29), 'End date is correct');
                next();
            }
        );
    });
    
});
    