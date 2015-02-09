Ext.ns('App');

Ext.Loader.setConfig({ enabled : true, disableCaching : true });
Ext.Loader.setPath('Sch', '../../js/Sch');

Ext.require([
    'Sch.panel.SchedulerGrid',
    'Sch.plugin.Zones'
]);


Ext.onReady(function () {
    Ext.QuickTips.init();

    if (Ext.isIE && Ext.ieVersion < 10) {
        Ext.Msg.alert('Please note...', 'This example requires a browser with support for HTML5 and CSS3.');
    } else {
        App.Scheduler.init();
    }
});

App.Scheduler = {

    // Initialize application
    init : function () {
        this.scheduler = this.createGrid();
        this.scheduler.on('eventclick', this.onEventClick, this);
    },

    onEventClick : function (scheduler, model, e) {

        if (e.getTarget('.reschedule')) {
            var newStart = model.getStartDate(),
                newEnd = model.getEndDate();

            if (e.getTarget('.forward-one')) {
                newStart = Ext.Date.add(newStart, Ext.Date.DAY, 1);
                newEnd = Ext.Date.add(newEnd, Ext.Date.DAY, 1);
            } else if (e.getTarget('.back-one')) {
                newStart = Ext.Date.add(newStart, Ext.Date.DAY, -1);
                newEnd = Ext.Date.add(newEnd, Ext.Date.DAY, -1);
            }

            if (this.validateBooking(newStart, newEnd)) {
                model.beginEdit();
                model.set('StartDate', newStart);
                model.set('EndDate', newEnd);
                model.endEdit();
            } else {
                Ext.get(e.getTarget('.sch-event')).highlight('#FF0000');
            }
        }
    },

    createGrid : function () {
        Ext.define('Zone', {
            extend : 'Sch.model.Range',
            fields : ['InnerCls', 'Msg']
        });

        Ext.define('Cabin', {
            extend : 'Sch.model.Resource',
            fields : [
                'ImageUrl',
                'Sleeps'
            ]
        });

        Ext.define('Reservation', {
            extend : 'Sch.model.Event',
            fields : [
                { name : 'GuestName', type : 'string' },
                { name : 'ResourceId' },
                { name : 'StartDate', type : 'date', dateFormat : 'Y-m-d' },
                { name : 'NbrNights' },
                { name : 'NbrGuests' },

                // Custom calculation of end date
                {
                    name : 'EndDate', type : 'date', convert : function (v, r) {
                    return Sch.util.Date.add(r.getStartDate() || Ext.Date.parseDate(r.data.StartDate, "Y-m-d"), Sch.util.Date.DAY, r.data.NbrNights);
                }
                }
            ]
        });

        var cabinStore = Ext.create('Sch.data.ResourceStore', {
                sorters : 'Name',
                model   : 'Cabin',
                data    : [
                    { Id : 'r1', Name : 'Ski Chateau', ImageUrl : 'house1.jpg', Sleeps : 20 },
                    { Id : 'r2', Name : 'Cabin Deluxe', ImageUrl : 'house2.jpg', Sleeps : 15 },
                    { Id : 'r3', Name : 'Cabin Superior', ImageUrl : 'house3.jpg', Sleeps : 10 },
                    { Id : 'r4', Name : 'Lodge 1', ImageUrl : 'house4.jpg', Sleeps : 8 },
                    { Id : 'r5', Name : 'Lodge 2', ImageUrl : 'house5.jpg', Sleeps : 8 },
                    { Id : 'r6', Name : 'Lodge 3', ImageUrl : 'house6.jpg', Sleeps : 8 }
                ]
            }),

        // Store holding all the events
            reservationStore = Ext.create('Sch.data.EventStore', {
                model : 'Reservation',
                proxy : {
                    type : 'ajax',
                    url  : 'bookingdata.js'
                }
            });

        var cabinTpl = new Ext.Template(
            '<img class="image" src="images/{ImageUrl}" />',
            '<h3 class="name">{Name}</h3>',
            '<div class="bedImg" title="Sleeps {Sleeps}"><span class="sleeps">{Sleeps}</span></div>'
        );

        this.zoneStore = Ext.create("Ext.data.JsonStore", {
            model : 'Zone',
            data  : [{
                StartDate : new Date(2011, 0, 13),
                EndDate   : new Date(2011, 0, 14),
                InnerCls  : 'maintenance',
                Msg       : 'Maintenance'
            }]
        });

        var g = new Ext.create("Sch.panel.SchedulerGrid", {
            border       : true,
            height       : ExampleDefaults.height,
            width        : ExampleDefaults.width,
            renderTo     : 'example-container',
            readOnly     : true,
            allowOverlap : false,
            rowHeight    : 90,
            forceFit     : true,
            viewConfig   : { barMargin : 10 },
            loadMask     : { store : reservationStore },

            // Setup static columns
            columns      : [
                {
                    header    : 'Name',
                    dataIndex : 'Name',
                    sortable  : true,
                    width     : 250,
                    xtype     : 'templatecolumn',
                    tpl       : cabinTpl
                }
            ],

            startDate  : new Date(2011, 0, 3),
            endDate    : new Date(2011, 0, 16),
            viewPreset : 'dayAndWeek',

            resourceStore : cabinStore,
            eventStore    : reservationStore,

            eventRenderer     : function (evt, res, tplData) {
                return Ext.apply({ width : tplData.width }, evt.data);
            },

            // Specialized template visualizing a booking
            eventBodyTemplate : new Ext.XTemplate(
                '<div class="bg"></div>',
                '<div class="bg2"></div>',
                '<div class="datect"><span class="dayname">{[fm.date(values.StartDate, "l")]}</span><span class="date {[(values.StartDate.getDay() === 0 || values.StartDate.getDay() === 6) ? "weekend" : ""]}">{[fm.date(values.StartDate, "j")]}</span><span class="month">{[fm.date(values.StartDate, "M Y")]}</span></div>' +
                '<div class="event-content" style="width:{[values.width-65]}px">',
                '<dl class="guest-details">',
                '<dt>Duration</dt>',
                '<dd>{NbrNights} nights</dd>',
                '<dt>Tenant:</dt>',
                '<dd>{GuestName}<span class="nbr-guests" title="{NbrGuests} guests">{NbrGuests}</span></dd>',
                '</dl>',
                '</div>',
                '<div class="reschedule">',
                '<command src="images/arrows.gif" title="Move to previous day" class="back-one"></command>',
                '<command src="images/arrows.gif" title="Move to next day" class="forward-one"></command>',
                '</div>'
            ),

            plugins : [
                this.zonePlugin = Ext.create("Sch.plugin.Zones", {
                    template : new Ext.XTemplate(
                        '<tpl for=".">',
                        '<div class="sch-zone {uniquecls} blocked" style="left:{left}px;width:{width}px;height:{height}px">',
                        '<div class="block-message">',
                        '<span class="{InnerCls}">{Msg}</span>',
                        '</div>',
                        '</div>',
                        '</tpl>'
                    ),
                    store    : this.zoneStore
                })
            ]
        });

        reservationStore.load();

        return g;
    },

    validateBooking : function (start, end) {
        var blockedRecord = this.zoneStore.first();
        return !Sch.util.Date.intersectSpans(blockedRecord.getStartDate(), blockedRecord.getEndDate(), start, end);
    }
};

