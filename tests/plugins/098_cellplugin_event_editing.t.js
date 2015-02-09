StartTest(function (t) {
    var plugin, scheduler;
    
    var setup = function (config) {
        scheduler && scheduler.destroy();
        config  = config || {};
        
        plugin = new Sch.plugin.CellPlugin(config.plugin || {});
        
        scheduler = t.getScheduler(Ext.apply({
            eventStore  : t.getEventStore({}, 0),
            width       : 1000,
            height      : 500,
            startDate   : new Date(2012, 5, 18),
            viewPreset  : 'weekAndDay',
            renderTo    : Ext.getBody(),
            plugins     : plugin
        }, config.scheduler || {}));
    };
    
    t.it('Should create/edit event', function (t) {
        
        setup({
            plugin : {
                editor  : {
                    dateFormat  : 'H:i'
                }
            },
            scheduler   : {
                viewConfig    : {
                    horizontalLayoutCls : 'Sch.eventlayout.Table'
                }
            }
        });
        
        t.isCalledNTimes('onEventCreated', scheduler.getSchedulingView(), 2);
        
        var event;
        
        t.chain(
            { click : function () { return t.getRow(scheduler.normalGrid, 2); }, offset : [161, 19] },
            { waitForSelector : '.sch-cellplugin-highlighter' },
            function (next) {
                plugin.editor.setValue('1020');
                t.notOk(plugin.editor.isValid(), 'Validation check is correct');
                
                plugin.completeEdit();
                
                t.is(scheduler.eventStore.getCount(), 0, 'Event not created');
                plugin.beginEdit();
                
                plugin.editor.setValue('10:19-20:45');
                t.ok(plugin.editor.isValid(), 'Validation check is correct');
                plugin.onEditorKeyEnter();

                event = scheduler.eventStore.first();
                
                t.is(event.getStartDate(), new Date(2012, 5, 19, 10, 19), 'Start date is correct');
                t.is(event.getEndDate(), new Date(2012, 5, 19, 20, 45), 'End date is correct');
                t.is(event.getResourceId(), scheduler.resourceStore.getAt(2).getId(), 'Resource is correct');
                
                plugin.editor.setValue('11:00-20:00');
                t.ok(plugin.editor.isValid(), 'Validation check is correct');
                plugin.onEditorKeyEnter();
                plugin.onEditorKeyEnter();
                
                t.is(scheduler.eventStore.getCount(), 2, 'Proper amount of events');
                
                event = scheduler.eventStore.last();
                
                t.is(event.getStartDate(), new Date(2012, 5, 19, 11), 'Start date is correct');
                t.is(event.getEndDate(), new Date(2012, 5, 19, 20), 'End date is correct');
                t.is(event.getResourceId(), scheduler.resourceStore.getAt(2).getId(), 'Resource is correct');
                plugin.beginEdit();
                
                t.is(plugin.editor.getValue(), '11:00-20:00', 'Value is correct');
                plugin.editor.setValue('11:00-21:00');
                plugin.onEditorKeyEnter();
                plugin.onEditorKeyEnter();
                
                t.is(event.getStartDate(), new Date(2012, 5, 19, 11), 'Start date is correct');
                t.is(event.getEndDate(), new Date(2012, 5, 19, 21), 'End date is correct');
                t.is(event.getResourceId(), scheduler.resourceStore.getAt(2).getId(), 'Resource is correct');
            }
        );
    });
    
    t.it('Should cancel editing on "escape" click', function (t) {
        setup();
        
        plugin.on('beforecancelcelledit', function (plugin, value, selection) {
            t.is(value, '10-11');
            return false;
        }, plugin, { single : true });
        
        t.chain(
            { waitForRowsVisible : scheduler },
            function (next) {
                plugin.showEditorInCell({ tickIndex : 1, resourceIndex : 1 }, true);
                plugin.beginEdit();
                plugin.editor.setValue('10-11');
                
                plugin.cancelEdit();
                t.ok(plugin.editor.isVisible(), 'Editor is visible');
                
                plugin.cancelEdit();
                
                t.notOk(plugin.editor.isVisible(), 'Editor is hidden');
                t.is(scheduler.eventStore.getCount(), 0, 'No events created');
                next();
            }
        );
    });
    
    t.it('Should support multiple date formats', function (t) {
        setup({
            plugin  : {
                editor  : {
                    dateFormat  : ['G:i', 'h']
                }
            }
        });
        
        t.chain(
            { waitForRowsVisible : scheduler },
            function (next) {
                plugin.showEditorInCell({ tickIndex : 1, resourceIndex : 2 });
                plugin.beginEdit();
                plugin.editor.setValue('05-10:20');
                t.ok(plugin.editor.isValid(), 'Value is correct');
                // second date doesn't match G:i pattern
                plugin.editor.setValue('05-05:20');
                t.notOk(plugin.editor.isValid(), 'Value is wrong');
                next();
            }
        );
    });
    
    t.it('Should support events that lasts longer than 1 tick', function (t) {
        setup({
            scheduler   : {
                eventStore  : new Sch.data.EventStore({
                    data    : [
                        { StartDate : new Date(2012, 5, 20, 12), EndDate : new Date(2012, 5, 21, 10), ResourceId : 'r1'}
                    ]
                }),
                viewConfig    : {
                    horizontalLayoutCls : 'Sch.eventlayout.Table'
                }
            },
            plugin  : {
                singleClickEditing  : false
            }
        });
        
        t.chain(
            { click : '.sch-event' },
            function (next) {
                plugin.beginEdit();
                plugin.editor.setValue('12-11');
                
                plugin.onEditorKeyEnter();
                plugin.onEditorKeyEnter();
                
                var event = scheduler.eventStore.getAt(0);
                t.is(event.getStartDate(), new Date(2012, 5, 20, 12), 'Start date is correct');
                t.is(event.getEndDate(), new Date(2012, 5, 21, 11), 'End date is correct');
                next();
            }
        );
    });
});