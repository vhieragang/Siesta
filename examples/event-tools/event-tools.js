Ext.ns('App');

Ext.Loader.setConfig({ enabled : true, disableCaching : true });

Ext.Loader.setPath('App', '.');
Ext.Loader.setPath('Sch.plugin', '.');

Ext.onReady(function () {
	Ext.QuickTips.init();
	App.Scheduler.init();
});

App.Scheduler = {

	// Bootstrap function
	init: function () {
		this.scheduler = this.createScheduler();
	},

	createScheduler: function () {
		Ext.define('Resource', {
			extend : 'Sch.model.Resource',
			fields: [
				'Type'
			]
		});

		Ext.define('Event', {
			extend : 'Sch.model.Event',

			fields: [
				'Deletable'
			]
		});

		// Store holding all the resources
		var resourceStore = App.resourceStore = Ext.create("Sch.data.ResourceStore", {
			model   : 'Resource',
			sortInfo: { field: 'Name', direction: "ASC" },

			data : [
				{ Id : 'a', Name : 'Rob',       Type : 'Sales' },
				{ Id : 'b', Name : 'Mike',      Type : 'Sales' },
				{ Id : 'c', Name : 'Kate',      Type : 'Management' },
				{ Id : 'd', Name : 'Lisa',      Type : 'Developer' },
				{ Id : 'e', Name : 'Dave',      Type : 'Developer' },
				{ Id : 'f', Name : 'Arnold',    Type : 'Developer' },
				{ Id : 'g', Name : 'Lee',       Type : 'Sales' },
				{ Id : 'h', Name : 'Jong',      Type : 'Management' }
			]
		});

		// Store holding all the events
		var eventStore = App.eventStore = Ext.create("Sch.data.EventStore", {
			model : 'Event',
			data: [
				{ Name : 'Some task', StartDate: '2012-06-21 09:30', EndDate: '2012-06-21 12:00', ResourceId: 'd', Draggable: true, Deletable: true },
				{ Name : 'You cannot delete me', StartDate: '2012-06-21 10:00', EndDate: '2012-06-21 13:00', ResourceId: 'f', Draggable: true, Deletable: false }
			]
		});

		var start = new Date(2012, 5, 21, 7);
		var end = new Date(2012, 5, 21, 20);
        var editor = new Sch.plugin.SimpleEditor({ dataIndex: 'Name' });

		var ds = Ext.create("Sch.panel.SchedulerGrid", {
			renderTo    : 'example-container',
            height      : ExampleDefaults.height,
            width       : ExampleDefaults.width,
            rowHeight : 30,
			title: 'Scheduler Event Tools',
			resourceStore   : resourceStore,
			eventStore      : eventStore,
			viewPreset  : 'hourAndDay',
			startDate   : start,
			endDate     : end,
			columns: [
				{ header : 'Staff', sortable:true, width:130, dataIndex : 'Name' }
			],

			plugins: [
                editor,
                
				Ext.create('Sch.plugin.EventTools', {
			        items : [
				        { type: 'details',      handler: onToolClick,   tooltip: 'Show Event Details' },
				        { type: 'edit',         handler: onToolClick,   tooltip: 'Edit Event' },
				        { type: 'split',        handler: onToolClick,   tooltip: 'Split Event' },
				        { type: 'delete',       handler: onToolClick,   tooltip: 'Remove Event', visibleFn: function(model) { return model.get('Deletable'); } },
				        { type: 'shiftback',    handler: onToolClick,   tooltip: 'Shift task 1hr backward' },
				        { type: 'shiftforward', handler: onToolClick,   tooltip: 'Shift task 1hr forward' }
			        ]
                })
			]
		});

		function onToolClick(event, toolEl, toolsMenu, tool) {
            var record = toolsMenu.getRecord();

            switch(tool.type) {
                case 'details': 
                    Ext.Msg.alert('Bogus alert', 'Show cool content about this event');
                break;

                case 'edit':
                    editor.edit(record);
                break;

                case 'split':
                    var clone = record.copy(null);
                    var nbrMinutes = Sch.util.Date.getDurationInMinutes(record.getStartDate(), record.getEndDate());
                    
                    record.setEndDate(Ext.Date.add(record.getStartDate(), Ext.Date.MINUTE, nbrMinutes/2));
                    clone.setStartDate(record.getEndDate());
                    
                    eventStore.add(clone);
                break;

                case 'shiftforward':
                    record.shift(Ext.Date.HOUR, 1);
                break;

                case 'shiftback':
                    record.shift(Ext.Date.HOUR, -1);
                break;

                case 'delete':
                    eventStore.remove(record);
                    toolsMenu.hide();
                break;
            }
		}

		return ds;
	}
};