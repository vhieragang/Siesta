StartTest(function (t) {

    t.describe('Check columnwidth on horizontal and vertical orientation', function(t){

        var resources  = [
                {
                    Id   : '1',
                    Name : 'Foo1',
                    Type : '2'
                }
            ];

        var events = [
                {
                    Id         : 1,
                    ResourceId : '1',
                    Title      : 'Event 1',
                    StartDate  : '2011-08-01 08:00',
                    EndDate    : '2011-08-01 09:00',
                    Cls        : 'test-event-cls'
                }]

        var resourceStore = new Sch.data.ResourceStore({
            data : resources
        })

        var eventStore = t.getEventStore({
            data : events
        });

        var scheduler = t.getScheduler({
            height        : 800,
            width         : 600,
            renderTo      : Ext.getBody(),
            viewPreset    : 'hourAndDay',
            startDate     : new Date(2011, 7, 1, 8),
            endDate       : new Date(2011, 7, 1, 19),
            resourceStore : resourceStore,
            eventStore    : eventStore
        });

        var view = scheduler.getSchedulingView();

        t.it('Set columnwidth on horizontal orientation', function(t){

            t.chain(
                { waitFor : 'RowsVisible', args : scheduler },

                  function (next) {

                    t.willFireNTimes(view, 'columnwidthchange', 1, 'Columnwidth event fired on setColumnWidth')
                    view.setColumnWidth(300);

                    t.diag('Check dom cell width');
                    var width = t.getFirstCell(scheduler.normalGrid).down('.sch-event').el.getWidth();
                    t.isApprox(width, 300, 4, 'Column has correct width');

                    next();
                },

                function (next) {

                    t.willFireNTimes(view, 'columnwidthchange', 0, 'No columnwidth event fired with suspendevents on')
                    view.setColumnWidth(400, true);

                    t.diag('Check dom cell width');
                    var width = t.getFirstCell(scheduler.normalGrid).down('.sch-event').el.getWidth();
                    t.isApprox(width, 300, 4, 'Column width has not changed');

                }
            );

        })

        t.it('Switch to vertical orientation and set new columnwidth', function(t){

            t.diag('Switch orientation to vertical');

            scheduler.setOrientation('vertical');

            t.chain(

                function (next) {

                    t.willFireNTimes(view, 'columnwidthchange', 1, 'Columnwidth event fired on setColumnWidth')
                    view.setColumnWidth(300);

                    t.diag('Check dom cell width');
                    var width = t.getFirstCell(scheduler.normalGrid).down('.sch-event').el.getWidth();
                    t.isApprox(width, 300, 4, 'Column has correct width');

                    next();
                },

                function (next) {

                    t.willFireNTimes(view, 'columnwidthchange', 0, 'No columnwidth event fired')
                    view.setColumnWidth(400, true);

                    t.diag('Check dom cell width');
                    var width = t.getFirstCell(scheduler.normalGrid).down('.sch-event').el.getWidth();
                    t.isApprox(width, 300, 4, 'Column width has not changed')

                }
            );

        })


    })
})