StartTest(function (t) {
    var colWidth    = 126,
        rowHeight   = 30,
        plugin,
        scheduler;
    
    var setup = function (config) {
        scheduler && scheduler.destroy();
        
        plugin = new Sch.plugin.CellPlugin();
        
        scheduler = t.getScheduler(Ext.apply({
            eventStore  : t.getEventStore({}, 0),
            width       : 1000,
            height      : 500,
            startDate   : new Date(2014, 5, 12),
            endDate     : new Date(2014, 5, 12, 7),
            viewPreset  : 'hourAndDay',
            renderTo    : Ext.getBody(),
            plugins     : plugin,
            eventRenderer : function (eventRec, resourceRec, templateData) {
                templateData.cls = eventRec.getId();
            }
        }, config || {}));
    };
    
    var getCellPosition = function (col, row) {
        var view = scheduler.getSchedulingView();
        var viewXY  = view.getXY();
        
        return [viewXY[0] + colWidth * col, Ext.fly(view.getRowByRecord(scheduler.resourceStore.getAt(row))).getY()];
    };
    
    var checkDimensions = function (t, box, col, row, eId) {
        var result = true;
        var height, width, node;
        
        if (eId) {
            node = scheduler.el.down('.' + eId);
            height = node.getHeight();
            width = node.getWidth();
        } else {
            node = Ext.get(scheduler.getSchedulingView().getRowByRecord(scheduler.resourceStore.getAt(row)));
            height = node.getHeight();
            width = colWidth;
        }
        Ext.each(box.query('.sch-cellplugin-border-vertical'), function (el) {
            result = result && Math.abs(Ext.fly(el).getHeight() - height) <= 1;
        });
        
        Ext.each(box.query('.sch-cellplugin-border-horizontal'), function (el) {
            result = result && Math.abs(Ext.fly(el).getWidth() - width) <= 1;
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
    
    var checkBoxPosition = function (t, col, row) {
        var pXY = plugin.containerEl.getXY();
        var vXY = scheduler.getSchedulingView().getXY();
        
        t.isDeeply(pXY, [vXY[0] + col * colWidth, vXY[1] + row * rowHeight], 'Position is correct');
    };
    
    t.it('Should draw/move plugin on click in scheduling area', function (t) {
        setup({
            eventStore  : t.getEventStore({
                data    : [{
                    Id          : 'e1',
                    StartDate   : new Date(2014, 5, 12, 1),
                    EndDate     : new Date(2014, 5, 12, 2),
                    ResourceId  : 'r2'
                }, {
                    Id          : 'e2',
                    StartDate   : new Date(2014, 5, 12, 1, 30),
                    EndDate     : new Date(2014, 5, 12, 2),
                    ResourceId  : 'r2'
                }]
            })
        });
        
        t.willFireNTimes(plugin, 'beforecelledit', 3);
        t.willFireNTimes(plugin, 'begincelledit', 3);
        
        var view = scheduler.getSchedulingView();
        
        t.chain(
            { waitForRowsVisible : scheduler },
            function (next) {
                t.selectorNotExists('.sch-cellplugin-highlighter', 'Box is not rendered yet');
                next();
            },
            { click : function () { return t.getRow(scheduler.normalGrid, 1); }, offset : [150, 9] },
            { waitForSelector : '.sch-cellplugin-highlighter' },
            function (next) {
                var box = plugin.containerEl;
                checkDimensions(t, box, 1, 1, 'e1');
                plugin.onKeyRight();
                checkDimensions(t, box, 2, 1);
                plugin.onKeyDown();
                checkDimensions(t, box, 2, 2);
                plugin.onKeyLeft();
                checkDimensions(t, box, 1, 2);
                plugin.onKeyUp();
                checkDimensions(t, box, 1, 1, 'e2');
                plugin.onKeyTab({ shiftKey: true, isNavKeyPress : function () { return true; } });
                checkDimensions(t, box, 0, 1);
                plugin.onKeyTab({ isNavKeyPress : function () { return true; } });
                checkDimensions(t, box, 1, 1, 'e1');
                plugin.beginEdit();
            
                t.ok(plugin.editor.isVisible(), 'Editor is visible');
                
                plugin.onKeyTab({ shiftKey: true, isNavKeyPress : function () { return true; } });
                checkDimensions(t, box, 0, 1);
                t.ok(plugin.editor.isVisible(), 'Editor is visible');
                
                plugin.onKeyTab({ isNavKeyPress : function () { return true; } });
                checkDimensions(t, box, 1, 1, 'e1');
                t.ok(plugin.editor.isVisible(), 'Editor is visible');
                plugin.completeEdit();
                next();
            }
        );
    });
    
    t.it('Should show input el on click in scheduler', function (t) {
        setup();
        
        var view = scheduler.getSchedulingView();
        
        t.chain(
            { waitForRowsVisible : scheduler },
            { click : function () { return t.getRow(scheduler.normalGrid, 1); }, offset : [71, 19] },
            { waitFor : function () { return plugin.editor && plugin.editor.isVisible && plugin.editor.isVisible() } },
            { click : function () { return t.getRow(scheduler.normalGrid, 2); }, offset : [171, 15] },
            { waitFor : function () { return plugin.editor && plugin.editor.isVisible && plugin.editor.isVisible() } },
            function (next) {
                plugin.completeEdit();
                t.waitForEvent(plugin, 'selectionchange', next);
                plugin.moveLeft(true);
            },
            function (next) {
                var box = plugin.containerEl;
                t.is(box.getStyle('left'), '0px', 'Horizontal position is correct');
                t.is(box.getStyle('top'), '60px', 'Vertical position is correct');
                next();
            }
        );
    });
    
    t.it('Right/left arrows should move box between rows', function (t) {
        setup();
        
        var view = scheduler.lockedGrid.getView();
        
        t.chain(
            { waitForRowsVisible : scheduler },
            { click : function () { return t.getRow(scheduler.lockedGrid, 1); } },
            { waitForSelector : '.sch-cellplugin-highlighter' },
            function (next) {
                var box = plugin.containerEl;
                
                t.diag('Left arrow should move box up in leftmost position');
                plugin.moveLeft(true);
                checkDimensions(t, box, 6, 0);
                t.is(scheduler.getSelectionModel().getSelection()[0], scheduler.resourceStore.getAt(0), '');
                
                t.diag('Right arrow should move box down in rightmost position');
                plugin.moveRight(true);
                checkDimensions(t, box, 0, 1);
                t.is(scheduler.getSelectionModel().getSelection()[0], scheduler.resourceStore.getAt(1), '');
                
                t.diag('Should not nove box up/down in left/topmost or right/bottommost position');
                plugin.moveUp(true);
                plugin.moveLeft(true);
                checkDimensions(t, box, 0, 0);
                t.is(scheduler.getSelectionModel().getSelection()[0], scheduler.resourceStore.getAt(0), '');
                
                plugin.showEditorInCell({ tickIndex : 6, resourceIndex : 5 }, true);
                plugin.moveRight(true);
                checkDimensions(t, box, 6, 5);
                t.is(scheduler.getSelectionModel().getSelection()[0], scheduler.resourceStore.getAt(5), '');
                
                next();
            }
        );
    });
    
    // moving box in editing mode is deprecated. test passes only because it simulates movement
    t.it('Should move box in editing mode', function (t) {
        setup();
        
        var view = scheduler.lockedGrid.getView();
        
        t.chain(
            { waitForRowsVisible : scheduler },
            { click : function () { return t.getRow(scheduler.lockedGrid, 1); } },
            { waitForSelector : '.sch-cellplugin-highlighter' },
            function (next) {
                plugin.beginEdit();
                var box = plugin.containerEl;
                
                t.diag('Left arrow should move box up in leftmost position');
                plugin.moveLeft(true);
                checkDimensions(t, box, 6, 0);
                t.is(scheduler.getSelectionModel().getSelection()[0], scheduler.resourceStore.getAt(0), '');
                t.ok(plugin.editing, 'Plugin is editing');
                
                t.diag('Right arrow should move box down in rightmost position');
                plugin.moveRight(true);
                checkDimensions(t, box, 0, 1);
                t.is(scheduler.getSelectionModel().getSelection()[0], scheduler.resourceStore.getAt(1), '');
                t.ok(plugin.editing, 'Plugin is editing');
                
                t.diag('Should not nove box up/down in left/topmost or right/bottommost position');
                plugin.moveUp(true);
                plugin.moveLeft(true);
                checkDimensions(t, box, 0, 0);
                t.is(scheduler.getSelectionModel().getSelection()[0], scheduler.resourceStore.getAt(0), '');
                t.ok(plugin.editing, 'Plugin is editing');

                plugin.showEditorInCell({ tickIndex : 6, resourceIndex : 5 }, true);
                plugin.moveRight(true);
                checkDimensions(t, box, 6, 5);
                t.is(scheduler.getSelectionModel().getSelection()[0], scheduler.resourceStore.getAt(5), '');
                t.ok(plugin.editing, 'Plugin is editing');
                next();
            }
        );
    });
    
    t.it('Should draw box on click in locked grid', function (t) {
        setup();
        
        var view = scheduler.lockedGrid.getView();
        
        t.chain(
            { waitForRowsVisible : scheduler },
            { click : function () { return t.getRow(scheduler.lockedGrid, 2); } },
            { waitForSelector : '.sch-cellplugin-highlighter' },
            function (next) {
                checkBoxPosition(t, 0, 2);
                
                plugin.showEditorInCell({ tickIndex : 2, resourceIndex : 3 }, true);
                checkBoxPosition(t, 2, 3);
                next();
            },
            { click : function () { return t.getRow(scheduler.lockedGrid, 5); } },
            function (next) {
                checkBoxPosition(t, 2, 5);
                next();
            }
        );
    });
    
    t.it('Should intercept clicks in editing mode', function (t) {
        setup();
        
        var view = scheduler.lockedGrid.getView();
        
        t.chain(
            { waitForRowsVisible : scheduler },
            { click : function () { return t.getRow(scheduler.normalGrid, 3); }, offset : [172, 9] },
            { waitForSelector : '.sch-cellplugin-highlighter' },
            { type : "[RETURN]asdf" },
            // click somewhere to editor lost it's focus
            { click : ".sch-schedulerview", offset : [182, 252] },
            // click in editor, should become active
            { click : ".x-form-text" },
            function (next) {
                t.ok(plugin.editor.isVisible(), 'Editor is visible');
                next();
            }
        );
    });
    
    t.it('Events should fill whole cell', function (t) {
        setup({
            viewPreset  : 'weekAndDay',
            viewConfig  : {
                horizontalLayoutCls : 'Sch.eventlayout.Table'
            },
            eventStore  : t.getEventStore({
                data    : [
                    { StartDate : new Date(2014, 5, 12, 5), EndDate : new Date(2014, 5, 12, 12), ResourceId : 'r2', Cls : 'event1' },
                    { StartDate : new Date(2014, 5, 12, 15), EndDate : new Date(2014, 5, 12, 18), ResourceId : 'r2', Cls : 'event2' }
                ]
            })
        });
        
        var view = scheduler.getSchedulingView(),
            width = scheduler.timeAxisViewModel.getTickWidth();
        
        t.chain(
            { waitForRowsVisible : scheduler },
            function (next) {
                var node = Ext.get(view.getNode(1));
                var event1 = scheduler.el.down('.event1');
                var event2 = scheduler.el.down('.event2');
                
                t.isApprox(event1.getWidth(), width, 1, 'Width is correct');
                t.is(event1.getX(), view.getX() + 3 * width, 'Horizontal position is correct');
                t.isApprox(event1.getY(), node.getY(), 2, 'Vertical position is correct');
                
                t.isApprox(event2.getWidth(), width, 1, 'Width is correct');
                t.is(event2.getX(), view.getX() + 3 * width, 'Horizontal position is correct');
                t.isApprox(event2.getY(), node.getY() + node.getHeight() / 2, 2, 'Vertical position is correct');
                
                next();
            },
            { click : function () { return t.getRow(scheduler.normalGrid, 2); }, offset : [92, 14] },
            { waitForSelector : '.sch-cellplugin-highlighter' },
            function (next) {
                plugin.beginEdit();
                plugin.editor.setValue('10-12');
                plugin.completeEdit();
                next();
            },
            { click : function () { return t.getRow(scheduler.normalGrid, 2); }, offset : [182, 16] },
            function (next) {
                plugin.beginEdit();
                plugin.editor.setValue('10-12');
                plugin.completeEdit();
                
                var event = scheduler.el.select('.sch-event').last();
                var node  = Ext.get(view.getNode(2));
                t.isApprox(event.getWidth(), width, 1, 'Width is correct');
                t.isApprox(event.getY(), node.getY(), 2, 'Vertical position is correct');
                t.is(event.getX(), node.getX() + width, 'Horizontal position is correct');
                next();
            }
        );
    });
    
    t.it('Should hide highlighter on "escape" click', function (t) {
        setup();
        
        t.chain(
            { waitForRowsVisible : scheduler },
            { click : function () { return t.getRow(scheduler.normalGrid, 1); }, offset : [166, 20] },
            { waitForSelector : '.sch-cellplugin-highlighter' },
            function (next) {
                checkBoxPosition(t, 1, 1);
                plugin.destroyHighlighter();
                plugin.moveLeft();
                
                t.notOk(plugin.containerEl, 'Highlighter is hidden');
                t.notOk(plugin.resource, 'Resource removed');
                t.notOk(plugin.tickIndex, 'Tick index removed');
                next();
            },
            { click : function () { return t.getRow(scheduler.normalGrid, 1); }, offset : [166, 20] },
            function (next) {
                checkBoxPosition(t, 1, 1);
                t.livesOk(plugin.moveLeft, 'Plugin can be moved');
            }
        );
    });
});