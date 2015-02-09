Ext.Loader.setConfig({ enabled : true, disableCaching : true });
Ext.Loader.setPath('Sch', '../../js/Sch');

Ext.require([
    'Sch.util.Debug',
    'Sch.panel.SchedulerGrid',
    'Sch.plugin.CurrentTimeLine'
]);

App = {

    // Initialize application
    init : function () {
        Ext.QuickTips.init();

        var start = Ext.Date.add(new Date(), Date.MONTH, -1);
        Ext.Date.clearTime(start);
        start.setDate(1);

        var vp = new Ext.Viewport({
            layout : 'border',
            items  : [
                {
                    region    : 'north',
                    bodyStyle : 'padding:15px',
                    contentEl : 'example-description'
                },
                new MeetupPanel({
                    region        : 'center',
                    rowHeight     : 80,
                    plugins       : Ext.create("Sch.plugin.CurrentTimeLine"),
                    startDate     : start,
                    endDate       : Sch.util.Date.add(start, Sch.util.Date.MONTH, 4),
                    viewPreset    : 'monthAndYear',
                    eventRenderer : function (event, r, tplData) {
                        tplData.cls = event.get('status');
                        return event.data;
                    }
                })
            ]
        });
    }
};

Ext.onReady(App.init);

Ext.define("MeetupPanel", {
    extend      : "Sch.panel.SchedulerGrid",
    readOnly    : true,
    columnLines : false,
    loadMask    : true,

    groupTemplate : new Ext.XTemplate(
        '<p class="groupName">{name}</p>' +
            '<span class="members">{members} members</span>' +
            '<span class="location">{city} ({[values.country.toUpperCase()]})</span>'
    ),

    eventBodyTemplate : new Ext.XTemplate(
        '<img src="images/pin.png" class="pin"/>',
        '<div class="eventName"><a href="{event_url}" target="_blank">{name}</a></div>',
        '<div class="startTime">{[Ext.Date.format(values.StartDate, "F d G:i")]}</div>',
        '<div class="rsvps">{rsvpcount} {[values.status === "past" ? " attended" : " members have RSVP\'d"]}</div>'
    ),

    tooltipTpl : new Ext.Template('<h3>{name}</h3><span>{description}</span>'),

    initComponent : function () {
        Ext.define('MeetupGroup', {
            extend : 'Sch.model.Resource',
            fields : [
                {name : 'Id', mapping : 'id'},
                {name : 'name'},
                {name : 'rating'},
                {name : 'city'},
                {name : 'country'},
                {name : 'members'}
            ]
        });

        // Store holding all the user groups
        var groupStore = new Sch.data.ResourceStore({
            autoLoad : true,
            proxy    : {
                type        : 'jsonp',
                url         : 'http://api.meetup.com/groups.json',
                extraParams : {
                    key   : '577d3d6b164953e5b241bc32137646',
                    topic : 'ext-js'
                },
                limitParam  : undefined,
                pageParam   : undefined,
                startParam  : undefined,
                reader      : {
                    rootProperty : 'results'
                }
            },

            model : 'MeetupGroup'
        });

        Ext.define('Meeting', {
            extend : 'Sch.model.Event',
            fields : [
                {name : 'ResourceId', mapping : 'group_id'},
                {name : 'StartDate', mapping : 'time', type : 'date', dateFormat : 'D M d G:i:s T Y'},
                {name : 'EndDate', mapping : 'time', type : 'date', dateFormat : 'D M d G:i:s T Y'},
                {name : 'name'},
                {name : 'description'},
                {name : 'status'},
                {name : 'time'},
                {name : 'event_url'},
                {name : 'rsvpcount'}
            ]
        });

        // Store holding all the meetings
        var eventStore = new Sch.data.EventStore({
            proxy     : {
                type        : 'jsonp',
                url         : 'http://api.meetup.com/events.json',
                extraParams : {
                    key : '577d3d6b164953e5b241bc32137646'
                },
                reader      : {
                    rootProperty : 'results'
                },
                limitParam  : undefined,
                pageParam   : undefined,
                startParam  : undefined
            },
            model     : 'Meeting',
            listeners : {
                beforeload : {
                    fn    : function (s, o) {
                        Ext.apply(o.params, {
                            after  : Ext.Date.format(this.getStart(), 'mdY'),
                            before : Ext.Date.format(this.getEnd(), 'mdY')
                        });
                    },
                    scope : this
                }
            }
        });

        Ext.apply(this, {

            resourceStore : groupStore,
            eventStore    : eventStore,

            columns : [
                { xtype : 'templatecolumn', header : 'Group', width : 300, tpl : this.groupTemplate}
            ],

            viewConfig : {
                getRowClass : function (rec) {
                    if (rec.getEvents().length === 0) {
                        return 'no-scheduled-meetup';
                    }
                }
            }
        });

        groupStore.on('load', function () {
            eventStore.load({
                params : {
                    group_id : groupStore.collect('Id').join(',')
                }
            });
        });

        this.callParent(arguments);
    }
});
