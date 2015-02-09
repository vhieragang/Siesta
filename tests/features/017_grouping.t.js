StartTest(function (t) {
    Ext.define('Sch.model.TempResource', {
        extend : 'Sch.model.Resource',
        fields : ['Group']
    });

    var scenario = function (config) {
        var resourceStore = t.getResourceStore({
            groupField : 'Group',
            model      : 'Sch.model.TempResource',
            data       : (function () {
                var resources = [];
                for (var i = 1; i <= 5; i++) {
                    resources.push({
                        Id    : 'r' + i,
                        Name  : 'Resource ' + i,
                        Group : 'Group'
                    });
                }

                return resources;
            })()
        });

        return t.getScheduler(Ext.apply({
            renderTo    : Ext.getBody(),
            features    : [{
                id                 : 'group',
                ftype              : 'scheduler_grouping',
                groupHeaderTpl     : '{name}',
                hideGroupedHeader  : true,
                enableGroupingMenu : false,

                headerRenderer     : function (startDate, endDate, resources, meta) {
                    meta.cellCls    = 'testCls';
                    meta.cellStyle  = 'border-left: red 4px solid;';

                    var count = 0;

                    Ext.each(resources, function (resource) {
                        Ext.each(resource.getEvents(), function (event) {
                            if (startDate <= event.getStartDate() && endDate > event.getStartDate()) {
                                ++count;
                            }
                        });
                    });

                    return 'Events: ' + count;
                }
            }],
            store         : resourceStore,
            resourceStore : resourceStore
        }, config));
    };

    t.it('Should apply custom renderer to grouping header', function (t) {
        var scheduler = scenario({
            cls : 'first'
        });

        t.chain(
            { waitForEventsToRender : scheduler },
            function (next) {
                var cells = scheduler.el.query('.sch-grid-group-hd-cell');
                var el = Ext.fly(cells[1]);

                t.hasCls(el, 'testCls', 'Custom class set correctly');
                t.is(el.getStyle('border-left-color'), Ext.isIE8 ? 'red' : 'rgb(255, 0, 0)', 'Border color set correctly');
                t.is(el.getStyle('border-left-style'), 'solid', 'Border style set correctly');
                t.is(el.getStyle('border-left-width'), '4px', 'Border width set correctly');
                t.contentLike(el, 'Events: 1', 'Content rendered correctly');

                t.lockedAndNormalRowsSynced(scheduler);
                scheduler.destroy();
            }
        );
    });

    t.it('Should update grouping header after event add, update', function (t) {
        var scheduler = scenario({
            cls : 'second'
        });

        t.chain(
            { waitForEventsToRender : scheduler },

            function (next) {

                t.it('Updating event start date', function(t) {
                    var event = scheduler.eventStore.getAt(1);
                    event.setStartDate(new Date(2011, 0, 4, 10), true);

                    var cells = scheduler.el.query('.sch-grid-group-hd-cell');
                    t.contentLike(Ext.fly(cells[1]), 'Events: 2', 'Header cell updated correctly');
                    t.contentLike(Ext.fly(cells[2]), 'Events: 0', 'Header cell updated correctly');

                    event = scheduler.eventStore.getAt(2);
                    event.setStartDate(new Date(2011, 0, 5, 15), true);

                    cells = scheduler.el.query('.sch-grid-group-hd-cell');
                    t.contentLike(Ext.fly(cells[2]), 'Events: 1', 'Header cell updated correctly');
                    t.contentLike(Ext.fly(cells[3]), 'Events: 0', 'Header cell updated correctly');
                });

                t.it('Adding event ', function(t) {
                    var e = Ext.create('Sch.model.Event', {
                        StartDate : new Date(2011, 0, 3, 4),
                        EndDate   : new Date(2011, 0, 3, 15),
                        Name      : 'New',
                        Group     : 'Group'
                    });

                    var r = scheduler.resourceStore.getById('r5');

                    e.assign(r);

                    scheduler.eventStore.add(e);

                    var cells = scheduler.el.query('.sch-grid-group-hd-cell');
                    t.contentLike(Ext.fly(cells[0]), 'Events: 1', 'Header cell updated correctly');
                    scheduler.destroy();
                });
            }
        );
    });

    t.it('Should update grouping header after CUD operations on event', function (t) {
        var scheduler = scenario({
            cls : 'third'
        });

        t.chain(
            { waitForEventsToRender : scheduler },

            function (next) {
                // create
                t.contentLike(scheduler.el.down('.sch-grid-group-hd-cell'), 'Events: 0', 'Header updated correctly');
                scheduler.eventStore.add({
                    Id         : 100,
                    ResourceId : 'r1',
                    Name       : 'Test assignment',
                    StartDate  : new Date(2011, 0, 3),
                    EndDate    : new Date(2011, 0, 7)
                });
                t.contentLike(scheduler.el.down('.sch-grid-group-hd-cell'), 'Events: 1', 'Header updated correctly');

                // update
                scheduler.eventStore.last().setStartDate(new Date(2011, 0, 5));
                t.contentLike(Ext.fly(scheduler.el.query('.sch-grid-group-hd-cell')[2]), 'Events: 2', 'Header updated correctly');

                scheduler.eventStore.remove(scheduler.eventStore.last());
                t.contentLike(Ext.fly(scheduler.el.query('.sch-grid-group-hd-cell')[2]), 'Events: 1', 'Header updated correctly');

                scheduler.destroy();
            }
        );
    });

    t.it('Should update grouping header after CUD operations on resource', function (t) {
        var scheduler = scenario({
            cls : 'fourth',

            features : [
                {
                    id                 : 'group',
                    ftype              : 'scheduler_grouping',
                    groupHeaderTpl     : '{name}',
                    hideGroupedHeader  : true,
                    enableGroupingMenu : false,

                    headerRenderer : function (startDate, endDate, resources, meta) {
                        return 'Resources: ' + resources.length;
                    }
                }
            ]
        });

        t.chain(
            { waitForEventsToRender : scheduler },

            function (next) {
                // create
                scheduler.resourceStore.add({
                    Id    : 'test',
                    Name  : 'test',
                    Group : 'Group'
                });
                t.contentLike(Ext.fly(scheduler.el.query('.sch-grid-group-hd-cell')[1]), 'Resources: 6', 'Header updated correctly');

                // update
                scheduler.resourceStore.getAt(0).set('Group', 'Test Group');
                t.contentLike(Ext.fly(scheduler.el.query('.sch-grid-group-hd-cell')[1]), 'Resources: 5', 'Header updated correctly');

                // remove
                scheduler.resourceStore.removeAt(0);

                // http://www.sencha.com/forum/showthread.php?295953-5.1-Grouping-feature-regression&p=1080543#post1080543
                t.knownBugIn('5.2.0', function(t) {
                    t.selectorNotExists(scheduler.lockedGrid.view.itemSelector + ':contains(Resource 1)', 'First resource not found after remove');
                    t.contentLike(Ext.fly(scheduler.el.query('.sch-grid-group-hd-cell')[1]), 'Resources: 4', 'Header updated correctly');
                }, 'Sencha bug')

                scheduler.destroy()
            }
        );
    });

    t.it('Drag create should work correctly with group collapsed', function (t) {
        var scheduler = scenario({
            cls : 'fifth',

            resourceStore   : t.getResourceStore({
                groupField  : 'Group',
                model       : 'Sch.model.TempResource',
                data        : (function () {
                    var resources = [];
                    for (var i = 1; i < 3; i++) {
                        for (var j = 1; j <= 5; j++) {
                            resources.push({
                                Id          : 'r' + i + j,
                                Name        : 'Resource ' + i + j,
                                Group       : 'Group' + i
                            });
                        }
                    }

                    return resources;
                })()
            })
        });

        t.chain(
            { click : ".fifth .x-grid-group-title", offset : [7, 7] },
            { drag : ".fifth .x-grid-item-container table:nth-child(4) .sch-timetd", offset : [104, 16], by : [86, 0] },

            function (next) {
                var event = scheduler.eventStore.last();
                t.ok(Sch.util.Date.betweenLesser(event.getStartDate(), new Date(2011, 0, 4), new Date(2011, 0, 5)), 'Start date is correct');
                t.is(scheduler.resourceStore.getAt(7), event.getResource(), 'Resource is correct');
                t.selectorExists('.sch-event', 'Event is rendered');
                next();
            },

            { drag : ".fifth .x-grid-item-container table:nth-child(2) .sch-timetd", offset : [3, 16], by : [86, 0] },

            function (next) {
                t.contentLike(scheduler.el.query('.testCls span')[scheduler.timeAxis.getCount()], 'Events: 1', 'Header updated');
                t.is(scheduler.el.query('.sch-event').length, 2, 'Two events are rendered');
                scheduler.destroy();
            }
        );
    });
});
