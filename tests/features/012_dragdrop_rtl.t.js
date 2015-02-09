StartTest(function (t) {
    var s;
    
    t.it('Should align proxy correctly', function (t) {
        s && s.destroy();
        
        s = t.getScheduler({
            renderTo    : Ext.getBody(),
            rtl         : true,
            eventRenderer : function (item, r, tplData, row) {
                tplData.cls = "event-" + r.getId();
                return item.get('Name');
            }
        });
        
        t.chain(
            { waitForEventsToRender : s },

            { action : 'drag', target : '.event-r1', by : [10, 1], dragOnly : true },

            function (next) {
                var query = s.el.query('.event-r1');
                var proxy = Ext.getBody().down('.sch-dd-ref');
                var eventEl = Ext.fly(query[1]);
                
                t.isApprox(proxy.getLeft(), eventEl.getLeft(), 10, 'Proxy left is correct');
                t.isApprox(proxy.getY(), eventEl.getY(), 1, 'Proxy top is correct');
                next();
            },
            { action : 'mouseup' }
        );
    });
    
    t.it('Drag and drop with showExactDropPosition w/o snapRelativeToEventStartDate (horizontal)', function (t) {
        s && s.destroy();
        
        s = t.getScheduler({
            renderTo       : Ext.getBody(),
            startDate      : new Date(2011, 0, 3),
            viewPreset  : 'hourAndDay',
            rtl         : true,
            eventStore  : Ext.create('Sch.data.EventStore', {
                data : [{
                    Id      : 1,
                    Name    : 'Event',
                    ResourceId  : 'r1',
                    StartDate   : new Date(2011, 0, 3, 4, 13, 18),
                    EndDate     : new Date(2011, 0, 3, 6)
                }]
            }),
            dragConfig  : { showExactDropPosition : true }
        });
        
        var tickWidth   = s.getSchedulingView().timeAxisViewModel.getTickWidth();
        var record      = s.eventStore.getAt(0);

        t.chain(
            { waitForRowsVisible : s },

            { drag : '.sch-event', by : [0.2 * tickWidth, 0] },
            function (next) {
                t.is(record.getStartDate(), new Date(2011, 0, 3, 4), 'Event hasn\'t changed place');
                next();
            },
            { drag : '.sch-event', by : [0.5 * tickWidth, 0] },
            function (next) {
                t.is(record.getStartDate(), new Date(2011, 0, 3, 3, 30), 'Event changed place');
                next();
            },
            { drag : '.sch-event', by : [0.2 * tickWidth, 0] },
            function (next) {
                t.is(record.getStartDate(), new Date(2011, 0, 3, 3, 30), 'Event hasn\'t changed place');
                next();
            }
        );
    });
    
    t.it('Drag and drop with showExactDropPosition w/ snapRelativeToEventStartDate (horizontal)', function (t) {
        s && s.destroy();
        
        s = t.getScheduler({
            renderTo       : Ext.getBody(),
            startDate      : new Date(2011, 0, 3),
            viewPreset  : 'hourAndDay',
            rtl         : true,
            eventStore  : Ext.create('Sch.data.EventStore', {
                data : [{
                    Id      : 1,
                    Name    : 'Event',
                    ResourceId  : 'r1',
                    StartDate   : new Date(2011, 0, 3, 4, 13, 18),
                    EndDate     : new Date(2011, 0, 3, 6)
                }]
            }),
            dragConfig  : { showExactDropPosition : true },
            snapRelativeToEventStartDate    : true
        });
        
        var tickWidth   = s.getSchedulingView().timeAxisViewModel.getTickWidth();
        var record      = s.eventStore.getAt(0);

        t.chain(
            { waitForRowsVisible : s },

            { drag : '.sch-event', by : [-0.2 * tickWidth, 0] },
            function (next) {
                t.is(record.getStartDate(), new Date(2011, 0, 3, 4, 13, 18), 'Event hasn\'t changed place');
                next();
            },
            { drag : '.sch-event', by : [-0.5 * tickWidth, 0] },
            function (next) {
                t.is(record.getStartDate(), new Date(2011, 0, 3, 4, 43, 18), 'Event changed place');
                next();
            },
            { drag : '.sch-event', by : [-0.2 * tickWidth, 0] },
            function (next) {
                t.is(record.getStartDate(), new Date(2011, 0, 3, 4, 43, 18), 'Event hasn\'t changed place');
                next();
            }
        );
    });
});