Ext.ns('App');

Ext.Loader.setConfig({enabled : true, disableCaching : true });
Ext.Loader.setPath('Sch', '../../js/Sch');

Ext.require([
    'Sch.panel.SchedulerTree',
    'Sch.plugin.Zones'
]);

Ext.onReady(function () {
    Ext.define('Gate', {
        extend : 'Sch.model.Resource',
        fields : ['Capacity']
    });

    var resourceStore = Ext.create('Sch.data.ResourceTreeStore', {
        model      : 'Gate',
        folderSort : true,
        proxy      : {
            type : 'ajax',
            //the store will get the content from the .js file
            url  : 'get-data.js'
        }
    });


    // Store holding all the departures
    var flightStore = Ext.create('Sch.data.EventStore', {
        data : [
            // Grouping tasks
            {ResourceId : 3, Name : 'Summary', StartDate : "2011-12-02 08:20", EndDate : "2011-12-02 11:25"},
            {ResourceId : 3, Name : 'Summary', StartDate : "2011-12-02 12:10", EndDate : "2011-12-02 13:50"},
            {ResourceId : 3, Name : 'Summary', StartDate : "2011-12-02 14:30", EndDate : "2011-12-02 16:10"},

            {ResourceId : 6, Name : 'London 895', StartDate : "2011-12-02 08:20", EndDate : "2011-12-02 09:50"},
            {ResourceId : 4, Name : 'Moscow 167', StartDate : "2011-12-02 09:10", EndDate : "2011-12-02 10:40"},
            {ResourceId : 5, Name : 'Berlin 291', StartDate : "2011-12-02 09:25", EndDate : "2011-12-02 11:25"},
            {ResourceId : 7, Name : 'Brussels 107', StartDate : "2011-12-02 12:10", EndDate : "2011-12-02 13:50"},
            {ResourceId : 8, Name : 'Krasnodar 101', StartDate : "2011-12-02 14:30", EndDate : "2011-12-02 16:10"},

            {ResourceId : 17, Name : 'Split 811', StartDate : "2011-12-02 16:10", EndDate : "2011-12-02 18:30"},
            {ResourceId : 18, Name : 'Rome 587', StartDate : "2011-12-02 13:15", EndDate : "2011-12-02 14:25"},
            {ResourceId : 24, Name : 'Prague 978', StartDate : "2011-12-02 16:40", EndDate : "2011-12-02 18:00"},
            {ResourceId : 25, Name : 'Stockholm 581', StartDate : "2011-12-02 11:10", EndDate : "2011-12-02 12:30"},

            {ResourceId : 10, Name : 'Copenhagen 111', StartDate : "2011-12-02 16:10", EndDate : "2011-12-02 18:30"},
            {ResourceId : 11, Name : 'Gothenburg 233', StartDate : "2011-12-02 13:15", EndDate : "2011-12-02 14:25"},
            {ResourceId : 12, Name : 'New York 231', StartDate : "2011-12-02 16:40", EndDate : "2011-12-02 18:00"},
            {ResourceId : 13, Name : 'Paris 321', StartDate : "2011-12-02 11:10", EndDate : "2011-12-02 12:30"}
        ]
    });

    var tree = Ext.create('Sch.panel.SchedulerTree', {
        title            : 'Airport departures',
        height           : ExampleDefaults.height,
        width            : ExampleDefaults.width,
        renderTo         : 'example-container',
        rowHeight        : 32,
        eventStore       : flightStore,
        resourceStore    : resourceStore,
        useArrows        : true,
        viewPreset       : 'hourAndDay',
        startDate        : new Date(2011, 11, 2, 8),
        endDate          : new Date(2011, 11, 2, 18),
        multiSelect      : true,
        eventRenderer    : function (flight, resource, meta) {
            if (resource.data.leaf) {
                meta.cls = 'leaf';
                return flight.get('Name');
            } else {
                meta.cls = 'group';
                return '&nbsp;';
            }
        },

        layout           : { type : 'hbox', align : 'stretch' },

        lockedGridConfig : {
            resizeHandles : 'e',
            resizable     : { pinned : true },
            width         : 300
        },

        schedulerConfig  : {
            scroll      : true,
            columnLines : false,
            flex        : 1
        },

        onEventCreated : function (newFlight) {
            newFlight.set('Name', 'New departure');
        },

        columnLines : false,
        rowLines    : true,

        columns : [
            {
                xtype     : 'treecolumn', //this is so we know which column will show the tree
                text      : 'Name',
                width     : 200,
                sortable  : true,
                dataIndex : 'Name'
            },
            {
                text      : 'Capacity',
                width     : 100,
                sortable  : true,
                dataIndex : 'Capacity'
            },
            {
                text      : 'Some other property',
                width     : 100,
                sortable  : true,
                dataIndex : 'Foo'
            }
        ],
        plugins : [
            Ext.create("Sch.plugin.Zones", {
                store : Ext.create('Ext.data.JsonStore', {
                    model : 'Sch.model.Range',

                    data : [
                        {
                            StartDate : new Date(2011, 11, 2, 11),
                            EndDate   : new Date(2011, 11, 2, 13),
                            Cls       : 'sch-cloud-thunder'
                        },
                        {
                            StartDate : new Date(2011, 11, 2, 15),
                            EndDate   : new Date(2011, 11, 2, 18),
                            Cls       : 'sch-cloud-sun'
                        }
                    ]
                })
            })
        ],

        viewConfig : {
            getRowClass : function (r) {
                if (r.get('Id') === 3 || r.parentNode.get('Id') === 3) {
                    return 'some-grouping-class';
                }

                if (r.get('Id') === 9 || r.parentNode.get('Id') === 9) {
                    return 'some-other-grouping-class';
                }
            }
        },

        tbar : [
            'Filter: ',
            {
                xtype     : 'triggerfield',
                emptyText : 'Filter resources',

                triggerCls : 'x-form-clear-trigger',

                onTriggerClick : function () {
                    this.setValue('')
                },

                listeners : {
                    change : function (field, newValue, oldValue) {
                        if (newValue) {
                            var regexps = Ext.Array.map(newValue.split(/\s+/), function (token) {
                                return new RegExp(Ext.String.escapeRegex(token), 'i')
                            })
                            var length = regexps.length

                            resourceStore.filterTreeBy(function (resource) {
                                var name = resource.get('Name')

                                // blazing fast "for" loop! :)
                                for (var i = 0; i < length; i++)
                                    if (!regexps[ i ].test(name)) return false

                                return true
                            })
                        } else {
                            resourceStore.clearTreeFilter()
                        }
                    },

                    specialkey : function (field, e, t) {
                        if (e.keyCode === e.ESC) field.reset();
                    }
                }
                // eof listeners
            }
        ]
    });
});

