//Ext.Loader.setConfig({ enabled : true, disableCaching : true });
//Ext.Loader.setPath('Sch', '../../js/Sch');

Ext.require([
    'Sch.plugin.Export'
]);

Ext.onReady(function () {

    // Store holding all the resources
    var resourceStore = Ext.create("Sch.data.ResourceStore", {
        model    : 'Sch.model.Resource',
        autoLoad : true,
        sorters  : 'Name',
        proxy    : {
            type   : 'ajax',
            url    : "peopledata.js",
            reader : {
                type : 'json',
                rootProperty : 'people'
            }
        }
    });

    var eventStore = Ext.create("Sch.data.EventStore", {
        autoLoad : true,
        proxy    : {
            type   : 'ajax',
            url    : "taskdata.js",
            reader : {
                type : 'json',
                rootProperty : 'tasks'
            }
        }
    });

    var exportPlugin = new Sch.plugin.Export({
        printServer : 'server.php'
    });

    var scheduler = Ext.create("Sch.panel.SchedulerGrid", {
        title    : 'Work schedule',
        //Uncomment this line, and comment the line below if you want to test exporting when the Scheduler panel is wrapped by another panel.
        //region: 'center',
        height   : ExampleDefaults.height,
        width    : ExampleDefaults.width,
        renderTo : 'example-container',

        plugins    : exportPlugin,
        rowHeight  : 40,
        startDate  : new Date(2010, 4, 27),
        endDate    : new Date(2010, 5, 5),
        viewPreset : 'dayAndWeek',

        eventRenderer : function (eventRec, resourceRec, tplData, row) {
            if (row % 2 === 0) {
                tplData.cls = 'specialEventType';
            } else {
                tplData.cls = 'normalEvent';
            }

            return Ext.Date.format(eventRec.getStartDate(), 'M d');
        },

        // Setup static columns
        columns       : [
            {header : 'Name', sortable : true, width : 100, dataIndex : 'Name'}
        ],
        tbar          : [
            'This example shows how you can export contents of Ext Scheduler to PDF and PNG.',
            '->',
            {
                iconCls : 'icon-pdf',
                scale   : 'large',
                text    : 'Export to PDF',
                handler : function () {
                    exportPlugin.setFileFormat('pdf');
                    scheduler.showExportDialog();
                }
            },
            {
                iconCls : 'icon-png',
                scale   : 'large',
                text    : 'Export to PNG',
                handler : function () {
                    exportPlugin.setFileFormat('png');
                    scheduler.showExportDialog();
                }
            }
        ],
        resourceStore : resourceStore,
        eventStore    : eventStore
    });

    //Uncomment this part if you want to test exporting when the Scheduler panel is wrapped by another panel.
    /*
     var panel = Ext.create("Ext.panel.Panel", {
     title: 'Main panel',
     width: 900,
     height: 700,
     renderTo: Ext.getBody(),
     layout:'border',
     defaults: {
     collapsible: true,
     split: true
     },
     items: [
     {
     xtype: 'panel',
     title: 'The sidebar',
     region: 'west',
     width: 250
     },
     scheduler
     ]
     });
     */
});
