Ext.ns('App');

//Ext.Loader.setConfig({ enabled : true, disableCaching : true });
//Ext.Loader.setPath('Sch', '../../js/Sch');

//Ext.require([
//    'Sch.panel.SchedulerGrid'
//]);


Ext.onReady(function() {
    Ext.QuickTips.init();
    
    App.Scheduler.init();
});


App.Scheduler = {
    
    init : function() {
        // Store holding all the resources
        var resourceStore = new Sch.data.ResourceStore({
            model : 'Sch.model.Resource',
            data : [
                {Id : 'r1', Name : 'Machine 1'},
                {Id : 'r2', Name : 'Machine 2'},
                {Id : 'r3', Name : 'Machine 3'},
                {Id : 'r4', Name : 'Machine 4'},
                {Id : 'r5', Name : 'Machine 5'},
                {Id : 'r6', Name : 'Machine 6'},
                {Id : 'r7', Name : 'Machine 7'},
                {Id : 'r8', Name : 'Machine 8'},
                {Id : 'r9', Name : 'Machine 9'},
                {Id : 'r11', Name : 'Robot 1'},
                {Id : 'r12', Name : 'Robot 2'},
                {Id : 'r13', Name : 'Robot 3'},
                {Id : 'r14', Name : 'Robot 4'},
                {Id : 'r15', Name : 'Robot 5'},
                {Id : 'r16', Name : 'Robot 6'}
            ]
        });
        
        var today = new Date();
        Ext.Date.clearTime(today);
        
        // Store holding all the events
        var eventStore = new Sch.data.EventStore({
            data : [
                {ResourceId: 'r1', Name : 'Event-1', StartDate : Sch.util.Date.add(today,Sch.util.Date.DAY, 2), EndDate : Sch.util.Date.add(today,Sch.util.Date.DAY, 6)},
                {ResourceId: 'r2', Name : 'Event-2', StartDate : Sch.util.Date.add(today,Sch.util.Date.DAY, 6), EndDate : Sch.util.Date.add(today,Sch.util.Date.DAY, 11)},
                {ResourceId: 'r3', Name : 'Event-3', StartDate : Sch.util.Date.add(today,Sch.util.Date.DAY, 8), EndDate : Sch.util.Date.add(today,Sch.util.Date.DAY, 12)},
                {ResourceId: 'r12', Name : 'Event-4', StartDate : Sch.util.Date.add(today,Sch.util.Date.DAY, 4), EndDate : Sch.util.Date.add(today,Sch.util.Date.DAY, 13)},
                {ResourceId: 'r14', Name : 'Event-5', StartDate : Sch.util.Date.add(today,Sch.util.Date.DAY, 9), EndDate : Sch.util.Date.add(today,Sch.util.Date.DAY, 12)},
                {ResourceId: 'r15', Name : 'Event-6', StartDate : Sch.util.Date.add(today,Sch.util.Date.DAY, 7), EndDate : Sch.util.Date.add(today,Sch.util.Date.DAY, 13)}
            ]
        });
        
        var g = new Sch.panel.SchedulerGrid({
            height : ExampleDefaults.height,
            width : ExampleDefaults.width,
            renderTo : 'example-container',
            enabledHdMenu : false,
            readOnly : true,
            eventBarTextField : 'Name',

            // Setup your static columns
            columns : [
                {header : 'Machines', sortable:true, width:140, dataIndex : 'Name'}
            ],
            
            startDate : today,
            endDate : Sch.util.Date.add(today,Sch.util.Date.DAY, 11),
            viewPreset : 'dayAndWeek',
            
            resourceStore : resourceStore,
            eventStore : eventStore,
            border : true,
            

            tbar : [
                {
                    text : 'Highlight after scroll',
                    enableToggle : true,
                    pressed : true,
                    id : 'btnHighlight'
                },
                '                     ',
                {
                    xtype : 'combo',
                    id : 'eventCombo',
                    store : eventStore.collect('Name'),
                    triggerAction : 'all',
                    editable : false,
                    value : "Event-2"
                },
                {
                    text : 'Scroll to event',
                    iconCls : 'go',
                    handler : function() {
                        var val = Ext.getCmp('eventCombo').getValue(),
                            doHighlight = Ext.getCmp('btnHighlight').pressed,
                            rec = eventStore.getAt(eventStore.find('Name', val));

                        if (rec) {
                            g.getSchedulingView().scrollEventIntoView(rec, doHighlight);
                        }
                    }
                },
                '->',
                {
                    xtype : 'combo',
                    id : 'timeCombo',
                    store : [[0, 'Today'], [2, '2 days from now'], [10, 'Ten days from now']],
                    triggerAction : 'all',
                    editable : false,
                    value : 2
                },
                {
                    text : 'Scroll to time',
                    iconCls : 'go',
                    handler : function() {
                        var val = Ext.getCmp('timeCombo').getValue();
                        g.scrollToDate(Sch.util.Date.add(today,Sch.util.Date.DAY, val), true);
                    }
                },
                {
                    text    : 'Scroll to time (centered)',
                    iconCls : 'go',
                    handler : function () {
                        var val = Ext.getCmp('timeCombo').getValue();
                        g.scrollToDateCentered(Sch.util.Date.add(today,Sch.util.Date.DAY, val), true);
                    }
                }
            ]
        });
        
        return g;
    }
};
