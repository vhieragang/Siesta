StartTest(function (t) {

    t.it('vertical => calendar => horizontal', function (t) {
        var scheduler = t.getScheduler({
            renderTo            : Ext.getBody(),
            width               : 400,
            columns             : [
            { width : 100, dataIndex : 'Name' }
            ],
            timeAxisColumnCfg   : { width : 100 },
            calendarTimeAxisCfg : { width : 150 },
            snapToIncrement     : true,
            viewPreset          : 'hourAndDay',
            startDate           : new Date(2010, 1, 2),
            endDate             : new Date(2010, 1, 2, 10)
        });

        var origHeaderWidth;

        t.chain(
            { waitForRowsVisible : scheduler },
            function (next) {
                origHeaderWidth = scheduler.down('timeaxiscolumn').getWidth();

                t.is(origHeaderWidth, 10 * scheduler.timeAxisViewModel.getTickWidth(), 'Time axis width ok');

                t.waitFor(500, next);
            },

            function (next) {
                scheduler.setOrientation('vertical');
                t.is(scheduler.lockedGrid.getWidth(), 100, 'Correct width for locked grid in vertical mode');

                scheduler.setOrientation('calendar');
                t.isApprox(scheduler.lockedGrid.getWidth(), 150, 1, 'Correct width for locked grid in calendar mode');

                scheduler.setOrientation('horizontal');
                t.is(scheduler.down('timeaxiscolumn').getWidth(), origHeaderWidth, 'Time axis width unchanged');
            }
        );
    });

    t.it('Subclass in a viewport', function (t) {
        Ext.define('Sch.MyScheduler', {
            extend    : 'Sch.panel.SchedulerGrid',
            alias     : 'widget.myscheduler',
            mode      : 'vertical',
            columns   : [
                {
                    text      : 'Name',
                    width     : 200,
                    dataIndex : 'Name'
                }
            ],

            // Store holding all the resources
            resourceStore     : {
                xclass : 'Sch.data.ResourceStore',
                data   : [
                    { Id : 'MadMike', Name : 'Mike' }
                ]
            },

            // Store holding all the events
            eventStore        : {
                xclass : 'Sch.data.EventStore',
                data   : [
                    { ResourceId : 'MadMike', StartDate  : "2011-12-09 10:00", EndDate    : "2011-12-09 11:00" }
                ]
            }
        })

        var vp = new Ext.Viewport({
            layout : 'fit',
            items  : {
                xtype : 'myscheduler'
            }
        });

        var scheduler = t.cq1('myscheduler');

        t.chain(
            { waitForRowsVisible : scheduler },

            function (next) {
                scheduler.setMode('horizontal');
                t.is(scheduler.lockedGrid.view.getNodes().length, 1, 'Only 1 resource shown')
                t.isApprox(scheduler.lockedGrid.getWidth(), 200, 1, 'Correct width for locked grid in horizontal mode');
                t.is(scheduler.lockedGrid.down('gridcolumn').getWidth(), 200, 1, 'Correct width for locked grid column in horizontal mode');

                vp.destroy();
            }
        );
    })
});
