StartTest(function (t) {
    var scheduler;
    
    var setup = function (config) {
        scheduler && scheduler.destroy();
        
        scheduler = t.getScheduler(Ext.apply({
            mode        : 'calendar',
            calendarViewPreset  : 'week',
            startDate   : new Date(2014, 4, 28),
            eventStore  : t.getEventStore({
                data    : [{
                    Id          : 1,
                    StartDate   : new Date(2014, 4, 28, 2),
                    EndDate     : new Date(2014, 4, 29, 3),
                    ResourceId  : 'r1',
                    Name        : 'Test'
                }, {
                    Id          : 2,
                    StartDate   : new Date(2014, 4, 29, 5),
                    EndDate     : new Date(2014, 4, 29, 6),
                    ResourceId  : 'r1',
                    Name        : 'Test'
                }, {
                    Id          : 3,
                    StartDate   : new Date(2014, 4, 27, 1),
                    EndDate     : new Date(2014, 4, 27, 3),
                    ResourceId  : 'r1',
                    Name        : 'Test'
                }]
            }),
            renderTo    : Ext.getBody()
        }, config));
    }
    
    t.it('Should relayout events correctly after drag drop', function (t) {
        setup();
        
        var trEl, firstPart, secondPart, width;
        
        t.chain(
            { waitForEventsToRender : scheduler },
            { waitFor : 500 },
            function (next) {
                trEl        = t.safeSelect('tr:nth-child(1)', scheduler.normalGrid.view.el.dom);
                width       = scheduler.timeAxisViewModel.calendarColumnWidth;
                next();
            },
            { action : "drag", target : function () { 
                    return t.safeSelect('td:nth-child(4) .sch-event', trEl.dom); 
                }, by : [0, 116] 
            },
            { waitFor : 500 },
            function (next) {
                t.isApprox(t.safeSelect('td:nth-child(3) .sch-event', trEl.dom).getWidth(), width, 4, 'First part\'s width is correct');
                t.isApprox(t.safeSelect('td:nth-child(4) .sch-event', trEl.dom).getWidth(), (width - 4) / 2, 1, 'Second part\'s width is correct');
                next();
            },
            { action : "drag", target : function () { 
                    return t.safeSelect('td:nth-child(3) .sch-event', trEl.dom); 
                }, offset : [10, 10], by : [0, -45] 
            },
            { waitFor : 500 },
            function (next) {
                t.isApprox(t.safeSelect('td:nth-child(3) .sch-event', trEl.dom).getWidth(), width, 4, 'First part\'s width is correct');
                t.isApprox(t.safeSelect('td:nth-child(4) .sch-event', trEl.dom).getWidth(), width, 4, 'Second part\'s width is correct');
                next();
            },
            { action : "drag", target : function () { 
                    return t.safeSelect('td:nth-child(3) .sch-event', trEl.dom);
                }, offset : [10, 10], by : [-81, -86] 
            },
            { waitFor : 500 },
            function (next) {
                t.isApprox(t.safeSelect('td:nth-child(2) .sch-event:nth-child(2)', trEl.dom).getWidth(), (width - 4) / 2, 1, 'First part\'s width is correct');
                t.isApprox(t.safeSelect('td:nth-child(3) .sch-event', trEl.dom).getWidth(), width, 4, 'Second part\'s width is correct');
                next();
            },
            { action : "drag", target : function () { 
                    return t.safeSelect('td:nth-child(4) .sch-event', trEl.dom); 
                }, by : [-120, -109] 
            },
            { waitFor : 500 },
            function (next) {
                t.isApprox(t.safeSelect('td:nth-child(3) .sch-event:nth-child(2)', trEl.dom).getWidth(), (width - 4) / 2, 1, 'Short event\'s width is correct');
                t.isApprox(t.safeSelect('td:nth-child(3) .sch-event', trEl.dom).getWidth(), (width - 4) / 2, 1, 'Second part\'s width is correct');
                next();
            },
            { action : "drag", target : function () { 
                    return t.safeSelect('td:nth-child(3) .sch-event:nth-child(2)', trEl.dom); 
                }, by : [-120, 54] 
            },
            { waitFor : 500 },
            function (next) {
                t.isApprox(t.safeSelect('td:nth-child(3) .sch-event', trEl.dom).getWidth(), width, 4, 'Second part\'s width is correct');
                t.isApprox(t.safeSelect('td:nth-child(2) .sch-event:nth-child(3)', trEl.dom).getWidth(), (width - 4) / 2, 1, 'Short event\'s width is correct');
                next();
            },
            { action : "drag", target : function () { 
                    return t.safeSelect('td:nth-child(2) .sch-event:nth-child(2)', trEl.dom); 
                }, offset : [10, 10], by : [-100, -6] 
            },
            { waitFor : 500 },
            function (next) {
                t.isApprox(t.safeSelect('td:nth-child(1) .sch-event', trEl.dom).getWidth(), width, 4, 'First part\'s width is correct');
                t.isApprox(t.safeSelect('td:nth-child(2) .sch-event:nth-child(3)', trEl.dom).getWidth(), (width - 4) / 2, 1, 'Second\'s width is correct');
                next();
            }
        );
    });
});