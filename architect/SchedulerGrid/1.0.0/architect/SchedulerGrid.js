{
    classAlias: 'widget.uxschedulergrid',
    className: "Ext.ux.SchedulerGrid", 
    inherits: "gridpanel",
    autoName: "MySchedulerGrid",
    noSetup: true,

    "toolbox": {
        "name": "Scheduler Grid",
        "iconCls": "icon-grid",
        "category": "Containers",
        "groups": ["Containers",'Views','Third Party UX'] // TODO: inject Third Party UX category programmatically
    },

    configs: [{
        name    : 'eventStore',
        merge   : false,
        type    : 'store',
        doc     : 'The Ext.data.Store holding the events to be rendered into the scheduler (required).'
    }, {
        name    : 'resourceStore',
        merge   : false,
        type    : 'store',
        doc     : 'The Ext.data.Store holding the resources to be rendered into the scheduler (required).'
    }, {%config%}],

    //define the docked toolbar
    docked: {
        type: 'toolbar',
        configs: {
            dock: 'top'
        },
        items: [{
            type: 'button',
            configs: {
                text: '',
                scale: 'large',
                iconCls: 'icon-previous',
                'designer|processConfig': function() {
                    config.scope = this;
                    return config;
                },
                handler: function() {
                    this.shiftPrevious();
                }
            }
        },{
            type: 'button',
            items: [{
                type:'datemenu',
                configs: {
                    'designer|processConfig': function() {
                        config.scope = this;
                        return config;
                    },
                    handler: function() {
                        var D = Ext.Date;
                        this.setTimeSpan(D.add(date, D.HOUR, 8), D.add(date, D.HOUR, 18));
                    }
                }
            }],
            configs: {
                scale: 'large',
                enableToggle: true,
                text: 'Select Date...',
                toggleGroup: 'span',
                width: 150
            }
        },{
            type:'tbfill'
        },{
            type:'button',
            configs: {
                scale: 'large',
                text: 'Horizontal view',
                pressed: true,
                enableToggle: true,
                toggleGroup: 'orientation',
                iconCls: 'icon-horizontal',
                'designer|processConfig': function() {
                    config.scope = this;
                    return config;
                },
                handler: function() {
                    this.setOrientation('horizontal');
                }
            }
        },{
            type:'button',
            configs: {
                scale: 'large',
                text: 'Vertical view',
                pressed: false,
                enableToggle: true,
                toggleGroup: 'orientation',
                iconCls: 'icon-vertical',
                'designer|processConfig': function() {
                    config.scope = this;
                    return config;
                },
                handler: function() {
                    this.setOrientation('vertical');
                }
            }
        },{
            type:'button',
            configs: {
                scale: 'large',
                text: '',
                iconCls: 'icon-cleardatabase',
                tooltip: 'Clear database',
                'designer|processConfig': function() {
                    config.scope = this;
                    return config;
                },
                handler: function () {
                    this.eventStore.removeAll();
                }
            }
        },{
            type: 'button',
            configs: {
                text: '',
                scale: 'large',
                iconCls: 'icon-next',
                'designer|processConfig': function() {
                    config.scope = this;
                    return config;
                },
                handler: function() {
                    this.shiftNext();
                }
            }
        }]
    },

    //define the columns to be used 
    //in the scheduler grid
    presetColumns: [{
        type: 'gridcolumn',
        configs: {
            text: 'Staff',
            sortable: true, 
            width: 80, 
            dataIndex: 'Name'
        }
    },{
        type: 'gridcolumn',
        configs: {
            text: 'Type',
            dataIndex: 'Type',
            sortable: true, 
            width: 120
        }
    }, {
        type: 'gridcolumn',
        configs: {
            text: 'Color',
            dataIndex: 'Color'
        }
    }],

    //overwrite the existing flyout with a 
    //custom flyout configuration.
    flyout: {
        overwrite: true,
        config: [{
            xtype: 'xds-storeflyoutselect',
            fieldLabel: 'Resource Store',
            hideLabel: false,
            bindTo: {
                name: 'resourceStore',
                event: 'select'
            }
        },{
            xtype: 'xds-storeflyoutselect',
            fieldLabel: 'Event Store',
            hideLabel: false,
            bindTo: {
                name: 'eventStore',
                event: 'select'
            }
        }]
    },

    //define listeners
    listeners: [{
        name: "create",
        fn: "onCreate"
    }],

    onCreate: function() {
        var me = this,
            promise, resourceModel, resourceStore, 
            eventModel, eventStore;

        /**
         * Promise chain order of operation:
         * create resource model
         * create resource store
         * create event model
         * create event store
         * configure scheduler grid
         */
        promise = me.createTopLevelInstance({
            type: 'Sch.model.Resource',
            configs: {
                idProperty : 'YourIdField'
            },
            items: [{
                type: 'datafield',
                configs: {
                    name: 'YourIdField'
                }
            },{
                type: 'datafield',
                configs: {
                    name: 'Name'
                }
            },{
                type: 'datafield',
                configs: {
                    name: 'ImgUrl'
                }
            },{
                type: 'datafield',
                configs: {
                    name: 'Type'
                }
            },{
                type: 'datafield',
                configs: {
                    name: 'Color'
                }
            }]
        }).then(function(model) {
            //find our resource model
            resourceModel = model.snapshot.userConfig['designer|userClassName'];
            //return our next promise in the chain
            return me.createTopLevelInstance({
                type: 'Sch.data.ResourceStore',
                items:[{
                    type: 'memoryproxy',
                    items: [{
                        type:'jsonreader',
                        configs: {
                            root:'data'
                        }
                    }]
                }],
                configs: {
                    autoLoad: true,
                    model: resourceModel,
                    data: [{
                        YourIdField: 'a',
                        Name: 'Rob',
                        Type: 'Sales',
                        ImgUrl: 'images/homer.png',
                        Color: 'Turquoise'
                    },{
                        YourIdField: 'b',
                        Name: 'Mike',
                        Type: 'Sales',
                        ImgUrl: 'images/homer.png',
                        Color: 'Coral'
                    },{
                        YourIdField: 'c',
                        Name: 'Kate',
                        Type: 'Product manager',
                        ImgUrl: 'images/lisa.jpg',
                        Color: 'CornflowerBlue'
                    },{
                        YourIdField: 'd',
                        Name: 'Lisa',
                        Type: 'Developer',
                        ImgUrl: 'images/lisa.jpg',
                        Color: 'Coral'
                    },{
                        YourIdField: 'e',
                        Name: 'Dave',
                        Type: 'Developer',
                        ImgUrl: 'images/dave.jpg',
                        Color: 'Purple'
                    },{
                        YourIdField: 'f',
                        Name: 'Arnold',
                        Type: 'Developer',
                        ImgUrl: 'images/arnold.jpg',
                        Color: 'Gray'
                    },{
                        YourIdField: 'g',
                        Name: 'Lee',
                        Type: 'Marketing',
                        ImgUrl: 'images/lee.jpg',
                        Color: 'Orange'
                    },{
                        YourIdField : 'h',
                        Name : 'Jong',
                        Type : 'Marketing',
                        ImgUrl : 'images/homer.png',
                        Color: 'MediumSlateBlue'
                    }]
                }
            });

        }).then(function(store) {
            //find our resource store; defer applying it 
            //to the grid until the final link in the chain
            resourceStore = store.snapshot.userConfig['designer|userClassName'];
            //return our next promise in the chain
            return me.createTopLevelInstance({
                type: 'Sch.model.Event',
                configs: {
                     nameField : 'Title'
                },
                items: [{
                    type: 'datafield',
                    configs: {
                        name: 'Type'
                    }
                },{
                    type: 'datafield',
                    configs: {
                        name: 'EventType'
                    }
                },{
                    type: 'datafield',
                    configs: {
                        name: 'Title'
                    }
                },{
                    type: 'datafield',
                    configs: {
                        name: 'Location'
                    }
                }]
            })

        }).then(function(model) {
            //find the event model
            eventModel = model.snapshot.userConfig['designer|userClassName'];
            //return our next promise in the chain
            return me.createTopLevelInstance({
                type: 'Sch.data.EventStore',
                items:[{
                    type: 'memoryproxy',
                    items: [{
                        type:'jsonreader',
                        configs: {
                            root:'data'
                        }
                    }]
                }],
                configs: {
                    autoLoad: false,
                    model: eventModel,
                    data: [{
                        ResourceId: 'a',
                        Title: 'Meeting #1', 
                        StartDate: '2011-02-07 11:00',
                        EndDate: '2011-02-08 11:00',
                        Location: 'Some office',
                        EventType: 'Meeting'
                    },{
                        ResourceId: 'b',
                        Title: 'Meeting #2', 
                        StartDate: '2011-02-08 10:00',
                        EndDate: '2011-02-08 20:00',
                        Location : 'Home office',
                        EventType: 'Meeting'
                    },{
                        ResourceId: 'c',
                        Title: 'Meeting #3', 
                        StartDate: '2011-02-08 09:00',
                        EndDate: '2011-02-09 12:00',
                        Location: 'Customer office',
                        EventType: 'Meeting'
                    },{
                        ResourceId: 'd',
                        Title: 'Meeting #4', 
                        StartDate: '2011-02-09 09:00',
                        EndDate: '2011-02-09 20:00',
                        Location: 'Some office',
                        EventType: 'Meeting'
                    },{
                        ResourceId: 'e',
                        Title: 'Appointment #1', 
                        StartDate: '2011-02-09 13:00',
                        EndDate:  '2011-02-10 16:00',
                        Location: 'Home office',
                        Type: 'Dental',
                        EventType: 'Appointment'
                    },{
                        ResourceId: 'f',
                        Title: 'Appointment #2', 
                        StartDate: '2011-02-10 09:00',
                        EndDate: '2011-02-10 21:00',
                        Location: 'Customer office',
                        Type: 'Medical',
                        EventType: 'Appointment'
                    },{
                        ResourceId: 'g',
                        Title: 'Appointment #3', 
                        StartDate: '2011-02-10 17:00',
                        EndDate: '2011-02-11 18:00',
                        Location: 'Home office',
                        Type: 'Medical',
                        EventType: 'Appointment'
                    },{
                        ResourceId: 'h',
                        Title: 'Appointment #4', 
                        StartDate: '2011-02-11 15:00',
                        EndDate: '2011-02-11 22:00',
                        Location: 'Customer office',
                        Type: 'Dental',
                        EventType: 'Appointment'
                    }]
                }
            });
        //final promise configures grid
        }).then(function(store) {
            //find the event store
            eventStore = store.snapshot.userConfig['designer|userClassName'];
            //set our stores together; these are the only required configs
            me.setConfigValue("resourceStore", resourceStore);
            me.setConfigValue("eventStore", eventStore);

            //add the tbar to the grid
            me.createInstance(me.docked);

            //this will add our columns to the grid
            me.createInstance(me.presetColumns);
        })
    }
}