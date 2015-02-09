StartTest(function (t) {
    var scheduler;
    
    var setup = function (cfg) {
        scheduler && scheduler.destroy();
        
        var currentDate = new Date();
        currentDate     = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
        var index       = currentDate.getDay() - 1;
        
        var startDate   = Sch.util.Date.add(currentDate, 'd', - index);
        var endDate     = Sch.util.Date.add(currentDate, 'd', (6 - index));
        var endDate2    = Sch.util.Date.add(currentDate, 'd', (5 - index));
        
        scheduler = t.getScheduler(Ext.apply({
            mode        : 'calendar',
            startDate   : startDate,
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
                 templateData.cls = 'event-' + eventRec.getId();
            },
            onEventCreated : function (event) {
                event.setId(this.eventStore.last().getId() + 1);
            },
            plugins : [{
                ptype   : 'scheduler_zones',
                store   : new Ext.data.Store({
                    model   : 'Sch.model.Range',
                    data    : [{
                        StartDate   : new Date(endDate2.getFullYear(), endDate2.getMonth(), endDate2.getDate(), 0),
                        EndDate     : new Date(endDate2.getFullYear(), endDate2.getMonth(), endDate2.getDate(), 1),
                        Cls         : 'zone1'
                    }]
                })
            }, {
                ptype   : 'scheduler_zones',
                store   : new Ext.data.Store({
                    model   : 'Sch.model.Range',
                    data    : [{
                        StartDate   : new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 0),
                        EndDate     : new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 1),
                        Cls         : 'zone2'
                    }]
                })
            }],
            highlightCurrentTime    : true
        }, cfg));
    }
    
    t.xit('Column resize should update zones', function (t) {
        setup();
        
        var matchCellAndZone = function (cell, zone, t) {
            t.isApprox(zone.x, cell.x, 1, 'Horizontal position is correct');
            t.isApprox(zone.y, cell.y, 1, 'Vertical position is correct');
            t.isApprox(zone.width, cell.width, 1, 'Width is correct');
            t.isApprox(zone.height, cell.height, 1, 'Height is correct');
        }
        
        t.chain(
            { waitForRowsVisible : scheduler },
            function (next) {
                scheduler.getSchedulingView().scrollHorizontallyTo(400);
                next();
            },

            { action : 'drag', target : function () {
                    return t.safeSelect('.x-grid .x-grid-header-ct .x-column-header:nth-child(7)', scheduler.el.dom);
                }, offset : [0, 9], by : [-77, 1]
            },
            function (next) {
                var cell = t.safeSelect('.x-grid-body tr:nth-child(1) .sch-timetd:nth-child(6)', scheduler.el.dom).getBox();
                var zone = scheduler.el.down('.zone1').getBox();
                
                t.diag('Zone for thin column');
                matchCellAndZone(cell, zone, t);
                
                cell = t.safeSelect('.x-grid-row .sch-timetd:nth-child(7)', scheduler.el.dom).getBox();
                zone = scheduler.el.down('.zone2').getBox();
                
                t.diag('Zone for thick column');
                matchCellAndZone(cell, zone, t);
            }
        );
    });
});