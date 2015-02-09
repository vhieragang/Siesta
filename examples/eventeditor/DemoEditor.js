// A simple preconfigured editor plugin

Ext.define('App.DemoEditor', {

    extend : "Sch.plugin.EventEditor",

    alias : 'plugin.myeditor',

    height : 190,
    width  : 280,

    initComponent : function () {

        Ext.apply(this, {

            timeConfig : {
                minValue : '08:00',
                maxValue : '18:00'
            },

//            dateConfig      : {
//            },
//            
//            durationUnit    : Sch.util.Date.DAY,
//            durationConfig  : {
//                minValue    : 1,
//                maxValue    : 10
//            },

            buttonAlign       : 'center',

            // panel with form fields
            fieldsPanelConfig : {
                xtype : 'container',

                layout : {
                    type           : 'card',
                    deferredRender : true
                },

                items : [
                    // form for "Meeting" EventType
                    {
                        EventType     : 'Meeting',
                        preventHeader : true,
                        xtype         : 'form',
                        padding       : 5,
                        layout        : 'hbox',

                        style  : 'background:#fff',
                        cls    : 'editorpanel',
                        border : false,

                        items : [
                            {
                                xtype : 'container',
                                cls   : 'image-ct',

                                items : this.img = new Ext.Img({
                                    cls : 'profile-image'
                                }),

                                width : 100
                            },
                            {
                                xtype : 'container',

                                style  : 'background:#fff',
                                border : false,

                                flex : 2,

                                layout : 'anchor',

                                defaults : {
                                    anchor : '90%'
                                },

                                items : [
                                    this.titleField = new Ext.form.TextField({

                                        // doesn't work in "defaults" for now (4.0.1)
                                        labelAlign : 'top',

                                        name       : 'Title',
                                        fieldLabel : 'Task'
                                    }),

                                    this.locationField = new Ext.form.TextField({

                                        // doesn't work in "defaults" for now (4.0.1)
                                        labelAlign : 'top',

                                        name       : 'Location',
                                        fieldLabel : 'Location'
                                    })
                                ]
                            }
                        ]
                    },
                    // eof form for "Meeting" EventType

                    // form for "Appointment" EventType
                    {
                        EventType : 'Appointment',

                        xtype         : 'form',
                        style         : 'background:#fff',
                        cls           : 'editorpanel',
                        border        : false,
                        preventHeader : true,

                        padding : '5 10 0 10',

                        layout : {
                            type  : 'vbox',
                            align : 'stretch'
                        },

                        items : [
                            new Ext.form.TextField({

                                labelAlign : 'top',

                                name       : 'Location',
                                fieldLabel : 'Location'
                            }),
                            {
                                xtype      : 'combo',
                                labelAlign : 'top',

                                store      : [ "Dental", "Medical" ],

                                // Prevent clicks on the bound list to close the editor
                                listConfig : { cls : 'sch-event-editor-ignore-click' },

                                name       : 'Type',
                                fieldLabel : 'Type'
                            }
                        ]
                    }
                    // eof form for "Appointment" EventType
                ]
            }
            // eof panel with form fields
        });

        this.on('expand', this.titleField.focus, this.titleField);

        this.callParent(arguments);
    },


    show : function (eventRecord) {
        var resourceId = eventRecord.getResourceId();
        // Load the image of the resource
        this.img.setSrc(this.schedulerView.resourceStore.getById(resourceId).get('ImgUrl'));

        this.callParent(arguments);
    }
});