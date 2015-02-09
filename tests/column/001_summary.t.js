StartTest(function (t) {

    t.it('Basic usage as a proper column', function(t) {

        var resourceStore = Ext.create('Sch.data.ResourceStore', {
                model : 'Sch.model.Resource',
                data  : [
                    {Id : 'r1', Name : 'Mike'}
                ]
            }),

        // Store holding all the events
            eventStore = t.getEventStore({
                data : [
                    {Id : 'e10', ResourceId : 'r1', Name : 'Assignment 1', StartDate : "2011-01-03", EndDate : "2011-01-13"}
                ]
            });

        var summaryCol = Ext.create("Sch.column.Summary", {
            header      : 'Time allocated',
            width       : 80,
            showPercent : false
        });

        var summaryCol2 = Ext.create("Sch.column.Summary", {
            header      : '% allocated',
            showPercent : true,
            align       : 'center',
            width       : 60
        });

        var scheduler = new Sch.panel.SchedulerGrid({
            height     : 400,
            width      : 800,
            startDate  : new Date(2011, 0, 3),
            endDate    : new Date(2011, 0, 13),
            viewPreset : 'dayAndWeek',

            // Setup static columns
            columns    : [
                { header : 'Name', sortable : true, width : 100, dataIndex : 'Name' },
                summaryCol,
                summaryCol2
            ],

            resourceStore : resourceStore,
            eventStore    : eventStore
        });

        scheduler.render(Ext.getBody());

        // rendering is async
        t.waitForEventsToRender(scheduler, function test() {
            var locked = scheduler.lockedGrid,
                firstRowEl = Ext.get(locked.view.getNode(0)),
                summaryColNode = t.getCell(locked, 0, 1).dom,
                summaryCol2Node = t.getCell(locked, 0, 2).dom;

            t.like(summaryColNode.innerHTML, "10.0 d", "Found correct value for time-summary-column");
            t.like(summaryCol2Node.innerHTML, "100 %", "Found correct value for percent-summary-column");

            scheduler.shiftNext();

            firstRowEl = Ext.get(locked.view.getNode(0));
            summaryColNode = t.getCell(locked, 0, 1).dom;
            summaryCol2Node = t.getCell(locked, 0, 2).dom;

            t.like(summaryColNode.innerHTML, "9.0 d", "Found correct value for time-summary-column");
            t.like(summaryCol2Node.innerHTML, "90 %", "Found correct value for percent-summary-column");

            eventStore.first().set('EndDate', new Date(2011, 0, 12));

            t.waitFor(
                function () {
                    return t.getCell(locked, 0, 1).dom.innerHTML.match("8.0 d");
                },
                function () {
                    t.pass("Found correct value 8.0 d for time-summary-column after event record update");
                    eventStore.remove(eventStore.first());

                    t.waitFor(
                        function () {
                            return !t.getCell(locked, 0, 1).dom.innerHTML.match("8.0 d");
                        },
                        function () {
                            t.pass("Summary cell was updated after event record was removed");

                        }
                    );
                }
            );
        });
    })
})
