StartTest(function (t) {
    var plugin, scheduler, colWidth, rowHeight = 30;
    
    var setup = function (config) {
        config = config || {};
        
        scheduler && scheduler.destroy();
        
        plugin = new Sch.plugin.CellPlugin(config.plugin || {});
        
        scheduler = t.getScheduler(Ext.apply({
            eventStore      : t.getEventStore({}, 0),
            width       : 1000,
            height      : 500,
            startDate   : new Date(2014, 5, 12),
            endDate     : new Date(2014, 5, 12, 7),
            viewPreset  : 'hourAndDay',
            renderTo    : Ext.getBody(),
            plugins     : plugin
        }, config.scheduler || {}));
    };
    
    var getCellPosition = function (col, row) {
        var view = scheduler.getSchedulingView();
        var viewXY  = view.getXY();
        
        return [viewXY[0] + colWidth * col, viewXY[1] + rowHeight * row];
    };
    
    var checkDimensions = function (t, box, col, row) {
        var result = true;
        
        Ext.each(box.query('.border-vertical'), function (el) {
            result = result && Ext.fly(el).getHeight() == rowHeight;
        });
        
        Ext.each(box.query('.border-horizontal'), function (el) {
            result = result && Ext.fly(el).getWidth() == colWidth;
        });
        
        var boxXY   = box.getXY(),
            cellXY  = getCellPosition(col, row);
        
        result = result && Math.abs(boxXY[0] - cellXY[0]) <= 1;
        result = result && Math.abs(boxXY[1] - cellXY[1]) <= 1;
        
        t.ok(result, 'Highlighter dimensions are correct');
    };
    
    t.it('Selection-related event arguments are correct', function (t) {
        setup();
        
        t.chain(
            function (next) {
                plugin.on('beforeselect', function (view, resource, startDate, endDate) {
                    t.is(resource.getId(), 'r3', 'Resource is correct');
                    t.is(startDate, new Date(2014, 5, 12, 1), 'Start date is correct');
                    t.is(endDate, new Date(2014, 5, 12, 2), 'End date is correct');
                }, this, { single : true });
                
                plugin.on('select', function (view, resource, startDate, endDate) {
                    t.is(resource.getId(), 'r3', 'Resource is correct');
                    t.is(startDate, new Date(2014, 5, 12, 1), 'Start date is correct');
                    t.is(endDate, new Date(2014, 5, 12, 2), 'End date is correct');
                }, this, { single : true });
                
                plugin.on('selectionchange', function (view, selection) {
                    t.isDeeply(selection, [{
                        startDate   : new Date(2014, 5, 12, 1),
                        endDate     : new Date(2014, 5, 12, 2),
                        resource    : scheduler.resourceStore.getAt(2)
                    }], 'Selection is correct');
                }, this, { single : true });
                
                next();
            },
            { click : function () { return t.getRow(scheduler.normalGrid, 2); }, offset : [195, 16] },
            function (next) {
                plugin.on('beforeselect', function (view, resource, startDate, endDate) {
                    t.is(resource.getId(), 'r4', 'Resource is correct');
                    t.is(startDate, new Date(2014, 5, 12, 1), 'Start date is correct');
                    t.is(endDate, new Date(2014, 5, 12, 2), 'End date is correct');
                }, this, { single : true });
                
                plugin.on('select', function (view, resource, startDate, endDate) {
                    t.is(resource.getId(), 'r4', 'Resource is correct');
                    t.is(startDate, new Date(2014, 5, 12, 1), 'Start date is correct');
                    t.is(endDate, new Date(2014, 5, 12, 2), 'End date is correct');
                }, this, { single : true });
                
                plugin.on('selectionchange', function (view, selection) {
                    t.isDeeply(selection, [{
                        startDate   : new Date(2014, 5, 12, 1),
                        endDate     : new Date(2014, 5, 12, 2),
                        resource    : scheduler.resourceStore.getAt(3)
                    }], 'Selection is correct');
                }, this, { single : true });
                
                next();
            },
            { click : function () { return t.getRow(scheduler.normalGrid, 3); }, offset : [195, 14] },
            function (next) {
                plugin.on('beforeselect', function (view, resource, startDate, endDate) {
                    t.is(resource.getId(), 'r5', 'Resource is correct');
                    t.is(startDate, new Date(2014, 5, 12, 2), 'Start date is correct');
                    t.is(endDate, new Date(2014, 5, 12, 3), 'End date is correct');
                }, this, { single : true });
                
                plugin.on('select', function (view, resource, startDate, endDate) {
                    t.is(resource.getId(), 'r5', 'Resource is correct');
                    t.is(startDate, new Date(2014, 5, 12, 2), 'Start date is correct');
                    t.is(endDate, new Date(2014, 5, 12, 3), 'End date is correct');
                }, this, { single : true });
                
                plugin.on('selectionchange', function (view, selection) {
                    t.isDeeply(selection, [{
                        startDate   : new Date(2014, 5, 12, 1),
                        endDate     : new Date(2014, 5, 12, 2),
                        resource    : scheduler.resourceStore.getAt(3)
                    }, {
                        startDate   : new Date(2014, 5, 12, 2),
                        endDate     : new Date(2014, 5, 12, 3),
                        resource    : scheduler.resourceStore.getAt(4)
                    }], 'Selection is correct');
                }, this, { single : true });
                
                next();
            },
            { click : function () { return t.getRow(scheduler.normalGrid, 4); }, offset : [309, 18], options : { ctrlKey : true } }
        );
    });
    
    t.it('Should cancel selection', function (t) {
        setup({
            plugin  : {
                singleClickEditing : false
            }
        });
        
        t.chain(
            function (next) {
                plugin.on('beforeselect', function () { return false; }, this, { single : true });
                plugin.on('beforecelledit', function () { return false; }, this, { single : true });
                plugin.on('beforecompletecelledit', function () { return false; }, this, { single : true });
                next();
            },
            { click: function () { return t.getRow(scheduler.normalGrid, 1); }, offset : [156, 20] },
            function (next) {
                t.notOk(plugin.containerEl, 'Selection change cancelled');
                next();
            },
            { click : function () { return t.getRow(scheduler.normalGrid, 1); }, offset : [156, 20] },
            function (next) {
                plugin.beginEdit();
                t.notOk(plugin.editor.isVisible(), 'Begin edit is cancelled');
                plugin.beginEdit();
                t.ok(plugin.editor.isVisible(), 'Begin edit is not cancelled');
                plugin.completeEdit();
                t.ok(plugin.editor.isVisible(), 'Complete edit is cancelled');
                plugin.completeEdit();
                t.notOk(plugin.editor.isVisible(), 'Complete edit is not cancelled');
                next();
            }
        );
    });
    
    t.it('Should distinguish click and double click', function (t) {
        setup();
        
        t.willFireNTimes(plugin, 'cellclick', 1);
        t.willFireNTimes(plugin, 'celldblclick', 1);
        t.wontFire(plugin, 'beforeselect');
    
        t.chain(
            function (next) {
                t.waitForEvent(plugin, 'cellclick', next);
                t.waitForEvent(plugin, 'celldblclick', next);
                
                plugin.on('cellclick', function () { return false; }, this, { single : true });
                plugin.on('celldblclick', function () { return false; }, this, { single : true });

                next();
            },
            { click: function () { return t.getRow(scheduler.normalGrid, 1); }, offset : [156, 20] },
            { dblclick: function () { return t.getRow(scheduler.normalGrid, 1); }, offset : [300, 40] }
        );
    });
});