Ext.define("Ext.ux.SchedulerGrid",{
	alias:"widget.uxschedulergrid",
	extend:"Sch.panel.SchedulerGrid",

    requires: [
        'Ext.grid.plugin.CellEditing'
    ],

    constructor: function() {
        Ext.QuickTips.init();
        this.callParent(arguments);
    },

    initComponent: function() {
        var me = this,
            listeners = {
                eventcontextmenu: me.onEventContextMenu, 
                beforetooltipshow: me.beforeTooltipShow,
                scope: me
            };

        //set up the listeners
        me.listeners = listeners;

        this.callParent(arguments);
    },

    show : function(eventRecord) {
        var resourceId = eventRecord.getResourceId();
        // Load the image of the resource
        this.img.setSrc(this.schedulerView.resourceStore.getById(resourceId).get('ImgUrl'));

        this.callParent(arguments);
    },

    onEventContextMenu: function (s, rec, e) {
        e.stopEvent();

        if (!s.ctx) {
            s.ctx = new Ext.menu.Menu({
                items: [{
                    text: 'Delete event',
                    iconCls: 'icon-delete',
                    handler : function() {
                        s.eventStore.remove(s.ctx.rec);
                    }
                }]
            });
        }
        s.ctx.rec = rec;
        s.ctx.showAt(e.getXY());
    },

    eventRenderer: function (item, resourceRec, tplData) {
        var bookingStart = item.getStartDate();
        tplData.style = 'background-color:' + (resourceRec.get('Color') || 'Coral');
        
        return item.get('Title');
    },

    // Don't show tooltip if editor is visible
    beforeTooltipShow: function (s, r) {
        return s.getEventEditor().getCollapsed();
    }
});