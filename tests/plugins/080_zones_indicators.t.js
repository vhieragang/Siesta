StartTest(function(t) {
    
    function runTests(t, orientation) {

        var Utils = Sch.util.Date,
            startDate = new Date(2011, 0, 3),
            endDate   = new Date(2011, 0, 13),
            indicatorSelector = '.sch-header-indicator',
        
            resourceStore = Ext.create('Sch.data.ResourceStore', {
                model : 'Sch.model.Resource',
                data : [
                    {Id : 'r1', Name : 'Mike'},
                    {Id : 'r2', Name : 'Dan'}
                ]
            }),
                
            // Store holding all the events
            eventStore = t.getEventStore({
                data : [{
                    Id : 'e10',
                    ResourceId : 'r1',
                    Name : 'Assignment 1',
                    StartDate : "2011-01-03",
                    EndDate : "2011-01-13"
                }]
            }),
            
            zoneStore = Ext.create('Ext.data.JsonStore', {
                model : 'Sch.model.Range',
                data  : [
                    {
                        StartDate : Utils.add(startDate, Utils.DAY, -2),
                        EndDate   : Utils.add(startDate, Utils.DAY, -1),
                        Text      : 'Before start date'
                    },
                    {
                        StartDate : Utils.add(startDate, Utils.DAY, -1),
                        EndDate   : Utils.add(startDate, Utils.DAY, 1),
                        Text      : 'Including start date'
                    },
                    {
                        StartDate : Utils.add(startDate, Utils.DAY, 1),
                        EndDate   : Utils.add(startDate, Utils.DAY, 2),
                        Text      : 'Valid zone',
                        Cls       : 'text-cls'
                    },
                    {
                        StartDate : Utils.add(endDate, Utils.DAY, -1),
                        EndDate   : Utils.add(endDate, Utils.DAY, 1),
                        Text      : 'Including start date'
                    },
                    {
                        StartDate : Utils.add(endDate, Utils.DAY, -1),
                        EndDate   : Utils.add(endDate, Utils.DAY, 1),
                        Text      : 'After end date'
                    }
                ]
            });
        
        var scheduler = t.getScheduler({
            height : 400, 
            width : 800,
            startDate : startDate, 
            endDate : endDate,
            orientation : orientation,
                
            plugins : Ext.create("Sch.plugin.Zones", {
                pluginId : 'zones',
                store : zoneStore,
                showHeaderElements : true
            })
        });
    
        // rendering is async
        scheduler.render(Ext.getBody());
    
        
        function testPosition(t, indicatorEl, position) {
            var isHorizontal = scheduler.isHorizontal(),
                indicatorBox, indicatorCenter,
                lineBox, lineCenter, date;
            
            // t.elementIsTopElement(indicatorEl, 'Indicator is render on top of scheduler header.');
            
            indicatorBox = Ext.get(indicatorEl).getBox();
            
            indicatorCenter = isHorizontal ? (indicatorBox.left + indicatorBox.right) / 2
                : (indicatorBox.top + indicatorBox.bottom) / 2;
            
            // more safe way of using public method `getBox` led to increasing of error from 1 to 1.5 pixel
            // this is why we had to increase threshold (only for vertical orientation)
            // For IE9 approximation has to be increased to 3
            t.isApprox(indicatorCenter, position, Ext.isIE9 ? 3 : 2, "Header is placed right above the line");
        }
        
        
        function testDate(t, el, expectedDate, message) {
            var model = scheduler.getSchedulingView().getTimeAxisViewModel(),
                elPos, elDate;
            
            elPos = scheduler.isHorizontal() 
                ? (scheduler.rtl ? el.getRight(true) : el.getLeft(true))
                : el.getTop(true);
                
            elDate = model.getDateFromPosition(elPos, 'round');
            
            t.isDateEqual(elDate, expectedDate, message);
        }
        
        
        function testIndicator(t, indicatorEl, date, position, cls, isStart) {
            var isValidDate = Utils.betweenLesser(date, startDate, endDate);
            
            if (isValidDate) {
                t.diag('Zone ' + (isStart ? 'start' : 'end') + ' date is valid.');
                t.ok(indicatorEl, 'Indicator should be rendered.');
                testDate(t, indicatorEl, date, 'Indicator rendered in correct place on the time axis.');
                testPosition(t, indicatorEl, position);
                
                if (cls) {
                    t.ok(indicatorEl.hasCls(cls), 'Indicator should have class "' + cls + '".')
                }
            } else {
                t.diag('Zone ' + (isStart ? 'start' : 'end') + ' date is out of range.');
                t.notOk(indicatorEl, 'Indicator should not be rendered.');
            }
            
            
            return +isValidDate;
        }
        
        function test(next, name) {
            var zonesPlugin = scheduler.getPlugin('zones'),
                date;
            
            t.it(name, function(t) {
                var isHorizontal = scheduler.isHorizontal(),
                    count = 0;
                
                Ext.each(zoneStore.getRange(), function(record, index) {
                    var zoneStart = record.getStartDate(),
                        zoneEnd   = record.getEndDate(),
                        cls   = record.get(record.clsField),
                        zoneEl, zoneRect, zonePos, startEl, endEl;
                        
                    zoneEl   = Ext.get(zonesPlugin.getElementId(record));
                    startEl = Ext.get(zonesPlugin.getHeaderElementId(record, true));
                    endEl = Ext.get(zonesPlugin.getHeaderElementId(record));
                        
                    if (Utils.intersectSpans(zoneStart, zoneEnd, startDate, endDate)) {
                        t.ok(zoneEl, 'Zone should be rendered.');
                        
                        zoneRect = Ext.get(zoneEl).getBox();
                        zonePos  = isHorizontal ? zoneRect.left : zoneRect.top;
                        
                        count += testIndicator(t, startEl, zoneStart, zonePos, cls, true);
                        
                        
                        zonePos = isHorizontal ? zoneRect.right : zoneRect.bottom;
                        count += testIndicator(t, endEl, zoneEnd, zonePos, cls);
                    } else {
                        t.diag('Zone is outside of range.');
                        t.notOk(startEl, 'Start indicator should not be rendered.');
                        t.notOk(startEl, 'End indicator should not be rendered.');
                    }

                });
                
                // t.is(scheduler.el.query('.sch-zone-header').length, count, 'Should not be orphaned indicators');
                
                next();
            });
        }
        
        
        t.chain(
            { waitFor : 'selector', args : [indicatorSelector, scheduler.el] },
            
            function(next) {
                test(next, 'Indicator position');
            },
            
            function(next) {
                zoneStore.loadRawData([
                    {
                        StartDate : Utils.add(startDate, Utils.DAY, 2),
                        EndDate   : Utils.add(startDate, Utils.DAY, 3),
                        Text      : 'Some valid date',
                        Cls       : 'loaded'
                    }
                ]);
                
                next();
            },
            
            { waitFor : 'selector', args : [indicatorSelector + '.loaded', scheduler.el] },
            
            function(next) {
                test(next, 'Records loaded');
            },
            
            function(next) {
                var record = zoneStore.first();
                
                // Set date out of range
                record.setStartDate(Utils.add(startDate, Utils.DAY, -2));
                next();
            },
            
            { waitFor : 500 },
            
            function(next) {
                test(next, 'Updated to invalid start date');
            },
            
            function(next) {
                var record = zoneStore.first();
                
                // Set date out of range
                record.setEndDate(Utils.add(endDate, Utils.DAY, 1));
                next();
            },
            
            { waitFor : 500 },
            
            function(next) {
                test(next, 'Updated to invalid end date');
            },
            
            function(next) {
                var record = zoneStore.first();
                
                // Set valid date
                record.set({
                    StartDate : Utils.add(startDate, Utils.DAY, 1),
                    EndDate   : Utils.add(startDate, Utils.DAY, 2),
                    Cls  : 'new-class'
                });
                
                next();
            },
            
            { waitFor : 500 },
            
            function(next) {
                test(next, 'Updated to valid date');
            },
            
            function(next) {
                zoneStore.add(new zoneStore.model({
                    StartDate : Utils.add(startDate, Utils.DAY, 3),
                    EndDate   : Utils.add(startDate, Utils.DAY, 4),
                    Text : 'Some valid date',
                    Cls : 'added'
                }));
                
                next();
            },
            
            { waitFor : 'selector', args : [indicatorSelector + '.added', scheduler.el] },
            
            function(next) {
                var record = zoneStore.last();
                
                test(next, 'Added record');
            },
            
            function(next) {
                scheduler.setSize(700, 400);
                next();
            },
            
            { waitFor : 'selector', args : [indicatorSelector, scheduler.el] },
            
            function(next) {
                test(next, 'Tests after resize');
            }
        );
    
    };
    
    t.it('Horizontal orientation', function(t) {
        runTests(t, 'horizontal');
    });
    
    t.it('Vertical orientation', function(t) {
        runTests(t, 'vertical');
    });

});
