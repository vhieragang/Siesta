Ext.Loader.setConfig({ enabled : true, disableCaching : true });
Ext.Loader.setPath('Sch', '../../js/Sch');

Ext.require([
    'Sch.panel.SchedulerGrid',
    'Sch.plugin.CurrentTimeLine'
]);

Ext.onReady(function () {
    Ext.Ajax.setUseDefaultXhrHeader(false);

    // Ignore error tracking
    window.onerror = null;

    var programTemplate = new Ext.XTemplate(
            '<span class="startTime">{[fm.date(values.StartDate, "G:i")]}</span>' +
            '<span class="programName">{text}</span>' +
            '<span class="duration">{[((values.duration / 60) + " min")]}</span>'
    );

    Ext.define('Station', {
        extend : 'Sch.model.Resource',
        fields : ['Id', 'Name', 'Image']
    });

    // Store holding the stations
    var stationStore = new Sch.data.ResourceStore({
        model : 'Station',
        data  : [
            { Id : '1xtra', Name : 'BBC Radio 1 Xtra' },
            { Id : 'radio2', Name : 'BBC Radio 2' },
            { Id : 'radio3', Name : 'BBC Radio 3' },
            { Id : '5live', Name : 'BBC Radio 5' }
        ]
    });

    Ext.define('Program', {
        extend : 'Sch.model.Event',
        fields : [
            { name : 'ResourceId', mapping : 'programme.ownership.service.key' },
            { name : 'StartDate', type : 'date', dateFormat : 'c', mapping : 'start' },
            { name : 'EndDate', type : 'date', dateFormat : 'c', mapping : 'end' },
            { name : 'text', mapping : 'programme.display_titles.title' },
            { name : 'duration' },
            { name : 'pid', mapping : 'programme.pid' },
            { name : 'synopsis', mapping : 'programme.short_synopsis' }
        ]
    });

    // Store holding all the programs
    var programStore = new Sch.data.EventStore({
        model : 'Program',
        proxy : {
            type                : 'ajax',
            useDefaultXhrHeader : false,
            reader              : {
                type         : 'json',
                rootProperty : 'schedule.day.broadcasts'
            },
            disableCaching      : false
        }
    });

    var start = new Date();
    Ext.Date.clearTime(start);
    var end = Sch.util.Date.add(start, Sch.util.Date.DAY, 1);

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
                dateFormat : 'G:i',
                align      : 'left'
            }
        }
    });

    var g = new Sch.panel.SchedulerGrid({
        readOnly          : true,
        height            : 350,
        width             : ExampleDefaults.width,
        renderTo          : 'example-container',
        resourceStore     : stationStore,
        eventStore        : programStore,
        eventBodyTemplate : programTemplate,
        rowHeight         : 70,
        enableHdMenu      : false,
        tooltipTpl        : new Ext.XTemplate('<span class="radiotip">{[fm.date(values.StartDate, "G:i")]}</span> {synopsis}'),
        startDate         : start,
        endDate           : end,
        border            : false,
        rowLines          : false,
        viewPreset        : 'hour',
        columns           : [
            {
                xtype     : 'templatecolumn',
                header    : 'Station',
                align     : 'center',
                width     : 150,
                dataIndex : 'Name',
                tpl       : '<img class="station-img" src="images/{Id}.png" />'
            }
        ],
        plugins           : new Sch.plugin.CurrentTimeLine(),
        viewConfig        : { rowLines : false, barMargin : 5 },
        columnLines       : false
    });

    Ext.Function.defer(function () {

        loadRow(0);

        function loadRow(index) {
            if (index >= stationStore.getCount()) {
                // Scroll to current time
                g.scrollToDate(Ext.Date.add(new Date(), Sch.util.Date.HOUR, -1), { duration : 2000 });

                return;
            }

            // Fire a load request for each station
            programStore.proxy.url = Ext.String.format('http://www.bbc.co.uk/{0}/programmes/schedules.json', stationStore.getAt(index).get('Id'));
            programStore.load({
                addRecords : true,
                callback   : function (rs, op, success) {
                    if (success && rs && rs.length > 0) {
                        var rowIndex = stationStore.indexOfId(rs[0].get('ResourceId'));
                        Ext.Function.defer(loadRow, this, 500, [index + 1]);
                    }
                }
            });
        }

    }, 1);
});
