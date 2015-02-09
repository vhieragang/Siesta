StartTest(function (t) {
    var s;
    
    t.it('Should do simple resize', function (t) {
        s = t.getScheduler({
            orientation : 'vertical',
            startDate   : new Date(2011, 0, 4),
            renderTo    : Ext.getBody()
        });
    
        s.eventStore.removeAll();
        s.eventStore.add({
            ResourceId : s.resourceStore.first().getId(),
            StartDate  : new Date(2011, 0, 4),
            EndDate    : new Date(2011, 0, 5)
        });
    
        var evt         = s.eventStore.first();
        var tickWidth   = s.timeAxisViewModel.getTickWidth();
    
        t.chain(
            { waitFor : 'rowsVisible' },
    
            { moveCursorTo : '.sch-event' },
    
            { drag : '.sch-resizable-handle-end', by : [0, tickWidth] },
    
            function (next) {
                t.is(evt.getEndDate(), new Date(2011, 0, 6), 'Event resized');
    
                next();
            },
            
            { drag : '.sch-resizable-handle-end', by : [0, tickWidth] },
    
            function () {
                t.is(evt.getEndDate(), new Date(2011, 0, 7), 'Event resized 2nd time');
            }
        );
    });
    
    var scenario = function (t, config) {
        s && s.destroy();
        
        s = t.getScheduler(Ext.apply({
            orientation : 'vertical',
            viewPreset  : 'weekAndDayLetter',
            startDate   : new Date(2011, 0, 4),
            renderTo    : Ext.getBody(),
            resizeConfig : {
                showExactResizePosition : true
            },
            rowHeight   : 40,
            eventStore  : new Sch.data.EventStore({
                data    : [{
                    ResourceId : 'r1',
                    StartDate  : new Date(2011, 0, 4),
                    EndDate    : new Date(2011, 0, 5),
                    Cls        : 'e1'
                }]
            })
        }, config));
        
        var height = 60;

        s.getSchedulingView().setRowHeight(height);
    
        var testBox;
    
        t.chain(
            { waitForSelector : '.e1' },
            function (next) {
                testBox = s.el.down('.e1').getBox();
                next();
            },
            { moveCursorTo : '.e1' },
            { drag : '.sch-resizable-handle-end', by : [0, 15], dragOnly : true },
            function (next) {
                var box = s.el.down('.e1').getBox();
                t.isDeeply(box, testBox, 'Vertical size hasn\'t changed');
                next();
            },
            { moveCursorBy : [[0, 20]] },
            function (next) {
                var box = s.el.down('.e1').getBox();
                testBox.height = height * 2;
                testBox.bottom = testBox.top + testBox.height;
                t.isDeeply(box, testBox, 'Vertical size is correct');
                next();
            },
            { action : 'mouseUp' },
            
            // add new event, second in column
            function (next) {
                s.eventStore.add({
                    ResourceId : 'r1',
                    StartDate  : new Date(2011, 0, 5),
                    EndDate    : new Date(2011, 0, 6),
                    Cls        : 'e2'
                });
                next();
            },
            { waitFor   : 2000 },
            function (next) {
                testBox = s.el.down('.e1').getBox();
                next();
            },
            { drag : '.e1 .sch-resizable-handle-end', by : [0, 20], dragOnly : true },
            function (next) {
                var box = s.el.down('.e1').getBox();
                t.isDeeply(box, testBox, 'Vertical size is correct');
                next();
            },
            { moveCursorBy : [[0, 20]] },
            function (next) {
                var box = s.el.down('.e1').getBox();
                testBox.height = height * 3;
                testBox.bottom = testBox.top + testBox.height;
                t.isDeeply(box, testBox, 'Vertical size is correct');
                next();
            },
            { action : 'mouseup' }
        );
    }
    
    t.it('Should do show exact resize position w/ snap to increment', function (t) {
        scenario(t, {
            snapToIncrement : true
        });
    });
    
    t.it('Should do show exact resize position w/o snap to increment', function (t) {
        scenario(t, {
            snapToIncrement : false
        });
    });
});
