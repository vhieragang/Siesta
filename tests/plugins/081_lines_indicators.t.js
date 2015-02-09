StartTest(function (t) {

    Ext.define('Sch.__Line', {
        extend : 'Ext.data.Model',
        fields : [
            'Date',
            'Text',
            'Cls'
        ]
    });

    function runTests(t, orientation) {

        var Utils = Sch.util.Date,
            startDate = new Date(2011, 0, 3),
            endDate = new Date(2011, 0, 13),
            indicatorSelector = '.sch-header-indicator',

            resourceStore = Ext.create('Sch.data.ResourceStore', {
                model : 'Sch.model.Resource',
                data  : [
                    {Id : 'r1', Name : 'Mike'},
                    {Id : 'r2', Name : 'Dan'}
                ]
            }),

        // Store holding all the events
            eventStore = t.getEventStore({
                data : [
                    {
                        Id         : 'e10',
                        ResourceId : 'r1',
                        Name       : 'Assignment 1',
                        StartDate  : "2011-01-03",
                        EndDate    : "2011-01-13"
                    }
                ]
            });

        var lineStore = Ext.create('Ext.data.JsonStore', {
            model : 'Sch.__Line',
            data  : [
                {
                    Date : Utils.add(startDate, Utils.MILLI, -1),
                    Text : 'Before start date',
                    Cls  : 'foo'
                },
                {
                    Date : startDate,
                    Text : 'Start date',
                    Cls  : 'foo'
                },
                {
                    Date : Utils.add(startDate, Utils.DAY, 1),
                    Text : 'Some valid date',
                    Cls  : 'foo'
                },
                {
                    Date : endDate,
                    Text : 'End date',
                    Cls  : 'foo'
                },
                {
                    Date : Utils.add(endDate, Utils.MILLI, 1),
                    Text : 'After end date',
                    Cls  : 'foo'
                }
            ]
        });

        var scheduler = t.getScheduler({
            height      : 400,
            width       : 800,
            startDate   : startDate,
            endDate     : endDate,
            orientation : orientation,

            plugins : Ext.create("Sch.plugin.Lines", {
                pluginId           : 'lines',
                store              : lineStore,
                showHeaderElements : true
            })
        });

        // rendering is async
        scheduler.render(Ext.getBody());


        function testIndicatorPosition(t, lineEl, indicatorEl) {
            var isHorizontal = scheduler.isHorizontal(),
                indicatorBox, indicatorCenter,
                lineBox, lineCenter, date;

            // t.elementIsTopElement(indicatorEl, 'Indicator is render on top of scheduler header.');

            indicatorBox = Ext.get(indicatorEl).getBox();
            lineBox = Ext.get(lineEl).getBox();

            lineCenter = isHorizontal ? lineBox.left + lineBox.width / 2
                : lineBox.top + lineBox.height / 2;
            indicatorCenter = isHorizontal ? indicatorBox.left + indicatorBox.width / 2
                : indicatorBox.top + indicatorBox.height / 2;
            
            // more safe way of using public method `getBox` led to increasing of error from .5 to 2 pixel
            // this is why we had to increase threshold (only for vertical orientation)
            // For IE9 approximation has to be increased to 3
            t.isApprox(indicatorCenter, lineCenter, Ext.isIE9 ? 3 : 2, "Header is placed right above the line");
        }


        function testElementDate(t, el, expectedDate, message) {
            var model = scheduler.getSchedulingView().getTimeAxisViewModel(),
                elPos, elDate;

            elPos = scheduler.isHorizontal()
                ? (scheduler.rtl ? el.getRight(true) : el.getLeft(true))
                : el.getTop(true);

            elDate = model.getDateFromPosition(elPos, 'round');

            t.isDateEqual(elDate, expectedDate, message);
        }


        function testIndicators(next, name, record) {
            var linesPlugin = scheduler.getPlugin('lines'),
                date;

            t.it(name, function (t) {
                Ext.each(record || lineStore.getRange(), function (record, index) {
                    var date = record.get('Date'),
                        cls = record.get('Cls'),
                        dateString = date.toString(),
                        isValidDate = Utils.betweenLesser(date, startDate, endDate),
                        lineEl, indicatorEl;

                    lineEl = Ext.get(linesPlugin.getElementId(record));
                    indicatorEl = Ext.get(linesPlugin.getHeaderElementId(record));

                    if (isValidDate) {
                        t.diag(dateString + ' is valid date.');
                        //t.ok(lineEl, 'Line should be rendered.');
                        //testElementDate(lineEl, date, 'Line rendered in correct place on the time axis.');

                        t.ok(indicatorEl, 'Indicator should be rendered.');
                        testElementDate(t, indicatorEl, date, 'Indicator rendered in correct place on the time axis.');
                        testIndicatorPosition(t, lineEl, indicatorEl);

                        if (cls) {
                            t.ok(indicatorEl.hasCls(cls), 'Indicator should have class "' + cls + '".')
                        }
                    } else {
                        t.diag(dateString + ' is out of range.');
                        //t.notOk(lineEl, 'Line should not be rendered.');
                        t.notOk(indicatorEl, 'Indicator should not be rendered.');
                    }
                });

                next();
            });
        }


        t.chain(
            { waitFor : 'selector', args : [indicatorSelector, scheduler.el] },

            function (next) {
                testIndicators(next, 'Indicator position');
            },

            function (next) {
                lineStore.loadRawData([
                    {
                        Date : Utils.add(startDate, Utils.DAY, 2),
                        Text : 'Some valid date',
                        Cls  : 'loaded'
                    }
                ]);

                next();
            },

            { waitFor : 'selector', args : [indicatorSelector + '.loaded', scheduler.el] },

            function (next) {
                testIndicators(next, 'Records loaded');
            },

            function (next) {
                var record = lineStore.first();

                // Set date out of range
                record.set('Date', Utils.add(endDate, Utils.DAY, 2));
                testIndicators(next, 'Updated to invalid date');
            },

            function (next) {
                var record = lineStore.first();

                // Set valid date
                record.set({
                    Date : Utils.add(startDate, Utils.DAY, 3),
                    Cls  : 'new-class'
                });
                testIndicators(next, 'Updated to valid date');
            },

            function (next) {
                lineStore.add(new lineStore.model({
                    Date : Utils.add(startDate, Utils.DAY, 1),
                    Text : 'Some valid date',
                    Cls  : 'added'
                }));

                next();
            },

            { waitFor : 'selector', args : [indicatorSelector + '.added', scheduler.el] },

            function (next) {
                var record = lineStore.last();

                testIndicators(next, 'Added record');
            },

            function (next) {
                scheduler.setSize(700, 400);
                next();
            },

            { waitFor : 'selector', args : [indicatorSelector, scheduler.el] },

            function (next) {
                testIndicators(next, 'Tests after resize');
            }
        );

    };

    t.it('Horizontal orientation', function (t) {
        runTests(t, 'horizontal');
    });

    t.it('Vertical orientation', function (t) {
        runTests(t, 'vertical');
    });

});
