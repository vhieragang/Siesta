StartTest(function (t) {

    function assertEqualRowCount(t, scheduler) {
        t.is(scheduler.lockedGrid.view.getNodes().length, scheduler.normalGrid.view.getNodes().length, 'Same nbr rows in the two views');
    }

    var checkClasses = function (s) {
        switch (s.getMode()) {
            case 'horizontal'   :
                return s.hasCls('sch-horizontal') && !s.hasCls('sch-vertical') && !s.hasCls('sch-calendar') && !s.hasCls('sch-vertical-resource');
                break;
            case 'vertical'     :
                return !s.hasCls('sch-horizontal') &&
                    s.hasCls('sch-vertical') && !s.hasCls('sch-calendar') &&
                    s.hasCls('sch-vertical-resource');
                break;
            case 'calendar'     :
                return !s.hasCls('sch-horizontal') &&
                    s.hasCls('sch-vertical') &&
                    s.hasCls('sch-calendar') && !s.hasCls('sch-vertical-resource');
                break;
        }
    }

    t.it('Stores and classes are correct (horizontal => vertical => calendar => horizontal)', function (t) {
        var scheduler = t.getScheduler({});
        var resourceStore = scheduler.getResourceStore();
        var timeAxis = scheduler.getTimeAxis();

        scheduler.render(Ext.getBody());

        var sv = scheduler.getSchedulingView();

        t.chain(
            { waitForEventsToRender : scheduler },

            function (next) {
                t.waitForEvent(sv, 'refresh', next)

                // and change it to vertical
                scheduler.setOrientation('vertical');
                checkClasses(scheduler);

                t.is(scheduler.lockedGrid.getStore(), timeAxis, 'timeAxis used as the store for vertical mode');
                t.is(scheduler.normalGrid.getStore(), timeAxis, 'timeAxis used as the store for vertical mode');
            },

            // Should not find any column lines in vertical mode
            { waitForSelectorNotFound : '.sch-column-line' },

            function (next) {
                assertEqualRowCount(t, scheduler);

                scheduler.setOrientation('calendar');
                checkClasses(scheduler);

                next();
            },

            { waitFor : 1000 },

            function (next) {
                t.selectorNotExists('.sch-column-line', 'Should not find any column lines in vertical mode');
                assertEqualRowCount(t, scheduler);

                // and back to horizontal
                scheduler.setOrientation('horizontal');
                checkClasses(scheduler);
                t.is(scheduler.lockedGrid.getStore(), resourceStore, 'resourceStore used as the store for horizontal mode');
                t.is(scheduler.normalGrid.getStore(), resourceStore, 'resourceStore used as the store for horizontal mode');

                next();
            },

            { waitForSelector : '.sch-column-line' },

            function (next) {
                t.selectorExists('.sch-column-line', 'Should find column lines after setting orientation to horizontal');
                assertEqualRowCount(t, scheduler)

                // the end of the 1st part of test
                scheduler.destroy();
            }
        )
    })

    t.it('Refresh events are fine (horizontal => vertical => calendar)', function (t) {

        var scheduler = t.getScheduler({
            renderTo : Ext.getBody()
        });

        t.chain(
            { waitForEventsToRender : scheduler },
            function (next) {
                t.firesOk({
                    observable : scheduler.getSchedulingView(),
                    events     : {
                        refresh : '<=2'
                    },
                    during     : function () {
                        scheduler.setOrientation('vertical');
                    },
                    desc       : '<= 2 refresh events fired by view'
                })

                t.firesOk({
                    observable : scheduler.lockedGrid.getView(),
                    events     : {
                        refresh : '<=2'
                    },
                    during     : function () {
                        scheduler.setOrientation('calendar');
                    },
                    desc       : '<= 2 refresh events fired by view'
                })

                next();
            }
        );
    });

    t.it('Zones are fine, rows are synced (vertical => horizontal => calendar)', function (t) {
        var zones = new Sch.plugin.Zones({
            showHeaderElements : true,
            store              : Ext.create('Ext.data.JsonStore', {
                model : 'Sch.model.Range',
                data  : [
                    {
                        StartDate : new Date(2011, 0, 3),
                        EndDate   : new Date(2011, 0, 4),
                        Cls       : 'myZoneStyle'
                    }
                ]
            })
        });

        var scheduler = t.getScheduler({
            renderTo    : Ext.getBody(),
            startDate   : new Date(2011, 0, 3),
            endDate     : new Date(2011, 0, 13),
            orientation : 'vertical',
            plugins     : zones
        });

        t.chain(
            { waitForRowsVisible : scheduler },

            function (next) {
                // switching the orientation to horizontal
                assertEqualRowCount(t, scheduler)

                t.isCalled('generateMarkup', zones, 'Zones should be refreshed after orientation change')

                t.firesOk({
                    observable : scheduler.getSchedulingView(),
                    events     : {
                        refresh : '<=2'
                    },
                    during     : function () {
                        scheduler.setOrientation('horizontal');
                    },
                    desc       : '<= 2 refresh events fired by view'
                })

                next();
            },

            { waitForSelector : '.sch-column-line', desc : 'Should find column lines after setting orientation to horizontal'},
            { waitForSelector : '.sch-header-indicator', desc : 'Should find header indicators after setting orientation to horizontal'},

            function (next) {

                // Sanity check of row count match, to check for a bug
                // introduced in 4.2.0
                assertEqualRowCount(t, scheduler)

                // regular content should appear
                t.matchGridCellContent(scheduler.lockedGrid, 0, 0, scheduler.resourceStore.first().get('Name'));
                scheduler.setOrientation('calendar');
                next();
            },

            { waitForSelector : '.sch-header-indicator', desc : 'Should find header indicators after setting mode to calendar'},

            function (next) {
                assertEqualRowCount(t, scheduler);
                scheduler.setMode('horizontal');
                scheduler.setMode('vertical');

                next();
            },

            { waitForSelector : '.sch-header-indicator', desc : 'Should find header indicators after setting mode to vertical'}
        );
    });

    t.it('With header container config', function (t) {

        // http://www.sencha.com/forum/showthread.php?274912-4.2.2-Crash-if-grid-uses-HeaderContainer-config-object&p=1007325#post1007325

        var scheduler = t.getScheduler({
            columns : {
                autoDestroy : false,
                items       : [
                    {
                        text : 'bar', destroy : function () {
                        t.fail('Destroy called');
                    }
                    },
                    new Ext.grid.Column({ text : 'foo' })
                ]
            }
        });

        scheduler.render(Ext.getBody());

        var sv = scheduler.getSchedulingView();

        t.chain(
            { waitFor : 'EventsToRender', args : scheduler },

            function (next) {
                t.waitForEvent(sv, 'refresh', next)

                // and change it to vertical
                scheduler.setMode('vertical');
            },

            // abstract features rendering is buffered with 15ms delay
            { waitFor : 1000 },

            function (next) {
                // and back to horizontal
                scheduler.setMode('horizontal');
            }
        )
    })
})
