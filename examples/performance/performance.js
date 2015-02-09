//Ext.Loader.setConfig({ enabled : true, disableCaching : true });
//Ext.Loader.setPath('Sch', '../../js/Sch');

//Ext.require([
//    'Sch.panel.SchedulerGrid'
//]);

Sch.preset.Manager.registerPreset("millisecondsPassed", {
    displayDateFormat : 'm:i:s',
    shiftIncrement    : 1,
    shiftUnit         : "SECOND",
    timeResolution    : {
        unit      : "SECOND",
        increment : 1
    },
    headerConfig      : {
        middle : {
            unit  : "SECOND",
            align : 'left',

            renderer : function (start, end, cfg, index) {
                if (index === 0) {
                    // Same styling as normal grid column headers
                    return '<b style="position: absolute;top:8px">Timeline</b>'
                }

                cfg.headerCls += 'ticks-header';
                return Ext.String.format('<div class="ticks-outer">&nbsp;<div class="ticks-inner">&nbsp;</div></div>{0} s', index);
            }
        }
    }
});

App = {

    // Initialize application
    init : function () {

        Ext.QuickTips.init();

        Ext.define('Url', {
            extend     : 'Sch.model.Resource',
            idProperty : 'Id',
            fields     : [
                {name : 'Id', mapping : 'request.url'},
                {name : 'ResourceId', mapping : 'request.url'},

                {name : 'ResponseStatus', mapping : 'response.status' },
                {name : 'BodySize', mapping : 'response.bodySize'},
                {name : 'Method', mapping : 'request.method'}
            ],
            proxy      : {
                type   : 'memory',
                reader : {
                    type : 'json',
                    rootProperty : 'log.entries'
                }
            }
        });

        Ext.define('LoadEvent', {
            extend : 'Sch.model.Event',
            fields : [
                {name : 'ResourceId', mapping : 'request.url'},

                {name : 'StartDate', mapping : 'startedDateTime', type : 'date', dateFormat : 'c'},
                {name : 'EndDate', convert : function (v, data) {
                    return Sch.util.Date.add(Ext.Date.parseDate(data.data.startedDateTime, 'c'), Sch.util.Date.MILLI, data.data.time);
                }},
                {name : 'ConnectingTime', mapping : 'timings.connect'},
                {name : 'WaitingTime', mapping : 'timings.wait'},
                {name : 'ReceivingTime', mapping : 'timings.receive'},
                {name : 'BlockingTime', mapping : 'timings.blocked'},
                {name : 'Duration', mapping : 'time'}
            ]
        });

        // Store holding all the loaded page resources
        var eventStore = new Sch.data.EventStore({
            autoLoad : true,
            model    : 'LoadEvent',
            proxy    : {
                type   : 'ajax',
                url    : 'log-har.js',
                reader : {
                    type : 'json',
                    rootProperty : 'log.entries'
                }
            }
        });

        // Store holding all the loaded page resources
        var rowStore = new Sch.data.ResourceStore({
            idProperty : 'Id',
            model      : 'Url'
        });

        Ext.define('Line', {
            extend : 'Ext.data.Model',
            fields : [
                'Date',
                'Text',
                'Cls'
            ]
        });

        var lineStore = Ext.create('Ext.data.JsonStore', {
            model : 'Line'
        });

        var g = new Sch.panel.SchedulerGrid({
            readOnly          : true,
            height            : ExampleDefaults.height,
            width             : ExampleDefaults.width,
            renderTo          : 'example-container',
            columnLines       : false,
            resourceStore     : rowStore,
            eventStore        : eventStore,
            loadMask          : true,
            viewPreset        : 'millisecondsPassed',
            tipCfg            : {
                cls       : 'sch-tip',
                showDelay : 50,
                autoHide  : true,
                anchor    : 'b'
            },
            viewConfig        : { barMargin : 15, trackOver : false },
            rowHeight         : 50,
            eventBodyTemplate : new PerformanceBarTemplate(),

            eventRenderer : function (event) {
                var d = event.data,
                    totalTime = d.Duration,
                    styleString = "width:{0}%;left:{1}%",
                    connectingFraction = 100 * d.ConnectingTime / totalTime,
                    blockingFraction = 100 * d.BlockingTime / totalTime,
                    waitingFraction = 100 * d.WaitingTime / totalTime,
                    receivingFraction = 100 * d.ReceivingTime / totalTime;

                return {
                    connectingTime     : d.ConnectingTime,
                    blockingTime       : d.BlockingTime,
                    waitingTime        : d.WaitingTime,
                    receivingTime      : d.ReceivingTime,
                    connectingBarStyle : Ext.String.format(styleString, connectingFraction, 0),
                    blockingBarStyle   : Ext.String.format(styleString, blockingFraction, connectingFraction),
                    waitingBarStyle    : Ext.String.format(styleString, waitingFraction, connectingFraction + blockingFraction),
                    receivingBarStyle  : Ext.String.format(styleString, receivingFraction, (waitingFraction + connectingFraction + blockingFraction)),
                    duration           : totalTime > 1000 ? ((Math.round(100 * totalTime / 1000) / 100) + "s") : (totalTime + "ms")
                };
            },
            tooltipTpl    : new Ext.Template(
                '<dl class="tip">',
                '<dt class="connecting">Connecting</dt>',
                '<dd>{ConnectingTime} ms</dd>',
                '<dt class="waiting">Waiting</dt>',
                '<dd>{WaitingTime} ms</dd>',
                '<dt class="receiving">Receiving</dt>',
                '<dd>{ReceivingTime} ms</dd>',
                '<dt class="blocking">Blocking</dt>',
                '<dd>{BlockingTime} ms</dd>',
                '</dl>'
            ),

            columns : [
                {
                    header   : 'Resource',
                    sortable : true,
                    width    : 100,
                    renderer : function (v, m, r) {
                        return r.get('Id').replace(/(?:.*\/)?([^/]+)$/, '$1');
                    }
                },
                {
                    header    : 'Method',
                    width     : 80,
                    dataIndex : 'Method'
                },
                {
                    header    : 'Response',
                    sortable  : true,
                    width     : 70,
                    dataIndex : 'ResponseStatus',
                    renderer  : function (v, m) {
                        m.css = "response";
                        return v;
                    }
                },
                {
                    header    : 'Size',
                    sortable  : true,
                    width     : 70,
                    dataIndex : 'BodySize',
                    renderer  : function (v, m, r) {
                        return (v > 1024) ? ((Math.round(100 * v / 1024) / 100) + ' KB') : (v + ' B');
                    }
                }
            ],

            plugins : Ext.create("Sch.plugin.Lines", {
                store : lineStore
            })
        });


        // Zoom in the timeline on load
        eventStore.on('load', function () {
            var data = this.proxy.reader.rawData;
            rowStore.proxy.data = data;
            rowStore.load();
            var range = this.getTotalTimeSpan();
            g.setTimeSpan(range.start, Ext.Date.add(range.end, Ext.Date.SECOND, 1));

            var dt = Ext.Date.parse(data.log.pages[0].startedDateTime, 'c');

            lineStore.add({
                Date : Ext.Date.add(dt, Ext.Date.MILLI, data.log.pages[0].pageTimings.onContentLoad),
                Text : 'onContentLoad',
                Cls  : 'mytimeline'
            });
        });
    }
};

Ext.onReady(App.init);

PerformanceBarTemplate = function () {
    return new Ext.XTemplate(
        '<div>',
        '<tpl if="connectingTime &gt; 0"><div class="timing connecting" style="{connectingBarStyle}"></div></tpl>',
        '<tpl if="blockingTime &gt; 0"><div class="timing blocking" style="{blockingBarStyle}"></div></tpl>',
        '<tpl if="waitingTime &gt; 0"><div class="timing waiting" style="{waitingBarStyle}"></div></tpl>',
        '<tpl if="receivingTime &gt; 0"><div class="timing receiving" style="{receivingBarStyle}"></div></tpl>',
        '</div>',
        '<span class="duration">{duration}</span>'
    );
};

