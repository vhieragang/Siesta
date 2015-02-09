StartTest(function (t) {
    var plugin, scheduler, colWidth, rowHeight = 30;
    
    var setup = function (config) {
        config = config || {};
        scheduler && scheduler.destroy();
        
        plugin = new Sch.plugin.CellPlugin(config.plugin || {});
        
        scheduler = t.getScheduler(Ext.apply({
            eventStore      : t.getEventStore({
                data    : [
                    { Cls : 'e1', StartDate : new Date(2014, 5, 12, 1, 30), EndDate : new Date(2014, 5, 12, 2), ResourceId : 'r2' },
                    { Cls : 'e2', StartDate : new Date(2014, 5, 12, 1, 15), EndDate : new Date(2014, 5, 12, 1, 45), ResourceId : 'r2' },
                    { Cls : 'e3', StartDate : new Date(2014, 5, 12, 1), EndDate : new Date(2014, 5, 12, 2), ResourceId : 'r2' }
                ]
            }),
            width       : 1000,
            height      : 500,
            startDate   : new Date(2014, 5, 12),
            endDate     : new Date(2014, 5, 12, 7),
            viewPreset  : 'hourAndDay',
            renderTo    : Ext.getBody(),
            plugins     : plugin,
            viewConfig    : {
                horizontalLayoutCls : 'Sch.eventlayout.Table'
            }
        }, config.scheduler || {}));
    };
    
    var getCellPosition = function (col, row) {
        var view = scheduler.getSchedulingView();
        var viewXY  = view.getXY();
        var width = scheduler.timeAxisViewModel.getTickWidth();
        
        return [viewXY[0] + width * col, t.getRow(scheduler.normalGrid, row).getY()];
    };
    
    var checkDimensions = function (t, col, row, eId) {
        var result = true;
        var height, width, node;
        var box = plugin.containerEl;
        
        if (eId) {
            node = scheduler.el.down('.' + eId);
            height = node.getHeight();
            width = node.getWidth();
        } else {
            node = t.getRow(scheduler.normalGrid, row);
            height = node.getHeight();
            width = scheduler.timeAxisViewModel.getTickWidth();
        }
        box.select('.sch-cellplugin-border-vertical').each(function (el) {
            result = result && Math.abs(el.getHeight() - height) <= Ext.isIE8 ? 2 : 1;
        });
        
        box.select('.sch-cellplugin-border-horizontal').each(function (el) {
            result = result && Math.abs(el.getWidth() - width) <= 1;
        });
        
        var boxXY   = box.getXY();
        var cellXY;
        if (eId) {
            cellXY = node.getXY();
        } else {
            cellXY = getCellPosition(col, row);
        }
        
        result = result && Math.abs(boxXY[0] - cellXY[0]) <= 1;
        result = result && Math.abs(boxXY[1] - cellXY[1]) <= 1;
        
        t.ok(result, 'Highlighter dimensions are correct');
    };
    
    var checkPosition   = function (t, verticalPosition, approx) {
        approx = approx || 0;
        
        var position = 0;
        var box = plugin.containerEl.getBox();
        
        var view = scheduler.getSchedulingView();
        
        Ext.fly(view.getNodeByRecord(plugin.resource)).select('.sch-event').each(function (el) {
            if (el.getY() < box.y && el.getX() > box.x && el.getX() < box.right) position++;
        });
        
        t.is(position - approx, verticalPosition, 'Vertical position is correct');
    };
    
    t.it('Events should be seleted properly', function (t) {
        setup();
        
        t.chain(
            { waitForEventsToRender : scheduler },
            function (next) {
                t.diag('Plugin should respect real layout of events, not order in store');
                plugin.showEditorInCell({ tickIndex : 1, resourceIndex : 0 });
                for (var i = 0; i < 3; i++) {
                    plugin.onKeyDown();
                    checkPosition(t, i);
                }
                
                t.diag('Click on locked grid (resource) should select events, if there are any');
                next();
            },
            { click : function () { return t.getRow(scheduler.lockedGrid, 1); } },
            function (next) {
                checkDimensions(t, 1, 1, 'e3');
                
                t.diag('Key navigation should work correct when event is clicked');
                next();
            },
            { click : '.e2' },
            function (next) {
                plugin.onKeyDown();
                checkPosition(t, 2);
                checkDimensions(t, 1, 1, 'e1');
                next();
            },
            { click : '.e2' },
            function (next) {
                plugin.onKeyUp();
                checkPosition(t, 0);
                checkDimensions(t, 1, 1, 'e3');
                
                plugin.onKeyUp();
                checkDimensions(t, 1, 0);
                next();
            }
        );
    });
    
    t.it('Should extend row height to fill empty editor', function (t) {
        setup({
            scheduler   : {
                eventStore  : t.getEventStore({
                    data    : [
                        { Cls : 'e1', StartDate : new Date(2014, 5, 12, 1, 30), EndDate : new Date(2014, 5, 12, 2), ResourceId : 'r2' },
                        { Cls : 'e2', StartDate : new Date(2014, 5, 12, 1, 15), EndDate : new Date(2014, 5, 12, 1, 45), ResourceId : 'r2' }
                    ]
                })
            }
        });
        
        t.chain(
            { waitForEventsToRender : scheduler },
            function (next) {
                t.diag('Row height should increase only if no space left');
                var row = t.getRow(scheduler.normalGrid, 1);
                var height = row.getHeight();
                
                plugin.showEditorInCell({ tickIndex : 2, resourceIndex : 1 });
                plugin.beginEdit();
                
                plugin.editor.setValue('10-11');
                plugin.onEditorKeyEnter();
                
                t.is(row.getHeight(), height, 'Row height hasn\'t changed');
                t.ok(row.getRegion().contains(plugin.containerEl.getRegion()), 'Box is inside of resource row');
                
                plugin.editor.setValue('12-13');
                
                t.diag('No space left - row has to be increaed');
                plugin.onEditorKeyEnter();
                
                t.isApprox(row.getHeight(), height + scheduler.timeAxisViewModel.rowHeightHorizontal, 1, 'Row height increased');
            }
        );
    });
    
    t.it('Should remove empty lines on TAB keys', function (t) {
        setup({
            scheduler   : {
                eventStore  : t.getEventStore({
                    data    : [
                        { Cls : 'e1', StartDate : new Date(2014, 5, 12, 1, 30), EndDate : new Date(2014, 5, 12, 2), ResourceId : 'r2' }
                    ]
                })
            }
        });
        
        t.chain(
            { click : '.e1' },
            function (next) {
                var row = Ext.get(scheduler.getSchedulingView().getNodeByRecord(scheduler.resourceStore.getAt(1)));
                var height = row.getHeight();
                
                plugin.beginEdit();
                plugin.onEditorKeyEnter();
                
                plugin.moveRight(true);
                t.is(row.getHeight(), height, 'Height restored');
                
                plugin.moveLeft(true);
                plugin.onEditorKeyEnter();
                plugin.moveLeft(true);
                
                t.is(row.getHeight(), height, 'Height restored');
            }
        );
    });
    
    t.it('ENTER on empty editor should select last event', function (t) {
        setup();
        
        t.chain(
            { click : '.e3' },
            function (next) {
                plugin.beginEdit();
                plugin.onEditorKeyEnter();
                plugin.onEditorKeyEnter();
                
                checkDimensions(t, 1, 1, 'e1');
            }
        );
    });
});