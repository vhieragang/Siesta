Ext.ns('App');
//Ext.Loader.setConfig({ enabled : true, disableCaching : true });
//Ext.Loader.setPath('Sch', '../../js/Sch');

//Ext.require([
//    'Sch.panel.SchedulerGrid'
//]);

Ext.onReady(function() {
    Ext.QuickTips.init();
    App.SchedulerDemo.init();
});

App.SchedulerDemo = {
    
    // Initialize application
    init : function() {

        Ext.define('Event', {
            extend : 'Sch.model.Event',
            
            // Reuse the resource id for CSS styling
            clsField : 'ResourceId',

            fields : [
                {name: 'Title'}
            ]
        });

        var resLabel = new Ext.form.Label({
                style : 'font-weight:bold',
                text : 15
            }), 
            tip = new Ext.slider.Tip({
                getText: function(thumb){
                    return Ext.String.format('<b>{0} minutes</b>', thumb.value);
                }
            }),
            eventStore = new Sch.data.EventStore({
                model : 'Event',

                proxy : {
                    type : 'ajax',
                    url : 'data.js'
                }
            });

        var colSlider = Ext.create("Ext.slider.Single", {
            width: 100,
            value: 0,
            minValue: 0,
            maxValue: 10,
            increment: 1
        });            

        var sched = new Sch.panel.SchedulerGrid({
            height : ExampleDefaults.height,
            width : ExampleDefaults.width,
            eventBarTextField : 'Title',
            viewPreset : 'hourAndDay',
            startDate : new Date(2010, 11, 9, 8),
            endDate : new Date(2010, 11, 9, 16),
            eventResizeHandles : 'both',
            snapToIncrement : true,
            rowHeight : 30,
            viewConfig : { loadMask : true }, 
            tbar : [
                {
                    xtype : 'label',
                    text : '5 min'
                },
                '       ',
                new Ext.slider.SingleSlider({
                    style:'margin-left:10px',
                    width: 100,
                    value: 15,
                    increment: 5,
                    minValue: 5,
                    maxValue: 60,
                    plugins: tip,

                    listeners : {
                        change : function(s, v) {
                            sched.getSchedulingView().setTimeResolution(Sch.util.Date.MINUTE, v);
                            resLabel.setText(v);
                        },
                        afterrender: function() {
                            this.setValue(sched.getSchedulingView().getTimeResolution().increment);
                        }                             
                    }
                }),
                ' ',
                {
                    xtype : 'label',
                    text : '60 min'
                },
                '  ',
                {
                    xtype : 'label',
                    text : 'Zoom out'
                },
                '       ',
                new Ext.slider.SingleSlider({
                    style:'margin-left:10px',
                    width: 100,
                    value: 0,
                    increment: 1,
                    minValue: 0,
                    maxValue: 10,
                    listeners : {
                        change : function(s, v) {
                            sched.zoomToLevel(v);
                        },
                        afterrender: function() {
                            this.setMinValue(sched.minZoomLevel);
                            this.setMaxValue(sched.maxZoomLevel);
                            this.setValue(sched.getCurrentZoomLevelIndex());
                        }    
                    }
                }),
                ' ',
                {
                    xtype : 'label',
                    text : 'Zoom in'
                },        
                '->',
                {
                    text : 'Snap to increment',
                    enableToggle : true,
                    pressed : true,
                    handler : function() {
                        sched.getSchedulingView().setSnapEnabled(this.pressed);
                    }
                }
            ],

            // Setup static columns
            columns : [
                {header : 'Name', sortable:true, width:100, dataIndex : 'Name'}
            ],
                            
            // Store holding all the resources
            resourceStore : new Sch.data.ResourceStore({
                model : 'Sch.model.Resource',
                data : [
                    {Id : 'MadMike',        Name : 'Mike'},
                    {Id : 'LindaAnderson',  Name : 'Linda'},
                    {Id : 'DonJohnson',     Name : 'Don'},
                    {Id : 'KarenJohnson',   Name : 'Karen'},
                    {Id : 'DougHendricks',  Name : 'Doug'},
                    {Id : 'PeterPan',       Name : 'Peter'}
                ]
            }),
        
            // Store holding all the events
            eventStore : eventStore,
                
            onEventCreated : function(newEventRecord) {
                // Overridden to provide some defaults before adding it to the store
                newEventRecord.set('Title', 'Hello...');
            }
        });

        sched.render('example-container');
        sched.eventStore.load();
    }
};
