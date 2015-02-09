Ext.ns('App');

//Ext.Loader.setConfig({ enabled : true, disableCaching : true });
//Ext.Loader.setPath('Sch', '../../js/Sch');

//Ext.require([
//    'Sch.panel.SchedulerGrid',
//    'Sch.plugin.Pan'
//]);
Ext.onReady(function () {
    App.Scheduler.init();
});

App.Scheduler = {

    // Bootstrap function
    init : function () {
        this.grid = this.createGrid();

        this.grid.render('example-container');
    },

    createGrid : function () {
        Ext.define('Resource', {
            extend     : 'Sch.model.Resource',
            idProperty : 'Id',
            fields     : [
                {name : 'Id'},
                {name : 'Name'},
                {name : 'Type'}
            ]
        });

        Ext.define('Event', {
            extend : 'Sch.model.Event',
            fields : [
                {name : 'ResourceId'},
                {name : 'StartDate', type : 'date', dateFormat : 'Y-m-d G:i'},
                {name : 'EndDate', type : 'date', dateFormat : 'Y-m-d G:i'}
            ]
        });

        // Store holding all the resources
        var resourceStore = new Sch.data.ResourceStore({
            idProperty : 'Id',
            model      : 'Resource'
        });

        resourceStore.loadData([
            {
                Id   : 'a',
                Name : 'Rob',
                Type : 'Sales'
            },
            {
                Id   : 'b',
                Name : 'Mike',
                Type : 'Sales'
            },
            {
                Id   : 'c',
                Name : 'Kate',
                Type : 'Product manager'
            },
            {
                Id   : 'd',
                Name : 'Lisa',
                Type : 'Developer'
            },
            {
                Id   : 'e',
                Name : 'Dave',
                Type : 'Developer'
            },
            {
                Id   : 'f',
                Name : 'Arnold',
                Type : 'Developer'
            },
            {
                Id   : 'g',
                Name : 'Lee',
                Type : 'Marketing'
            },
            {
                Id   : 'h',
                Name : 'Jong',
                Type : 'Marketing'
            }

        ]);

        // Store holding all the events
        var eventStore = new Sch.data.EventStore({
            model : 'Event',
            data  : [   // Some inline dummy data
                {
                    ResourceId : 'a',
                    Name       : 'Some task',
                    StartDate  : '2010-05-22 10:00',
                    EndDate    : '2010-05-22 12:00',
                    Location   : 'Some office'
                },
                {
                    ResourceId : 'b',
                    Name       : 'Some other task',
                    StartDate  : '2010-05-22 13:00',
                    EndDate    : '2010-05-22 16:00',
                    Location   : 'Home office'
                },
                {
                    ResourceId : 'c',
                    Name       : 'A basic task',
                    StartDate  : '2010-05-22 9:00',
                    EndDate    : '2010-05-22 13:00',
                    Location   : 'Customer office'
                }
            ]
        });

        var start = new Date(2010, 4, 22, 6);

        var g = new Sch.panel.SchedulerGrid({
            height             : ExampleDefaults.height,
            width              : ExampleDefaults.width,
            enableDragCreation : false,
            // Setup view configuration
            startDate          : start,
            endDate            : Sch.util.Date.add(start, Sch.util.Date.HOUR, 24),
            viewPreset         : 'hourAndDay',
            rowHeight          : 30,

            /// Setup your static columns
            columns            : [
                {header : 'Staff', width : 130, dataIndex : 'Name'}
            ],

            resourceStore      : resourceStore,
            eventStore         : eventStore,
            plugins            : [
                new Sch.plugin.Pan({
                    enableVerticalPan : true
                })
            ]
        });

        return g;
    }
};

