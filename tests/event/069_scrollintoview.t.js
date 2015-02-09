StartTest(function (t) {

    var scheduler

    t.it('Simple use case', function(t) {
        Ext.isIE && scheduler && scheduler.destroy()
        
        scheduler = t.getScheduler({
            renderTo    : Ext.getBody(),
            startDate   : new Date(2010, 1, 1),
            endDate     : new Date(2011, 1, 1),
            viewPreset  : 'monthAndYear',
            height      : 150,
            width       : 500,
            eventStore  : new Sch.data.EventStore()
        });

        t.chain(
            { waitFor : 'RowsVisible', args : scheduler },

            function (next) {
                var view = scheduler.getSchedulingView(),
                    viewEl = view.el;

                scheduler.eventStore.removeAll();

                var event = new Sch.model.Event({
                    ResourceId  : scheduler.resourceStore.first().getId(),
                    Id          : 'foo',
                    StartDate   : new Date(2010, 5, 1),
                    EndDate     : new Date(2010, 7, 1)
                });
                scheduler.eventStore.add(event);

                var branch      = 0
                
                t.waitForScrollLeftChange(viewEl, function (scrollValue) {
                    t.isGreater(scrollValue, 0, 'Scrolled right direction');
                    
                    if (++branch == 2) next()
                });

                view.scrollEventIntoView(event, false, false, function (next) {
                    var eventEl = t.getFirstEventEl(scheduler);
                    
                    t.ok(eventEl, 'Should find event el in the DOM');
                    t.elementIsTopElement(eventEl, true, 'Should find event visible in the viewport');
                    
                    if (++branch == 2) next()
                });
            }
        );
    })

    t.it('Event not in view initally', function(t) {
        Ext.isIE && scheduler && scheduler.destroy()
        
        scheduler = t.getScheduler({
            renderTo    : Ext.getBody(),
            startDate   : new Date(2010, 1, 1),
            endDate     : new Date(2011, 1, 1),
            viewPreset  : 'monthAndYear',
            height      : 150,
            width       : 500,
            eventStore  : new Sch.data.EventStore()
        });
        
        var event

        t.chain(
            { waitFor : 'rowsVisible', args : scheduler },

            function (next) {
                var view    = scheduler.getSchedulingView(),
                    viewEl  = view.el;

                scheduler.eventStore.removeAll();
                scheduler.setTimeSpan(new Date(2009, 1, 1), new Date(2010, 1, 1));

                event       = new Sch.model.Event({
                    ResourceId  : scheduler.resourceStore.first().getId(),
                    Id          : 'foo',
                    StartDate   : new Date(2010, 5, 1),
                    EndDate     : new Date(2010, 7, 1)
                });
                scheduler.eventStore.add(event);

                view.scrollEventIntoView(event, false, false, next);
            },
            function (next) {
                var eventEl = t.getFirstEventEl(scheduler);
                
                t.ok(eventEl, 'Should find event el in the DOM');
                t.isLess(scheduler.getStartDate(), event.getStartDate(), 'Should find start date in axis');
                t.isGreater(scheduler.getEndDate(), event.getEndDate(), 'Should find end date in axis');
                t.elementIsTopElement(eventEl, true, 'Should find event visible in the viewport');
            }
        );
    });

    t.it('Using a ResourceTreeStore with a collapsed parent node', function(t) {
        Ext.isIE && scheduler && scheduler.destroy()

        scheduler = t.getSchedulerTree({
            renderTo    : Ext.getBody(),
            startDate   : new Date(2010, 1, 1),
            endDate     : new Date(2011, 1, 1),
            viewPreset  : 'monthAndYear',
            height      : 150,
            width       : 500,
            resourceStore : Ext.create('Sch.data.ResourceTreeStore', {
                root: {
                    Id          : 0,
                    expanded    : true,
                    children    : [
                        {
                            Id          : "r1",
                            Name        : 'Parent',
                            expanded    : false,
                            children    : [
                                {
                                    Id          : "r2",
                                    Name        : 'Leaf',
                                    leaf        : true
                                }
                            ]
                        }
                    ]
                }
            })
        });
        
        var event

        t.chain(
            { waitFor : 'rowsVisible', args : scheduler },

            function (next) {
                var view    = scheduler.getSchedulingView(),
                    viewEl  = view.el;

                scheduler.eventStore.removeAll();
                scheduler.setTimeSpan(new Date(2009, 1, 1), new Date(2010, 1, 1));

                event       = new Sch.model.Event({
                    ResourceId  : "r2",
                    Id          : 'foo',
                    StartDate   : new Date(2010, 5, 1),
                    EndDate     : new Date(2010, 7, 1)
                });
                scheduler.eventStore.add(event);

                view.scrollEventIntoView(event, false, false, next);
            },
            function (next) {
                var eventEl = t.getFirstEventEl(scheduler);
                
                t.ok(eventEl, 'Should find event el in the DOM');
                t.elementIsTopElement(eventEl, true, 'Should find event visible in the viewport');
            }
        );
    })

    
    t.it('Using a buffered tree', function(t) {
        Ext.isIE && scheduler && scheduler.destroy()
        
        scheduler = t.getSchedulerTree({
            renderTo    : Ext.getBody(),
            startDate   : new Date(2009, 1, 1),
            endDate     : new Date(2010, 1, 1),
            viewPreset  : 'monthAndYear',
            height      : 150,
            width       : 500,
            plugins : [
                'bufferedrenderer'
            ],
            resourceStore : Ext.create('Sch.data.ResourceTreeStore', {
                root: {
                    Id          : 0,
                    expanded    : true,
                    children    : [
                        {
                            Id          : "r1",
                            Name        : 'Parent',
                            children    : [
                                {},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},
                                {},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},
                                {
                                    Id          : "r2",
                                    Name        : 'Leaf',
                                    leaf        : true
                                }
                            ]
                        }
                    ]
                }
            })
        });

        scheduler.eventStore.removeAll();

        var event = new Sch.model.Event({
            ResourceId  : "r2",
            Id          : 'foo',
            StartDate   : new Date(2010, 5, 1),
            EndDate     : new Date(2010, 7, 1)
        });

        scheduler.eventStore.add(event);

        t.chain(
            { waitFor : 'rowsVisible', args : scheduler },

            function (next) {
                var view = scheduler.getSchedulingView();

                view.scrollEventIntoView(event, false, false, next);
            },
            function (next) {
                var eventEl = t.getFirstEventEl(scheduler);
                
                t.ok(eventEl, 'Should find event el in the DOM');
                t.elementIsTopElement(eventEl, true, 'Should find event visible in the viewport');
            }
        );
    })

    t.it('Using a buffered grid', function(t) {
        Ext.isIE && scheduler && scheduler.destroy()
        
        scheduler = t.getScheduler({
            renderTo    : Ext.getBody(),
            startDate   : new Date(2009, 1, 1),
            endDate     : new Date(2010, 1, 1),
            viewPreset  : 'monthAndYear',
            height      : 150,
            width       : 500,
            plugins : [
                'bufferedrenderer'
            ],
            resourceStore : Ext.create('Sch.data.ResourceStore', {
                data : [
                    {},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},
                    {},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},
                    {
                        Id          : "r2",
                        Name        : 'Leaf',
                        leaf        : true
                    }
                ]
            })
        });

        scheduler.eventStore.removeAll();

        var event = new Sch.model.Event({
            ResourceId  : "r2",
            Id          : 'foo',
            StartDate   : new Date(2010, 5, 1),
            EndDate     : new Date(2010, 7, 1)
        });

        scheduler.eventStore.add(event);

        t.chain(
            { waitFor : 'rowsVisible', args : scheduler },

            function (next) {
                var view = scheduler.getSchedulingView();

                view.scrollEventIntoView(event, false, false, next);
            },
            function (next) {
                var eventEl = t.getFirstEventEl(scheduler);
                t.ok(eventEl, 'Should find event el in the DOM');

                t.elementIsTopElement(eventEl, true, 'Should find event visible in the viewport');
            }
        );
    })
})
