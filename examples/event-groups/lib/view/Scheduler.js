Ext.define("App.view.Scheduler", {
    extend : 'Sch.SchedulerPanel',

    requires : [
        'App.view.LineDragZone',
        'App.view.Lines'
    ],

    stripeRows              : true,
    resizeHandles           : 'none',
    allowOverlap            : true,
    enableDragCreation      : false,
    constrainDragToResource : true,
    eventResizeHandles      : 'none',
    viewPreset              : 'customday',
    viewConfig              : {
        barMargin : 4
    },
    rowHeight               : 40,

    // Extra cfg for drag zone
    dragConfig              : null,

    deliveryStore : null,

    eventBodyTemplate : '{text}<div class="nbrAssigned">{personsAssigned}</div><div style="{eventLineStyle}" class="dash {eventLineCls}"><div class="bullet"></div></div>',


    eventRenderer : function (eventRecord, deliveryStep, tplData) {
        tplData.cls = eventRecord.get('DeliveryId') + ' ' + eventRecord.getResourceId();

        var deliveryRecord = eventRecord.getDelivery();
        var deliveryDate = deliveryRecord.get('Date');
        var eventLineCls;

        if (Ext.Date.between(deliveryDate, eventRecord.getStartDate(), eventRecord.getEndDate())) {
            eventLineCls = 'x-hidden';
        }
        var view = this,
            position,
            diff,
            eventLineCls

        if (deliveryDate > eventRecord.getEndDate()) {
            position = 'right';
            diff = view.getCoordinateFromDate(deliveryDate) - view.getCoordinateFromDate(eventRecord.getEndDate()) + 2;
        } else {
            position = 'left';
            diff = view.getCoordinateFromDate(eventRecord.getStartDate()) - view.getCoordinateFromDate(deliveryDate) - 2;
        }

        if (Math.abs(diff) < 5) {
            eventLineCls = 'x-hidden';
        }

        var eventLineStyle = Ext.String.format('{0}:-{1}px;width:{1}px', position, diff);
        eventLineCls = eventLineCls || (position === 'right' ? 'dash-after' : 'dash-before');

        return Ext.apply({
            eventLineStyle : eventLineStyle,
            eventLineCls   : eventLineCls,
            text           : eventRecord.getResourceId() === 'truckloading' ? 'Truck Loading' : '',
            personsAssigned : deliveryStep.get('PersonsAssigned')
        }, eventRecord.data);
    },

    initComponent : function () {
        var me = this;
        Ext.apply(this, {

            columns : [
                {header : 'Name', sortable : true, width : 120, dataIndex : 'Name'},
                {
                    text      : 'Persons assigned',
                    width     : 150,

                    xtype     : 'widgetcolumn',
                    dataIndex : 'PersonsAssigned',

                    widget    : {
                        xtype   : 'sliderwidget',
                        minValue : 1,
                        maxValue : 10,
                        listeners : {
                            change : function(widget, value) {
                                var rec = widget && widget.getWidgetRecord && widget.getWidgetRecord();

                                if (rec) {
                                    rec.set('PersonsAssigned', value)
                                }
                            }
                        }
                    }
                }
            ],

            plugins : [
                this.zonePlugin = new Sch.plugin.Zones({
                    store : new Ext.data.JsonStore({
                        model : 'Sch.model.Range',
                        data  : [
                            {
                                StartDate : new Date(2011, 0, 1, 12, 30),
                                EndDate   : new Date(2011, 0, 1, 13, 15),
                                Cls       : 'customZoneStyle'
                            }
                        ]
                    })
                }),
                this.linePlugin = new App.view.Lines({
                    store : this.deliveryStore
                })
            ]
        });

        this.callParent(arguments);


    },

    afterRender : function () {
        this.callParent(arguments);

        var v = this.getSchedulingView();

        this.dz = new App.view.LineDragZone(this.el, Ext.apply({
            scheduler     : this,
            view          : v,
            sequenceStore : this.sequenceStore,
            linePlugin    : this.linePlugin
        }, this.dragConfig || {}));


    }
});

