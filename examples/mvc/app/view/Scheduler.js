Ext.define("DEMO.view.Scheduler", {
    extend : "Sch.panel.SchedulerGrid",
    alias : 'widget.Scheduler',
    title: 'Employee Schedule',
    region : 'center',
    viewPreset: 'monthAndYear',
    rowHeight : 32,

    eventStore : 'Bookings',
    resourceStore : 'Employees',

    onEventCreated : function(newRecord) {
        newRecord.set('Name', 'New task');
    },
        
    // Specialized template with header and footer
    eventBodyTemplate : new Ext.XTemplate(
        '<span class="sch-event-header">{[fm.date(values.StartDate, "Y-m-d")]}</span>' + 
        '<div class="sch-event-footer">{Name}</div>'
    ),

    initComponent : function() {
        var me = this;
        
        Ext.apply(me, {
            
            columns: [
                {header: 'Name', dataIndex: 'Name', width: 150, tdCls : 'user', sortable: true, field : new Ext.form.TextField()},
                {header: 'Active', dataIndex: 'Active', width: 50, xtype: 'booleancolumn', trueText: 'Yes', falseText: 'No', align: 'center'}
            ]
        });

        this.callParent(arguments);
    },

    onRender : function() {
        this.callParent(arguments);
        
        // Lazy loading only after render
        this.getEventStore().load();
    }
});