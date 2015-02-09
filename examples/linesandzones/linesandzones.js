Ext.ns('App');
//Ext.Loader.setConfig({ enabled : true, disableCaching : true });
//Ext.Loader.setPath('Sch', '../../js/Sch');

//Ext.require([
//    'Sch.panel.SchedulerGrid',
//    'Sch.plugin.Lines',
//    'Sch.plugin.Zones'
//]);

Ext.onReady(function () {
    App.Scheduler.init();
});

App.Scheduler = {

    // Initialize application
    init : function () {

        Ext.define('Zone', {
            extend : 'Sch.model.Range',
            fields : [
                'Type'
            ]
        });

        Ext.define('Line', {
            extend : 'Ext.data.Model',
            fields : [
                'Date',
                'Text',
                'Cls'
            ]
        });

        var lineStore = Ext.create('Ext.data.JsonStore', {
            model : 'Line',
            data  : [
                {
                    Date : new Date(2011, 0, 9, 12),
                    Text : 'Some important date',
                    Cls  : 'important'
                }
            ]
        });

        var resourceStore = Ext.create('Sch.data.ResourceStore', {
                sorters : {
                    property  : 'Name',
                    direction : "ASC"
                },
                proxy   : {
                    url    : 'resources.xml',
                    type   : 'ajax',
                    reader : {
                        type   : 'xml',
                        record : 'Resource',
                        idPath : 'Id'
                    }
                },
                model   : 'Sch.model.Resource'
            }),

        // Store holding all the events
            eventStore = Ext.create('Sch.data.EventStore', {
                proxy : {
                    url    : 'events.xml',
                    type   : 'ajax',
                    reader : {
                        type   : 'xml',
                        idPath : 'Id',
                        record : 'Event'
                    }
                }
            }),

            zoneStore = Ext.create('Ext.data.JsonStore', {
                model : 'Zone',
                data  : [
                    {
                        StartDate : new Date(2011, 0, 6),
                        EndDate   : new Date(2011, 0, 7),
                        Type      : 'Day off',
                        Cls       : 'myZoneStyle'
                    }
                ]
            });

        var w = Ext.create("Ext.Window", {
            title  : 'Lines and Zones',
            height : ExampleDefaults.height,
            width  : ExampleDefaults.width,
            layout : 'fit',
            items  : g = new Sch.panel.SchedulerGrid({
                eventResizeHandles : 'both',
                startDate          : new Date(2011, 0, 3),
                endDate            : new Date(2011, 0, 13),
                viewPreset         : 'dayAndWeek',
                rowLines           : false,
                rowHeight          : 30,
                eventRenderer      : function (item, r, tplData, row) {
                    var bgColor;

                    switch (row % 3) {
                        case 0 :
                            bgColor = 'lightgray';
                            break;
                        case 1 :
                            bgColor = 'orange';
                            break;
                        case 2 :
                            bgColor = 'lightblue';
                            break;
                    }
                    tplData.style = "background-color:" + bgColor;
                    return item.get('Name');
                },

                // Setup static columns
                columns            : [
                    {header : 'Name', sortable : true, width : 100, dataIndex : 'Name'}
                ],

                plugins       : [
                    this.zonePlugin = Ext.create("Sch.plugin.Zones", {
                        showHeaderElements : true,
                        // If you want, show some extra meta data for each zone
                        innerTpl           : '<span class="zone-type">{Type}</span>',
                        store              : zoneStore
                    }),

                    Ext.create("Sch.plugin.Lines", {
                        showHeaderElements : true,
                        innerTpl           : '<span class="line-text">{Text}</span>',
                        store              : lineStore
                    })
                ],
                viewConfig    : {
                    cellBorderWidth : 0,
                    barMargin       : 2
                },
                resourceStore : resourceStore,
                eventStore    : eventStore,
                tbar          : [
                    {
                        text    : 'Insert zone 1',
                        handler : function (btn) {
                            var newZone = new zoneStore.model({
                                Type      : 'Holiday',
                                StartDate : new Date(2011, 0, 8),
                                EndDate   : new Date(2011, 0, 9)
                            });

                            btn.disable();
                            zoneStore.add(newZone);
                        }
                    },
                    {
                        text    : 'Insert zone 2 (alternate styling)',
                        handler : function (btn) {
                            var newZone = new zoneStore.model({
                                Type      : 'Out of office',
                                StartDate : new Date(2011, 0, 3),
                                EndDate   : new Date(2011, 0, 4),
                                Cls       : 'customZoneStyle'
                            });

                            btn.disable();
                            zoneStore.add(newZone);
                        }
                    },
                    {
                        text    : 'Add row',
                        handler : function () {
                            var newResource = new Sch.model.Resource({
                                Name : 'New person'
                            });

                            resourceStore.add(newResource);
                        }
                    },
                    {
                        text    : 'Horizontal view',
                        pressed : true,

                        enableToggle : true,
                        toggleGroup  : 'orientation',

                        iconCls : 'icon-horizontal',

                        scope   : this,
                        handler : function () {
                            g.setOrientation('horizontal');
                        }
                    },
                    {
                        text : 'Vertical view',

                        enableToggle : true,
                        toggleGroup  : 'orientation',

                        iconCls : 'icon-vertical',

                        scope   : this,
                        handler : function () {
                            g.setOrientation('vertical');
                        }
                    }
                ]
            })
        });

        w.show();

        resourceStore.load();
        eventStore.load();
    }
};
