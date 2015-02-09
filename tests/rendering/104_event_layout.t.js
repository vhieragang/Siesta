StartTest(function (t) {
    t.it('Should place event correctly along the timeaxis', function (t) {

        var scheduler = t.getScheduler({
            startDate  : new Date(2011, 0, 3),
            endDate    : new Date(2011, 0, 22),
            viewPreset : 'dayAndWeek'
        });

        scheduler.render(Ext.getBody());

        function getEventLeft() {
            return Ext.fly(scheduler.getSchedulingView().getEventNodeByRecord(event)).getLeft(true);
        }
        t.waitForRowsVisible(scheduler, function () {
            var colWidth = scheduler.timeAxisViewModel.getTickWidth();

            var event = scheduler.eventStore.first();
            event.setStartEndDate(
                new Date(2011, 0, 4),
                new Date(2011, 0, 5)
            );

            function getEventLeft() {
                return scheduler.getSchedulingView().getElementFromEventRecord(event).getLeft(true);
            }

            t.isApprox(getEventLeft(), colWidth, 1, 'Event placed correctly');

            scheduler.setTimeColumnWidth(123);
            t.is(getEventLeft(), 123, 'Event placed correctly');
        });
    });

    t.it('Should not overlap two milestone events', function (t) {

        var scheduler = t.getScheduler({
            startDate  : new Date(2011, 0, 3),
            endDate    : new Date(2011, 0, 22),
            viewPreset : 'dayAndWeek',
            rowHeight  : 20,
            renderTo   : document.body,
            resourceStore : t.getResourceStore({
                data : [
                    {Id: 1},
                    {Id: 2}
                ]
            }),
            eventStore : t.getEventStore({
                data : [
                    { ResourceId : 1, StartDate : '2011-01-03', EndDate : '2011-01-03' },
                    { ResourceId : 1, StartDate : '2011-01-03', EndDate : '2011-01-03' },
                    { ResourceId : 2, StartDate : '2011-01-03', EndDate : '2011-01-03' },
                    { ResourceId : 2, StartDate : '2011-01-04', EndDate : '2011-01-04' }
                ]
            })
        });

        t.waitForRowsVisible(scheduler, function () {
            t.isApprox(scheduler.normalGrid.view.el.down('.sch-timetd').getHeight(), 40, 3, 'Row height is doubled');
            t.isApprox(Ext.fly(scheduler.normalGrid.view.getNode(1)).down('.sch-timetd').getHeight(), 20, 2, 'Row height is normal');
        });
    });
});
