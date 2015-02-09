Ext.ns('App');

Ext.Loader.setConfig({ enabled : true, disableCaching : true });
Ext.Loader.setPath('Sch', '../../js/Sch');

Ext.require([
    'Sch.panel.SchedulerGrid'
]);

Ext.onReady(function() {
    Ext.QuickTips.init();
    
    App.Scheduler.init();
});

App.Scheduler = {
    
    // Initialize application
    init : function() {
        this.scheduler = this.createScheduler();
        
        this.populateScheduler();
    },
    
    populateScheduler : function() {
        // Load static resource data
        this.scheduler.resourceStore.loadData([
                {Id : 'r1', Name : 'Machine 1', Category : 'Machines', Available: true},
                {Id : 'r2', Name : 'Machine 2', Category : 'Machines', Available: true},
                {Id : 'r3', Name : 'Machine 3', Category : 'Machines', Available: true},
                {Id : 'r10', Name : 'Robot 1', Category : 'Robots', Available: true},
                {Id : 'r11', Name : 'Robot 2', Category : 'Robots', Available: true},
                {Id : 'r12', Name : 'Robot 3 (BROKEN!)', Category : 'Robots', Available: false}
        ]);
        
        // Load event data remotely
        this.scheduler.eventStore.load();
    },
    
    createScheduler : function() {
        Ext.define('Resource', {
            extend : 'Sch.model.Resource',
            fields: [
                {name: 'Category'},
                {name: 'Available'}
             ]
        });

        Ext.define('Event', {
            extend : 'Sch.model.Event',
            fields: [
                {name: 'Group'},
                {name: 'Title'}
             ]
        });


        // Store holding all the resources
        var resourceStore = Ext.create('Sch.data.ResourceStore', {
            sorters:{
                property: 'Name', 
                direction: "ASC"
            },
            model : 'Resource'
        });
        
        // Store holding all the events
        var eventStore = Ext.create('Sch.data.EventStore', {
            proxy : {
                url : 'data.js',
                type : 'ajax'
            },
            model : 'Event'
        });
        
        var g = Ext.create("Sch.panel.SchedulerGrid", {
            height : ExampleDefaults.height,
            width : ExampleDefaults.width,
            renderTo : 'example-container',
            allowOverlap : false,
            viewPreset : 'dayAndWeek',
            startDate : new Date(2011, 4, 2),
            endDate : new Date(2011, 4, 15),        
            rowHeight : 25,
            loadMask : { store : eventStore },

            // Custom renderer, supplies data to be applied to the event template
            eventRenderer : function (event, resource, tplData, row, col, ds) {
                tplData.cls = 'evt-' + resource.get('Category');
                return event.get('Title');
            },

            resizeValidatorFn : function(resourceRecord, eventRecord, start, end) {
                if (eventRecord.get('Group') === 'min-one-day') {
                    return Sch.util.Date.getDurationInDays(start, end) >= 1;
                }
                return true;
            },
            
            dndValidatorFn : function(dragEventRecords, targetRowRecord) {
                return targetRowRecord.get('Available');
            },
            
            // Setup your static columns
            columns : [
                {header : 'Machines', sortable:true, width:140, dataIndex : 'Name', renderer : function(v, m, r) {
                    m.tdCls = r.get('Category');
                    return v;
                }}
            ],

            viewConfig :  {
                getRowClass : function(resourceRecord) {
                    if (!resourceRecord.get('Available')) { 
                        return 'unavailable';
                    }
                    return '';
                }
            },
            
            resourceStore : resourceStore,
            eventStore : eventStore,
            border : true,
            
            tbar : [
                {
                    iconCls : 'icon-prev',
                    scale : 'medium',
                    handler : function() {
                        g.shiftPrevious();
                    }
                },
                '->',
                {
                    iconCls : 'icon-next',
                    scale : 'medium',
                    handler : function() {
                        g.shiftNext();
                    }
                }
            ],
            
            listeners : {
                beforedragcreate : function(s, resource) {
                    if (!resource.get('Available')) {
                        Ext.Msg.alert('Oops', "This machine is not available");
                        return false;
                    }
                },

                beforeeventdrag : function(s, r) {
                    return r.get('Group') !== 'non-movable';
                },

                beforeeventresize : function(s, r) {
                    if (r.get('Group') === 'non-resizable') {
                        Ext.Msg.alert('Oops', "DOH!");
                        return false;
                    }
                },

                beforeeventdropfinalize : function(s, dragContext) {
                    if (dragContext.resourceRecord !== dragContext.newResource) {
                        // Save reference to drag drop context to be able to finalize drop operation after user clicks yes/no button.
                        this.__ddContext = dragContext;
                        
                        Ext.Msg.confirm('Please confirm', 
                                        'Do you want to move the task to ' + dragContext.newResource.getName(), 
                                        App.Scheduler.onDropConfirm, // The button callback
                                        App.Scheduler);          // scope
                        // HACK
                        // style x-dd-drag-proxy has setting z-index : 1000000 !important;
                        // so we need to override it in order to window to be on top of drag proxy
                        // implement this in your code to avoid drag proxy to cover window
                        var window = Ext.WindowManager.getActive();
                        window.el.setZIndex(1100000);
                        
                        return false;
                    }
                },

                beforeeventresizefinalize : function(s, resizeContext) {
                    // Save reference to context to be able to finalize drop operation after user clicks yes/no button.
                    this.__resizeContext = resizeContext;
                        
                    Ext.Msg.confirm('Please confirm', 
                                    'Do you want to update the task: ' + resizeContext.eventRecord.get('Title'), 
                                    App.Scheduler.onResizeConfirm,  // The button callback
                                    App.Scheduler);                 // scope
                    return false;
                },

                beforedragcreatefinalize : function(s, createContext) {
                    // Save reference to context to be able to finalize drop operation after user clicks yes/no button.
                    this.__createContext = createContext;
                        
                    Ext.Msg.confirm('Please confirm', 
                                    'Do you want to create a new task?', 
                                    App.Scheduler.onCreateConfirm,  // The button callback
                                    App.Scheduler);                 // scope
                    return false;
                },

                scope : this    // Make this point to App.Scheduler
            }
        });

        
        return g;
    },

    onDropConfirm : function(btn){
        this.__ddContext.finalize(btn === 'yes');
    },

    onResizeConfirm : function(btn){
        this.__resizeContext.finalize(btn === 'yes');
    },

    onCreateConfirm : function(btn){
        this.__createContext.finalize(btn === 'yes');
    }
};
