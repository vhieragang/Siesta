Ext.ns('App');

Ext.require([
    'Sch.panel.SchedulerGrid',
    'Sch.plugin.HeaderZoom'
]);

Ext.onReady(function () {
    App.Scheduler.init();
});

App.Scheduler = {

    // Initialize application
    init : function () {
        var resourceStore = Ext.create('Sch.data.ResourceStore', {
            data : [
                {Id : 'r1', Name : 'Mats'},
                {Id : 'r2', Name : 'Nick'},
                {Id : 'r3', Name : 'Jakub'},
                {Id : 'r4', Name : 'Tom'},
                {Id : 'r5', Name : 'Mary'}
            ]
        });

        var eventStore = Ext.create('Sch.data.EventStore', {
            data : [
                //To clearly see the seconds-length event the custom viewPreset should be added to zoomLevels
                {ResourceId : 'r1', Name : 'Seconds', PercentAllocated : 20, StartDate : new Date(2011, 0, 1, 12, 10, 30), EndDate : new Date(2011, 0, 1, 12, 11)},
                {ResourceId : 'r2', Name : 'Minutes', PercentAllocated : 30, StartDate : new Date(2011, 0, 1, 12, 10), EndDate : new Date(2011, 0, 1, 12, 15)},
                {ResourceId : 'r3', Name : 'Hours', PercentAllocated : 40, StartDate : new Date(2011, 0, 1, 13), EndDate : new Date(2011, 0, 1, 16)},
                {ResourceId : 'r4', Name : 'Days', PercentAllocated : 50, StartDate : new Date(2011, 0, 1, 8), EndDate : new Date(2011, 0, 4, 18)},
                {ResourceId : 'r5', Name : 'Months', PercentAllocated : 60, StartDate : new Date(2011, 0, 1, 16), EndDate : new Date(2011, 1, 2, 13)}
            ]
        });

        var slider;

        var s = Ext.create("Sch.panel.SchedulerGrid", {
            height          : ExampleDefaults.height / 2 + 50,
            width           : 800,
            infiniteScroll  : true,
            viewPreset      : 'hourAndDay',

            startDate       : new Date(2011, 0, 1, 6),
            endDate         : new Date(2011, 0, 2, 20),

            columns         : [
                { header : 'Name', sortable : true, width : 100, dataIndex : 'Name' }
            ],

            resourceStore   : resourceStore,
            eventStore      : eventStore,

            listeners       : {
                afterlayout : function () {
                    slider.setMinValue(s.minZoomLevel);
                    slider.setMaxValue(s.maxZoomLevel);

                    slider.setValue(s.getCurrentZoomLevelIndex());
                },

                single : true
            },

            tbar            : [
                {
                    xtype   : 'buttongroup',
                    title   : 'Zoom in/out functionality',
                    columns : 4,
                    width   : 230,
                    items   : [
                        {
                            text    : '+',
                            scale   : 'medium',
                            iconCls : 'zoomIn',
                            handler : function () {
                                s.zoomIn();
                            }
                        },
                        {
                            text    : '-',
                            scale   : 'medium',
                            iconCls : 'zoomOut',
                            handler : function () {
                                s.zoomOut();
                            }
                        },
                        {
                            text    : 'Max',
                            scale   : 'medium',
                            iconCls : 'zoomMax',
                            handler : function () {
                                s.zoomInFull();
                            }
                        },
                        {
                            text    : 'Min',
                            scale   : 'medium',
                            iconCls : 'zoomMin',
                            handler : function () {
                                s.zoomOutFull();
                            }
                        }
                    ]
                }
            ],
            bbar            : [
                {
                    xtype   : 'label',
                    text    : 'Zoom out'
                },
                '     ',
                slider = new Ext.slider.SingleSlider({
                    style     : 'margin-left:10px',
                    width     : 100,
                    value     : 0,
                    increment : 1,
                    minValue  : 0,
                    maxValue  : 10,
                    listeners : {
                        change : function (p, v) {
                            s.zoomToLevel(parseInt(v));
                        }
                    }
                }),
                '     ',
                {
                    xtype   : 'label',
                    text    : 'Zoom in'
                }
            ],

            plugins : new Sch.plugin.HeaderZoom({})
        });

        s.on('zoomchange', function (scheduler, zoomLevel) {
            slider.setValue(zoomLevel)
        });
        
        var slider1;

        var s1 = Ext.create("Sch.panel.SchedulerGrid", {
            height          : ExampleDefaults.height / 2,
            width           : 800,
            viewPreset      : 'hourAndDay',

            startDate       : new Date(2011, 0, 1, 6),
            endDate         : new Date(2011, 0, 2, 20),

            columns         : [
                { header : 'Name', sortable : true, width : 100, dataIndex : 'Name' }
            ],

            resourceStore   : resourceStore,
            eventStore      : eventStore,

            listeners       : {
                afterlayout : function () {
                    slider1.setMinValue(s.minZoomLevel);
                    slider1.setMaxValue(s.maxZoomLevel);

                    slider1.setValue(s.getCurrentZoomLevelIndex());
                },

                single : true
            },

            tbar            : [
                {
                    xtype   : 'buttongroup',
                    title   : 'Zoom in/out functionality',
                    columns : 4,
                    width   : 230,
                    items   : [
                        {
                            text    : '+',
                            scale   : 'medium',
                            iconCls : 'zoomIn',
                            handler : function () {
                                s1.zoomIn();
                            }
                        },
                        {
                            text    : '-',
                            scale   : 'medium',
                            iconCls : 'zoomOut',
                            handler : function () {
                                s1.zoomOut();
                            }
                        },
                        {
                            text    : 'Max',
                            scale   : 'medium',
                            iconCls : 'zoomMax',
                            handler : function () {
                                s1.zoomInFull();
                            }
                        },
                        {
                            text    : 'Min',
                            scale   : 'medium',
                            iconCls : 'zoomMin',
                            handler : function () {
                                s1.zoomOutFull();
                            }
                        }
                    ]
                }
            ],
            bbar            : [
                {
                    xtype   : 'label',
                    text    : 'Zoom out'
                },
                '     ',
                slider1 = new Ext.slider.SingleSlider({
                    style     : 'margin-left:10px',
                    width     : 100,
                    value     : 0,
                    increment : 1,
                    minValue  : 0,
                    maxValue  : 10,
                    listeners : {
                        change : function (p, v) {
                            s1.zoomToLevel(parseInt(v));
                        }
                    }
                }),
                '     ',
                {
                    xtype   : 'label',
                    text    : 'Zoom in'
                }
            ],

//            uncomment to enable snapping behaviour
//            dragConfig  : { showExactDropPosition : true },
            resizeConfig    : { showExactResizePosition : true },
            snapRelativeToEventStartDate    : true,
            plugins : new Sch.plugin.HeaderZoom({})
        });

        s1.on('zoomchange', function (scheduler, zoomLevel) {
            slider1.setValue(zoomLevel)
        });
        
        var container = new Ext.panel.Panel({
            height  : ExampleDefaults.height + 100,
            width   : 800,
            layout  : 'border',
            items   : [
                Ext.apply(s, { region: 'north', title: 'infinite scroll' }), 
                Ext.apply(s1, { region: 'center', title: 'no infinite scroll' })
            ]
        });
        
        App.s = s;
        App.s1 = s1;

        container.render('example-container');
    }
};