StartTest(function (t) {
    var scheduler;

    // http://www.sencha.com/forum/showthread.php?286587-Model.copy-broken
    t.expectGlobal('Gnt');

    function getScheduler(config) {
        config = config || {};

        var s = t.getScheduler(Ext.apply({
            enableDragCreation : false,
            renderTo           : Ext.getBody(),
            dragConfig         : {
                showTooltip : false,
                enableCopy  : true
            },
            eventStore         : t.getEventStore({
                data : [
                    {
                        Id         : 'e10',
                        ResourceId : 'r1',
                        StartDate  : "2011-01-04",
                        EndDate    : "2011-01-06"
                    }
                ]
            })
        }, config));

        return s;
    }


    function getDragOffset() {
        return scheduler.isHorizontal() ? [0, 25] : [100, 0];
    }

    var getTestSteps = function(t) {
        return [
            { drag : '.sch-event', by : getDragOffset, options : { shiftKey : true } },

            function (next) {
                var store = scheduler.eventStore;
                var draggedRecord = store.getById('e10');
                var newRecords = store.getNewRecords();
                var eventCopy = scheduler.resourceStore.getById('r2').getEvents(scheduler.eventStore)[0];

                t.ok(!draggedRecord.modified || !draggedRecord.modified.StartDate || !draggedRecord.modified.EndDate, 'Dates not changed');

                t.is(newRecords.length, 1, 'New event was added');

                t.ok(eventCopy, 'Should find copy assigned to second resource');
                t.ok(scheduler.getSchedulingView().getEventNodeByRecord(eventCopy), 'Should find rendered copy');
                next();
            }
        ];
    };


    t.it('Plain horizontal scheduler', function (t) {
        scheduler = getScheduler();

        t.chain(
            getTestSteps(t),

            function (next) {
                scheduler.destroy();
            }
        );
    })

    t.it('Tree scheduler', function (t) {
        scheduler = getScheduler({
            __tree : true
        });

        t.chain(
            getTestSteps(t),

            function (next) {
                scheduler.destroy();
            }
        );
    });

    t.it('Vertical scheduler', function (t) {
        scheduler = getScheduler({
            orientation : 'vertical'
        });

        t.chain(
            getTestSteps(t),

            function (next) {
                scheduler.destroy();
            }
        );
    });

    t.it('Scheduler with TaskStore', function (t) {
        var assignmentStore = new Gnt.data.AssignmentStore({
            data  : [
                {
                    TaskId     : 'e10',
                    ResourceId : 'r1'
                }
            ]
        });

        var taskStore = new Gnt.data.TaskStore({
            assignmentStore : assignmentStore,
            proxy           : 'memory',
            root            : {
                expanded : true,
                children : [
                    {
                        Id         : 'e10',
                        ResourceId : 'r1',
                        StartDate  : "2011-01-04",
                        EndDate    : "2011-01-06"
                    },
                    {
                        Id         : 'unassigned',
                        Cls        : 'unassigned',
                        StartDate  : "2011-01-05",
                        EndDate    : "2011-01-07"
                    }
                ]
            }
        });

        scheduler = getScheduler({
            resourceStore : new Gnt.data.ResourceStore({
                data : [
                    { Id   : 'r1', Name : 'Foo' },
                    { Id   : 'r2', Name : 'Bar' }
                ]
            }),
            eventStore    : taskStore
        });

        t.chain(
            { waitForRowsVisible : scheduler },

            getTestSteps(t),

            function (next) {

                var schedView = scheduler.getSchedulingView();
                var lockedView = scheduler.normalGrid.getView();

                t.it('Should refresh row on resource assignment', function(t) {
                    t.willFireNTimes(schedView, 'itemupdate', 1);
                    t.willFireNTimes(lockedView, 'itemupdate', 1);
                    t.willFireNTimes(scheduler.eventStore.getAssignmentStore(), 'add', 1);

                    scheduler.eventStore.getById('unassigned').assign('r1')
                })

                t.it('Should refresh row on assignment remove', function(t) {
                    scheduler.eventStore.getById('unassigned').unassign('r1');
                    scheduler.eventStore.getById('unassigned').assign('r1')

                    t.willFireNTimes(schedView, 'itemupdate', 1);
                    t.willFireNTimes(lockedView, 'itemupdate', 1);

                    scheduler.eventStore.getById('unassigned').unassign('r1')

                    t.selectorNotExists('.unassigned');
                })

                t.it('Should refresh both rows if resource is changed for an assignment', function(t) {
                    var newTask = new Gnt.model.Task({
                        Id         : 'changing',
                        StartDate  : "2011-01-05",
                        EndDate    : "2011-01-07"
                    });
                    scheduler.eventStore.append(newTask);
                    newTask.assign('r1');

                    t.willFireNTimes(schedView, 'itemupdate', 2);
                    t.willFireNTimes(lockedView, 'itemupdate', 2);

                    newTask.getAssignments()[0].setResourceId('r2');
                })

                next();
            },

            function() {
//                scheduler.destroy();
            }
        );
    });
})