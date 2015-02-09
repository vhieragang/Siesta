Ext.ns('App');

//Ext.Loader.setConfig({ enabled : true, disableCaching : true });
//Ext.Loader.setPath('Sch', '../../js/Sch');

//Ext.require([
//    'Sch.panel.SchedulerGrid'
//]);

Ext.onReady(function() {
    var origFn = Ext.data.JsonP.createScript;

    // Override to handle google JSONP function name passing
    Ext.apply(Ext.data.JsonP, {
        createScript : function(url, params){
            return origFn.call(this, url + "&tqx=responseHandler:" + params.tqx, params);
        }
    });
    App.Scheduler.init();
});


App.Scheduler = {
    
    // Initialize application
    init : function() {
        
        this.grid = this.createGrid();
    },
    
    createGrid : function() {
        Ext.define('Person', {
            extend : 'Sch.model.Resource',
            fields: [
                {name: 'Id' }
            ]
        });

        Ext.define('Event', {
            extend : 'Sch.model.Event',
            fields: [
                {name: 'ResourceId', mapping : 'c[0].v'},
                {name: 'StartDate', type : 'date', mapping : 'c[1].v'},
                {name: 'EndDate', type : 'date', mapping : 'c[2].v'},
                {name: 'Task', mapping : 'c[3].v'},
                {name: 'Color', mapping : 'c[4].v'}
             ]
        });

        // Store holding all the events
        var eventStore = Ext.create("Sch.data.EventStore", {
            model : 'Event',
            proxy: {
                type : 'jsonp',
                callbackKey : 'tqx',
                url: 'http://spreadsheets.google.com/tq?key=0Av0V0CmHd3DVdC1kU3NGSEVaRmFYZnFJOHVpNEVLSWc',
                reader : {
                    type : 'json',
                    rootProperty : 'table.rows'
                }
            },
            listeners : {
                load : function(store, records, successful) {
                    if (successful) {
                        var rs = [];
                        Ext.each(this.proxy.reader.rawData.table.rows, function(p) {
                            rs.push({ Id : p.c[0].v });
                        });
                        resourceStore.loadData(rs);
                    } else {
                        resourceStore.loadData([ { Id : "Mike", Name : "Mike" } ]);
                        this.loadData([ { Id : 1, Task : "Task1", ResourceId : "Mike", StartDate : new Date(2011, 1, 1), EndDate : new Date(2011, 1, 5) } ])
                    }
                }
            }
        });

        // Store holding all the events
        var resourceStore = Ext.create("Sch.data.ResourceStore", {
            model : 'Person'
        });
        
        var g = Ext.create("Sch.panel.SchedulerGrid", {
            border : true,
            height : ExampleDefaults.height/2,
            width : ExampleDefaults.width,
            renderTo : 'example-container',
            loadMask : true,
            readOnly : true,
            viewPreset : 'dayAndWeek',

            eventRenderer : function (task, resource, tplData, row, col, ds, index) {
                tplData.style = 'background-color:' + task.get('Color');

                return task.get('Task');
            },

            // Setup static columns
            columns : [
               {header : 'Name', sortable:true, width:100, dataIndex : 'Id'}
            ],
            
            resourceStore : resourceStore,
            eventStore : eventStore
        });
        
        // Zoom the view according to the loaded data
        eventStore.on('load', function() { 
            var minDate = new Date(9999, 1, 1), maxDate = new Date(0);
            eventStore.each(function(r) {
                minDate = Sch.util.Date.min(r.getStartDate(), minDate);
                maxDate = Sch.util.Date.max(r.getEndDate(), maxDate);
            });
            if (maxDate > minDate) {
                g.setTimeSpan(minDate, maxDate);
            }
        });

        eventStore.load();

        return g;
    }
};
