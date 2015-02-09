StartTest(function (t) {


    t.it('Horizontal', function (t) {

        var scheduler = t.getScheduler({
            renderTo : document.body,
            height   : 200
        });

        var schedulingView = scheduler.getSchedulingView()
        var resource1 = scheduler.resourceStore.getAt(1)
        var resourceRegion

        t.firesOk(scheduler, {
            //
            scheduleclick       : 3,
            scheduledblclick    : 1,
            schedulecontextmenu : 1
        })

        t.isFiredWithSignature(scheduler, 'scheduleclick', function (scheduler, date, index, resource, e) {
            return scheduler == scheduler && date instanceof Date && typeof index == 'number' && resource == resource1 && e === Object(e)
        })

        t.isFiredWithSignature(scheduler, 'scheduledblclick', function (scheduler, date, index, resource, e) {
            return scheduler == scheduler && date instanceof Date && typeof index == 'number' && resource == resource1 && e === Object(e)
        })

        t.isFiredWithSignature(scheduler, 'schedulecontextmenu', function (scheduler, date, index, resource, e) {
            return scheduler == scheduler && date instanceof Date && typeof index == 'number' && resource == resource1 && e === Object(e)
        })

        t.chain(
            {
                waitFor : 'RowsVisible',
                args    : scheduler
            },
            function (next) {
                resourceRegion = schedulingView.getScheduleRegion(resource1)

                t.click([ resourceRegion.left + 25, resourceRegion.top + 5 ], next)
            },
            function (next) {
                t.doubleClick([ resourceRegion.left + 25, resourceRegion.top + 5 ], next)
            },
            function (next) {
                t.rightClick([ resourceRegion.left + 25, resourceRegion.top + 5 ], next)
            }
        )
    })

    t.it('Horizontal edge case, clicking a 1px wide event should not trigger "scheduleclick" event to fire', function (t) {

        var scheduler = t.getScheduler({
            renderTo : document.body,
            height   : 200
        }, 1);

        t.wontFire(scheduler, "scheduleclick")

        t.chain(
            {
                waitFor : 'eventsToRender',
                args    : scheduler
            },

            function (next) {
                var el = scheduler.el.down('.sch-event');
                el.setWidth(1);
                t.click(el, next)
            }
        )
    })

    // now lets switch the orientation and repeat the clicks for vertical
    // `isFiredWithSignature` tracks all fired events, so it will verify the signatures too
    t.it('Vertical', function (t) {

        t.it('Should fire scheduleXXX events', function (t) {

            var scheduler = t.getScheduler({
                vert        : 1,
                renderTo    : document.body,
                height      : 200
            });

            var schedulingView = scheduler.getSchedulingView()
            var resource1 = scheduler.resourceStore.getAt(1)
            var resourceRegion;

            t.firesOk(scheduler, {
                //
                orientationchange   : 1,
                scheduleclick       : 3,
                scheduledblclick    : 1,
                schedulecontextmenu : 1
            })

            scheduler.setOrientation('vertical');

            t.it('Should fire "scheduleclick"', function (t) {

                t.isFiredWithSignature(scheduler, 'scheduleclick', function (scheduler, date, index, resource, e) {
                    return scheduler == scheduler && date instanceof Date && typeof index == 'number' && resource == resource1 && e === Object(e)
                })

                t.chain(
                    { click : '[vert] schedulergridview => td:nth-child(2)', offset : [15, 50] }
                );
            });

            t.it('Should fire "scheduledblclick"', function (t) {

                t.isFiredWithSignature(scheduler, 'scheduledblclick', function (scheduler, date, index, resource, e) {
                    return scheduler == scheduler && date instanceof Date && typeof index == 'number' && resource == resource1 && e === Object(e)
                })

                t.chain(
                    { doubleclick : '[vert] schedulergridview => td:nth-child(2)', offset : [15, 50] }
                );
            });

            t.it('Should fire "contextmenu"', function (t) {

                t.isFiredWithSignature(scheduler, 'schedulecontextmenu', function (scheduler, date, index, resource, e) {
                    return scheduler == scheduler && date instanceof Date && typeof index == 'number' && resource == resource1 && e === Object(e)
                })

                t.chain(
                    { rightclick : '[vert] schedulergridview => td:nth-child(2)', offset : [15, 50] }
                )
            });
        })

        t.it('Should refresh on store load', function (t) {
            var scheduler = t.getScheduler({
                renderTo    : document.body,
                height      : 200,
                orientation : 'vertical'
            });

            t.chain(
                { waitForRowsVisible : scheduler },

                { waitFor : 1100 },

                function () {

                    t.firesOnce(scheduler.getSchedulingView(), 'refresh')
                    t.wontFire(scheduler.lockedGrid.view, 'refresh')

                    scheduler.resourceStore.loadData(
                        [
                            { Name : 'Bert' }
                        ]
                    );

                    t.waitFor(500, Ext.emptyFn)
                }
            )
        });
    })
})
