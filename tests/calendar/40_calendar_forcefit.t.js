StartTest(function (t) {
    t.it('Should fit column into available width', function (t) {
        var sched = t.getScheduler({
            mode                : 'calendar',
            calendarViewPreset  : 'week',
            eventRenderer : function (eventRec, resourceRec, templateData) {
                 templateData.cls = 'event-' + eventRec.getId();
            },
            renderTo            : Ext.getBody()
        });
        
        var checkColumnWidth = function (sched, t) {
            var checkWidth = sched.normalGrid.view.el.dom.scrollWidth / 7;
            var columnsResized = Ext.Array.every(sched.normalGrid.columnManager.getColumns(), function (column) {
                return Math.abs(column.getWidth() - checkWidth) < 2;
            });
            
            if (columnsResized) {
                t.pass('Columns resized correctly');
            } else {
                t.fail('Columns are not resized correctly');
            }
        }
        
        var checkEventsWidth = function (sched, t) {
            var view = sched.getSchedulingView();
            var event1 = view.el.down('.event-1');
            
            t.isApprox(event1.getWidth(), event1.up('.x-grid-cell-inner').getWidth(), 4, 'Full-column event has correct width');
            
            var event2 = view.el.down('.event-2');
            var width = (event2.up('.x-grid-cell-inner').getWidth() - 4) / 2;
            t.isApprox(event2.getWidth(), width, 2, 'Half-column event has correct width');
            t.isApprox(parseInt(event2.getStyle('left')), width + 2, 1, 'Half-column event has correct left style');
        }
        
        t.chain(
            { waitForEventsToRender : sched },
            // scheduler is reconfigured after it's rendered
            { waitFor : 500 },
            function (next) {
                t.diag('Should be rendered correctly');
                checkColumnWidth(sched, t);
                checkEventsWidth(sched, t);
                t.diag('Events should be repainted after resize');
                sched.setWidth(sched.getWidth() + 70);
                next();
            },
            //doesn't work
//            { waitFor : 'animations' },
            { waitFor : 500 },
            function (next) {
                checkColumnWidth(sched, t);
                checkEventsWidth(sched, t);
            }
        );
    });
});