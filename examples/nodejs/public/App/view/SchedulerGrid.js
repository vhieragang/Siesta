Ext.define('App.view.SchedulerGrid', {
    extend              : 'Sch.panel.SchedulerGrid',

    requires            : ['App.store.EventStore', 'App.store.ResourceStore'],

    userName            : null,
    draggingRecord      : null,
    socketHost          : null,
    rowHeight           : 75,
    barMargin           : 10,
    eventBarTextField   : 'Name',
    viewPreset          : 'hourAndDay',
    eventBodyTemplate   : '<div>{Name}</div><div class="blocked-by {[values.Blocked ? \"\" : \"x-hidden\"]}">{BlockedBy}</div>',

    constructor         : function() {
        var me = this;
        //create a WebSocket and connect to the server running at host domain
        var socket = me.socket = io.connect(me.socketHost);

        Ext.apply(me, {

            viewConfig : {
                onEventUpdate: function (store, model, operation) {
                    // Skip local paints of the record currently being dragged
                    if (model !== me.draggingRecord) {
                        this.horizontal.onEventUpdate(store, model, operation);
                    }
                }
            },

            columns : [
                { header : 'Name', width : 120, dataIndex : 'Name', sortable : true}
            ],

            eventRenderer : function(event, resource, tplData) {
                tplData.cls = '';

                if (event.data.Done) {
                    tplData.cls += ' sch-event-done ';
                }

                if (event.data.Blocked) {
                    tplData.cls += ' sch-event-blocked ';

                    if (event === me.draggingRecord) {
                        tplData.cls += ' x-hidden ';
                    }
                };
                return event.data;
            },

            resourceStore : new App.store.ResourceStore({ /* Extra configs here */}),

            eventStore : new App.store.EventStore({
                socket : socket
            })
        });

        this.callParent(arguments);

        // Change default drag drop behavior to update the dragged record 'live'
        me.on({
            eventdragstart          : me.onDragStart,
            eventdrag               : me.onEventDrag,

            aftereventdrop          : me.onDragEnd,
            scope                   : me
        });
    },

    onEventCreated : function(record) {
        record.set('Name', 'New task');
    },

    // Block a record when it is being dragged
    onDragStart : function(view, records) {

        var rec = records[0];
        this.draggingRecord = rec;

        rec.block(this.userName);
    },

    // Update underlying record as it is moved around in the schedule
    onEventDrag : function(sch, draggedRecords, startDate, newResource) {

        if (newResource && startDate) {
            var task = draggedRecords[0];
            task.beginEdit();
            task.setStartDate(startDate, true);
            task.assign(newResource);
            task.endEdit();
        }
    },

    // Unblock a record after dragging it
    onDragEnd : function(view, records) {
        this.draggingRecord = null;

        records[0].unblock();
    }
}); 