//Ext.Loader.setConfig({ enabled : true, disableCaching : true });
//Ext.Loader.setPath('Sch', '../../js/Sch');

//Ext.require([
//    'Sch.panel.SchedulerGrid',
//    'Sch.plugin.CurrentTimeLine'
//]);

App = {

    // Initialize application
    init : function () {
        Sch.preset.Manager.registerPreset("hour", {
            displayDateFormat : 'G:i',
            shiftIncrement    : 1,
            shiftUnit         : "DAY",
            timeColumnWidth   : 150,
            timeResolution    : {
                unit      : "MINUTE",
                increment : 5
            },
            headerConfig      : {
                middle : {
                    unit       : "HOUR",
                    dateFormat : 'G:i'
                },
                top    : {
                    unit       : "DAY",
                    dateFormat : 'D d/m'
                }
            }
        });

        Ext.QuickTips.init();

        var stationTemplate = new Ext.Template(
            '<span>{Name}</span>' +
                '<img height="62" src="{image}" />' +
                '<a class="listen" target="_blank" href="{URL}" ext:qtip="Click to listen to {Name}"></a>'
        );

        var programTemplate = new Ext.XTemplate(
            '<span class="startTime">{[Ext.Date.format(values.StartDate, "g:i")]}</span>' +
                '<span class="programName">{text}</span>' +
                '<span class="duration">{[values.duration < 3600 ? ((values.duration / 60) + "min") : ((Math.round(10*values.duration/3600)/10) + "h")]}</span>'
        );

        Ext.define('RadioStation', {
            extend : 'Sch.model.Resource',
            fields : [ 'URL', 'image' ]
        });

        Ext.define('Program', {
            extend : 'Sch.model.Event',
            fields : [
                {name : 'StartDate', convert : function (v, r) {
                    return Ext.Date.parseDate(r.data.start + "+00:00", 'c');
                } },
                {name : 'EndDate', convert : function (v, r) {
                    return Sch.util.Date.add(Ext.Date.parseDate(r.data.start + "+00:00", 'c'), Sch.util.Date.SECOND, r.data.duration);
                } },
                {name : 'text'},
                {name : 'duration'}
            ]
        });

        // Store holding the stations
        var stationStore = new Sch.data.ResourceStore({
            model : 'RadioStation',
            data  : stations   // defined in stations.js
        });

        // Store holding all the programs
        var programStore = new Sch.data.EventStore({
            model : 'Program',
            proxy : {
                type        : 'jsonp',
                url         : 'http://opml.radiotime.com/Browse.ashx?',
                extraParams : {
                    c         : "schedule",
                    render    : 'json',
                    partnerId : 'VPVhT0Sa',
                    start     : Ext.Date.format(new Date(), 'Ymd')
                },
                reader      : {
                    type : 'json',
                    rootProperty : 'body'
                }
            }
        });

        var start = new Date();
        Ext.Date.clearTime(start);

        var end = Sch.util.Date.add(start, Sch.util.Date.DAY, 1);

        var g = new Sch.panel.SchedulerGrid({
            readOnly          : true,
            height            : ExampleDefaults.height,
            width             : ExampleDefaults.width,
            renderTo          : 'example-container',
            columnLines       : false,
            resourceStore     : stationStore,
            eventStore        : programStore,
            loadMask          : true,
            eventBodyTemplate : programTemplate,
            rowHeight         : 70,
            tooltipTpl        : new Ext.XTemplate('{[Ext.Date.format(values.StartDate, "g:i")]} - {text}').compile(),
            startDate         : start,
            endDate           : end,
            viewPreset        : 'hour',

            viewConfig        : {
                dynamicRowHeight : false
            },
            columns           : [
                {xtype : 'templatecolumn', tdCls : 'station-cell', header : 'Station', sortable : true, width : 210, dataIndex : 'Name', tpl : stationTemplate}
            ],

            plugins           : new Sch.plugin.CurrentTimeLine(),


            tbar              : [
                {
                    xtype : 'label',
                    text  : 'Column Width'
                },
                ' ',
                {
                    xtype     : 'slider',
                    width     : 120,
                    value     : Sch.preset.Manager.getPreset('hour').timeColumnWidth,
                    minValue  : 40,
                    maxValue  : 200,
                    increment : 10,
                    listeners : {
                        change : function (s, v) {
                            g.setTimeColumnWidth(v);
                        }
                    }
                }
            ]
        });

        // Grab each station schedule
        stationStore.each(function (station) {

            programStore.load({
                params     : {
                    id : station.get('Id')
                },
                callback   : function (rs, o) {
                    var id = o.getParams().id;

                    // Manually set the station id on each program since the program load response contains no info about this
                    Ext.each(rs, function (r) {
                        r.set('ResourceId', id);
                    });

                    if (stationStore.indexOf(stationStore.getById(id)) === stationStore.getCount() - 1) {
                        // We're done, scroll to current time
                        g.scrollToDate(Sch.util.Date.add(new Date(), Sch.util.Date.HOUR, -1), true);
                    }
                },
                addRecords : true
            });
        });
    }
};

Ext.onReady(App.init);
