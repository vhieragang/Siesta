StartTest(function (t) {


    t.it('SchedulingView will fire `refresh` only once when rendered', function (t) {

        var scheduler = t.getScheduler();

        t.willFireNTimes(scheduler.getSchedulingView(), 'refresh', 1);
        t.waitForEvent(scheduler.getSchedulingView(), 'refresh', function () {
            scheduler.destroy()
        });

        scheduler.render(Ext.getBody());
    });

    t.it('SchedulingView drag drop, resize or row update should not cause a layout as the event record is updated', function (t) {

        function getLayoutCount(ct) {
            var count = 0;

            Ext.each(ct.query('[layoutCounter]').concat(ct), function (c) {
                count += c.layoutCounter
            });

            return count;
        }

        var scheduler = t.getScheduler({
            renderTo           : document.body,
            cls                : 'nbr2',
            enableDragCreation : false,
            resizeConfig       : {
                // Updating tooltips also cause layouts, ignore
                showTooltip : false
            },
            dragConfig         : {
                // Updating tooltips also cause layouts, ignore
                showTooltip : false
            }
        });

        var before;

        t.chain(
            { waitForEventsToRender : scheduler },

            function (next) {

                t.assertNoLayoutTriggered(function () {

                    var view = scheduler.getSchedulingView();
                    view.repaintEventsForResource(scheduler.resourceStore.first())

                }, null, 'view.repaintEventsForResource should not cause a relayout')

                before = getLayoutCount(scheduler);

                next()
            },

            { drag : '.nbr2 .sch-event', by : [10, 0] },

            function (next) {
                t.is(getLayoutCount(scheduler), before, 'drag drop should not cause layouts');

                next()
            },

            { drag : '.nbr2 .sch-resizable-handle-end', by : [10, 0] },

            function () {
                t.is(getLayoutCount(scheduler), before, 'resize should not cause layouts');
            }
        )
    });
});
