StartTest(function (t) {

    t.it('Basic view functionality tests', function (t) {
        var scheduler = t.getScheduler({
            normalViewConfig : {
                emptyText : 'empty_schedule'
            },
            height           : 200,
            eventRenderer    : function (event, resource) {
                return resource.getName();
            },
            renderTo         : Ext.getBody()
        });

        t.waitForEventsToRender(scheduler, function () {
            var schedulingView = scheduler.getSchedulingView();

            t.it('Should copy view specific settings from panel to view', function (t) {
                t.expect(schedulingView.cellBorderWidth).toBeGreaterThan(-1);
                t.expect(schedulingView.cellTopBorderWidth).toBeGreaterThan(-1);
                t.expect(schedulingView.cellBottomBorderWidth).toBeGreaterThan(-1);
            })

            t.wontFire(scheduler.lockedGrid.getView(), 'refresh', 'locked view should not refresh after event is added');
            t.wontFire(schedulingView, 'refresh', 'schedule view should not refresh after event is added');

            var newEvent = new Sch.model.Event({
                StartDate  : scheduler.getStart(),
                EndDate    : scheduler.getEnd(),
                ResourceId : scheduler.resourceStore.first().getId()
            });
            scheduler.eventStore.add(newEvent);

            scheduler.resourceStore.first().setName('BLARGH');

            t.contentLike(schedulingView.getElementFromEventRecord(newEvent), 'BLARGH', 'Event row should be refreshed when resource is updated');
            
            Ext.destroy(scheduler);
        });
    });

    t.it('Should not remove secondary canvas element from the DOM on refresh, with columnLines disabled', function (t) {
        var sched = t.getScheduler({
            height      : 200,
            columnLines : false,
            renderTo    : Ext.getBody()
        });

        t.chain(
            { waitFor : 'rowsVisible', args : sched },
            { waitFor : 100 },

            function (next) {
                var view = sched.getSchedulingView();
                view.getSecondaryCanvasEl();
                t.ok(view.el.down('.sch-secondary-canvas'), 'Secondary canvas found')

                view.refresh();
                t.ok(view.el.down('.sch-secondary-canvas'), 'Secondary canvas found after refresh')
                Ext.destroy(sched);
            }
        )
    });

    t.it('Basic API tests', function (t) {
        var sched = t.getScheduler({
            renderTo  : document.body,
            startDate : new Date(2010, 1, 1),
            endDate   : new Date(2010, 5, 1)
        });

        t.chain(
            { waitForRowsVisible : sched },

            function (next) {
                var view = sched.getSchedulingView();

                t.expect(view.getCoordinateFromDate(new Date(2010, 1, 1))).toBe(0);
                t.expect(view.getCoordinateFromDate(new Date(2010, 0, 1))).toBe(-1);
                t.expect(view.getCoordinateFromDate(new Date(2020, 0, 1))).toBe(-1);

                t.is(view.resolveResource(sched.getEl().down('.sch-timetd')), sched.resourceStore.first(), 'resolveResource horizontal')

                sched.setOrientation('vertical');
                next();
            },

            { waitForRowsVisible : sched },

            function (next) {
                var view = sched.getSchedulingView();

                t.is(view.resolveResource(sched.getEl().down('.sch-timetd')), sched.resourceStore.first(), 'resolveResource vertical')
                Ext.destroy(sched);
            }
        )
    })

    t.it('Should not be allowed to move resource columns in vertical view', function (t) {
        var sched = t.getScheduler({
            renderTo    : document.body,
            orientation : 'vertical',
            cls         : 'vert'
        });

        t.wontFire(sched, 'columnmove');

        t.chain(
            { waitFor : 'rowsVisible', args : sched },

            { drag : '.vert .sch-resourcecolumn-header', by : [100, 0] },
            
            function (next) {
                Ext.destroy(sched);
            }
        )
    });
    
    t.it('Should not change vertical scroll on event selection', function (t) {
        var scheduler = t.getScheduler({
            mode        : 'vertical',
            width       : 600,
            renderTo    : Ext.getBody(),
            startDate   : new Date(2014, 4, 26),
            eventStore  : t.getEventStore({
                data    : [{
                    Id          : 1,
                    StartDate   : new Date(2014, 4, 27),
                    EndDate     : new Date(2014, 4, 28),
                    ResourceId  : 'r1',
                    Cls         : 'event1'
                }]
            })
        });
        
        var view = scheduler.getSchedulingView();
        
        t.chain(
            { waitForEventsToRender : scheduler },
            function (next) {
                t.scrollVerticallyTo(view.el, 30, next);
            },
            { click : '.event1' },
            function (next) {
                t.is(view.el.getScroll().top, 30, 'Vertical scroll is correct');
                next();
            }
        );
    });

    t.it('Should fire "eventrepaint" when an event gets updated in the DOM', function (t) {
        var sched = new Sch.panel.SchedulerGrid({
            renderTo    : document.body,
            orientation : 'horizontal',
            startDate   : new Date(2010, 1, 1),
            endDate     : new Date(2010, 1, 3),

            resourceStore : new Sch.data.ResourceStore({
                data : [
                    { Id : 1 },
                    { Id : 2 }
                ]
            }),

            eventStore : new Sch.data.EventStore()
        });

        var view = sched.getSchedulingView();
        var fn = function() {};

        t.chain(
            { waitForRowsVisible : sched },

            function () {


                t.it('should fire once for a single event', function (t) {
                    sched.eventStore.loadData([
                        { ResourceId : 1, StartDate : new Date(2010, 1, 1), EndDate : new Date(2010, 1, 2) },
                        { ResourceId : 2, StartDate : new Date(2010, 1, 1), EndDate : new Date(2010, 1, 2) }
                    ])

                    t.firesOnce(view, 'eventrepaint');

                    view.on('eventrepaint', fn);

                    sched.eventStore.first().setName('Foo');

                    view.un('eventrepaint', fn);
                });

                t.it('should not fire if noone is listening', function (t) {
                    var old = view.fireEvent;
                    var didFire;

                    view.fireEvent = function(name) {
                        old.apply(this, arguments);
                        if (name === 'eventrepaint') didFire = true;
                    };

                    sched.eventStore.loadData([
                        { ResourceId : 1, StartDate : new Date(2010, 1, 1), EndDate : new Date(2010, 1, 2) }
                    ])

                    sched.eventStore.first().setName('Foo');

                    t.notOk(didFire);

                    view.fireEvent = old;
                });

                t.it('should fire once for every event in a row', function (t) {
                    sched.eventStore.loadData([
                        { ResourceId : 1, StartDate : new Date(2010, 1, 1), EndDate : new Date(2010, 1, 2) },
                        { ResourceId : 1, StartDate : new Date(2010, 1, 1), EndDate : new Date(2010, 1, 2) },
                        { ResourceId : 1, StartDate : new Date(2010, 1, 1), EndDate : new Date(2010, 1, 2) }
                    ])

                    // This adds a listener to the view which makes it fire the "eventrepaint" event
                    t.willFireNTimes(view, 'eventrepaint', 3);

                    view.refreshNode(0);
                });
            }
        )
    })
})    

