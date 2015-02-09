Ext.ns('App');

Ext.Loader.setConfig({ enabled : true, disableCaching : true });

Ext.Loader.setPath('App', '.');
Ext.Loader.setPath('Sch', '../../js/Sch');

Ext.require([
    'App.DemoScheduler',
    'App.DemoEditor'
]);

Ext.define('MyResource', {
    extend     : 'Sch.model.Resource',
    idProperty : 'YourIdField',
    fields     : [
        'YourIdField',
        'ImgUrl',
        'Type',
        'Color'
    ]
});

Ext.define('MyEvent', {
    extend    : 'Sch.model.Event',
    nameField : 'Title',

    fields : [
        'Type',
        'EventType',
        'Title',
        'Location'
    ]
});

Ext.application({
    name : 'My',

    init : function () {

        // Store holding all the resources
        var resourceStore = new Sch.data.ResourceStore({
            model : 'MyResource',
            sortInfo : { field : 'Id', direction : "ASC" }
        });

        // Store holding all the events
        var eventStore = new Sch.data.EventStore({
            model : 'MyEvent'
        });

        var zoneStore = new Sch.data.EventStore({
            storeId : 'zones'
        });

        var cm = new Sch.data.CrudManager({
            autoLoad      : true,
            eventStore    : eventStore,
            resourceStore : resourceStore,
            transport     : {
                load : {
                    url : 'data.js'
                }
            },
            stores : [zoneStore]
        });

        var start = new Date(2011, 1, 7, 8);

        var ds = Ext.create("App.DemoScheduler", {
            height      : ExampleDefaults.height,
            width       : ExampleDefaults.width,
            renderTo    : 'example-container',
            crudManager : cm,
            viewPreset  : 'hourAndDay',
            zoneStore   : zoneStore,
            startDate : start,
            endDate   : Sch.util.Date.add(start, Sch.util.Date.HOUR, 10),

            listeners : {
                eventcontextmenu  : this.onEventContextMenu,
                beforetooltipshow : this.beforeTooltipShow,

                scope : this
            }
        });
    },

    onEventContextMenu : function (s, rec, e) {
        e.stopEvent();

        if (!s.ctx) {
            s.ctx = new Ext.menu.Menu({
                items : [{
                    text    : 'Delete event',
                    iconCls : 'icon-delete',
                    handler : function () {
                        s.eventStore.remove(s.ctx.rec);
                    }
                }]
            });
        }
        s.ctx.rec = rec;
        s.ctx.showAt(e.getXY());
    },

    // Don't show tooltip if editor is visible
    beforeTooltipShow  : function (s, r) {
        return s.getEventEditor().getCollapsed();
    }
});
