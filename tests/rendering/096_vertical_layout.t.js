StartTest(function (t) {
    t.it('Vertical layout smoke test', function (t) {

        var data = {
            success : true,
            staff   : [
                {
                    Id   : '1003',
                    Name : 'Foo bar',
                    Type : 'Doctor'
                },
                {
                    Id   : '1004',
                    Name : 'Some guy',
                    Type : 'Doctor'
                }
            ],

            tasks : [
                {
                    Id         : 1,
                    ResourceId : '1004',
                    Title      : '',
                    StartDate  : '2011-08-01 08:00',
                    EndDate    : '2011-08-01 09:00',
                    Color      : 'Blue',
                    Cls        : 'cls'
                },
                {
                    Id         : 38733,
                    ResourceId : '1003',
                    Title      : '',
                    StartDate  : '2011-08-01 12:30',
                    EndDate    : '2011-08-01 12:45',
                    Color      : 'Blue'
                }
                ,
                {
                    Id         : 38734,
                    ResourceId : '1003',
                    Title      : '',
                    StartDate  : '2011-08-01 12:20',
                    EndDate    : '2011-08-01 12:35',
                    Color      : 'Blue'
                }
                ,
                {
                    Id         : 38735,
                    ResourceId : '1003',
                    Title      : '',
                    StartDate  : '2011-08-01 12:30',
                    EndDate    : '2011-08-01 13:00',
                    Color      : 'Blue'
                }
                ,
                {
                    Id         : 38736,
                    ResourceId : '1003',
                    Title      : '',
                    StartDate  : '2011-08-01 12:50',
                    EndDate    : '2011-08-01 13:05',
                    Color      : 'Blue'
                }
                ,
                {
                    Id         : 38738,
                    ResourceId : '1003',
                    Title      : '',
                    StartDate  : '2011-08-01 12:40',
                    EndDate    : '2011-08-01 12:55',
                    Color      : 'Blue'
                }
                ,
                {
                    Id         : 38739,
                    ResourceId : '1003',
                    Title      : '',
                    StartDate  : '2011-08-01 12:50',
                    EndDate    : '2011-08-01 13:05',
                    Color      : 'Blue'
                }
                ,
                {
                    Id         : 38740,
                    ResourceId : '1003',
                    Title      : '',
                    StartDate  : '2011-08-01 13:00',
                    EndDate    : '2011-08-01 13:15',
                    Color      : 'Green'
                }
                ,
                {
                    Id         : 38741,
                    ResourceId : '1003',
                    Title      : '',
                    StartDate  : '2011-08-01 13:10',
                    EndDate    : '2011-08-01 13:25',
                    Color      : 'Blue'
                }
                ,
                {
                    Id         : 38742,
                    ResourceId : '1003',
                    Title      : '',
                    StartDate  : '2011-08-01 13:20',
                    EndDate    : '2011-08-01 13:35',
                    Color      : 'Blue'
                }
                ,
                {
                    Id         : 38743,
                    ResourceId : '1003',
                    Title      : '',
                    StartDate  : '2011-08-01 13:30',
                    EndDate    : '2011-08-01 13:45',
                    Color      : 'Green'
                }
                ,
                {
                    Id         : 38744,
                    ResourceId : '1003',
                    Title      : '',
                    StartDate  : '2011-08-01 13:40',
                    EndDate    : '2011-08-01 13:55',
                    Color      : 'Blue'
                }
                ,
                {
                    Id         : 38745,
                    ResourceId : '1003',
                    Title      : '',
                    StartDate  : '2011-08-01 13:50',
                    EndDate    : '2011-08-01 14:05',
                    Color      : 'Green'
                }
                ,
                {
                    Id         : 38746,
                    ResourceId : '1003',
                    Title      : '',
                    StartDate  : '2011-08-01 13:50',
                    EndDate    : '2011-08-01 14:05',
                    Color      : 'Green'
                }
                ,
                {
                    Id         : 38747,
                    ResourceId : '1003',
                    Title      : '',
                    StartDate  : '2011-08-01 14:10',
                    EndDate    : '2011-08-01 14:25',
                    Color      : 'Red'
                }
                ,
                {
                    Id         : 38749,
                    ResourceId : '1003',
                    Title      : '',
                    StartDate  : '2011-08-01 14:50',
                    EndDate    : '2011-08-01 15:05',
                    Color      : 'Blue'
                }
                ,
                {
                    Id         : 38750,
                    ResourceId : '1003',
                    Title      : '',
                    StartDate  : '2011-08-01 15:00',
                    EndDate    : '2011-08-01 15:15',
                    Color      : 'Green'
                }
                ,
                {
                    Id         : 38751,
                    ResourceId : '1003',
                    Title      : '',
                    StartDate  : '2011-08-01 15:10',
                    EndDate    : '2011-08-01 15:25',
                    Color      : 'Blue'
                }
                ,
                {
                    Id         : 38752,
                    ResourceId : '1003',
                    Title      : '',
                    StartDate  : '2011-08-01 12:50',
                    EndDate    : '2011-08-01 13:05',
                    Color      : 'Blue'
                }
                ,
                {
                    Id         : 38754,
                    ResourceId : '1003',
                    Title      : '',
                    StartDate  : '2011-08-01 13:30',
                    EndDate    : '2011-08-01 13:45',
                    Color      : '#8B7355'
                }
            ]
        };

        var resourceStore = new Sch.data.ResourceStore({
            data : data.staff
        })

        // Store holding all the events
        var eventStore = t.getEventStore({
            data : data.tasks
        });

        // Simple Scheduler, no forceFit and no snapToIncrement, and no need to expand the columns to fit the available width. Should just use the column width value from viewPreset.
        var scheduler = t.getScheduler({
            height        : 800,
            width         : 600,
            renderTo      : Ext.getBody(),
            viewPreset    : 'hourAndDay',
            startDate     : new Date(2011, 7, 1, 8),
            endDate       : new Date(2011, 7, 1, 19),
            orientation   : 'vertical',
            resourceStore : resourceStore,
            eventStore    : eventStore
        });

        scheduler.getSchedulingView().setColumnWidth(300);

        var lockedView = scheduler.lockedGrid.getView()
        var normalView = scheduler.normalGrid.getView()

        t.waitForRowsVisible(scheduler, function () {
            var lockedNodes = lockedView.getNodes()
            var normalNodes = normalView.getNodes()

            t.is(lockedNodes.length, normalNodes.length, 'Should be same amount of nodes in both views')

            for (var i = 0; i < lockedNodes.length; i++) {
                t.is(lockedNodes[ i ].offsetHeight, normalNodes[ i ].offsetHeight, i + "th row height match")
            }

            var eventEl = scheduler.el.down('.cls');
            var cellEl = eventEl.up('td');

            t.isApprox(eventEl.getX(), cellEl.getX(), 2, 'Correct X position');
            t.isApprox(eventEl.getY(), cellEl.getY(), 2, 'Correct Y position');
            t.isApprox(eventEl.getWidth(), cellEl.getWidth(), 5, 'Correct width');
            t.isApprox(eventEl.getHeight(), cellEl.getHeight(), 5, 'Correct height');

            var altCell = t.safeSelect('.sch-timetd:nth-child(2)', scheduler.el.dom);

            t.ok(scheduler.getSchedulingView().altColCls, 'Alternate column css class found on scheduler view');
            t.hasCls(altCell, scheduler.getSchedulingView().altColCls, 'Alternate column css class found on alt cell');
        })
    })

    // https://www.assembla.com/spaces/bryntum/tickets/1260#/activity/ticket:
    t.it('Adding a column before panel is rendered should work', function (t) {

        var temp = t.getScheduler({
            resourceStore : Ext.create('Sch.data.ResourceStore'),
            orientation   : 'vertical'
        });

        temp.resourceStore.add({ Name : "ONE" });

        temp.render(document.body)

        t.is(temp.normalGrid.headerCt.items.getCount(), 1, 'One column found')
    })
})

