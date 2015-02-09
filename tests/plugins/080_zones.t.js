StartTest(function (t) {
    var innerTest = function (t, isTree, orientation) {
        var eventStore = t.getEventStore({
            data : [
                {Id : 'e10', ResourceId : 'r1', Name : 'Assignment 1', StartDate : "2011-01-03", EndDate : "2011-01-05"}
            ]
        });

        var zoneStore = Ext.create('Ext.data.JsonStore', {
            model : 'Sch.model.Range',
            data  : [
                {
                    StartDate : new Date(2011, 0, 3),
                    EndDate   : new Date(2011, 0, 13),
                    Cls       : 'myZoneStyle'
                },
                {
                    StartDate : new Date(2011, 0, 3),
                    EndDate   : new Date(2011, 0, 13),
                    Cls       : 'myZoneStyle'
                }
            ]
        });

        var scheduler = t[isTree ? "getSchedulerTree" : "getScheduler"]({
            height      : 700,
            width       : 500,
            startDate   : new Date(2011, 0, 3),
            endDate     : new Date(2011, 0, 6),
            viewPreset  : 'dayAndWeek',
            viewConfig  : { barMargin : 2, forceFit : true },
            rowHeight   : 30,
            orientation : orientation,
            renderTo    : Ext.getBody(),
            columns     : [
                {
                    xtype : isTree ? 'treecolumn' : 'gridcolumn'
                },
                {
                    position : 'right',
                    width    : 100
                }
            ],

            plugins    : Ext.create("Sch.plugin.Zones", {
                store : zoneStore
            }),
            eventStore : eventStore
        });

        var newZone, rec;
        var resourceStore = scheduler.getResourceStore();
        var viewEl = scheduler.getSchedulingView().el;

        t.chain(
            { waitFor: 'Selector', args : ['.myZoneStyle', scheduler.el] },

            function (next) {
                t.pass('Zone rendered ok, setting custom zone style works');

                var firstRowTimeCell = t.getFirstScheduleCellEl(scheduler), // This cell is covered fully by the only rendered event
                    secondRowTimeCell = scheduler.getSchedulingView().getCellByPosition({ row : 0, column : 0 }), // This cell is covered fully by the zone
                    firstEventEl = t.getFirstEventEl(scheduler),
                    zoneEl = scheduler.el.down('.myZoneStyle');

                // Make sure zone is not sitting on top of events
                t.elementIsTopElement(firstEventEl, true, 'Event was found on top of zone', true);

                // Make sure zone is not sitting on top of time cells
                t.elementIsTopElement(secondRowTimeCell, true, 'Time cell was found on top of zone', true);

                var found,
                    xy = firstRowTimeCell.getXY();

                for (var j = 0; j < 60; j++) {
                    if (t.elementFromPoint(xy[0] + 5, xy[1] + j) === zoneEl) {
                        found = true;
                        break;
                    }
                }

                t.notOk(found, 'Zone completely unreachable');

                newZone = new zoneStore.model({
                    StartDate : new Date(2011, 0, 4),
                    EndDate   : new Date(2011, 0, 5),
                    Cls       : 'otherZoneStyle'
                });
                zoneStore.removeAll();
                zoneStore.add(newZone);
                next();
            },

            { waitFor : 'Selector', args : ['.otherZoneStyle', scheduler.el] },

            function (next) {
                t.pass('Adding new zone dynamically works');

                newZone.set('Cls', 'qwerty');
                t.selectorExists('.qwerty', 'Found refreshed zone node CSS class');
                newZone.reject();

                var zoneEl = scheduler.el.down('.otherZoneStyle');

                var startEndDates = scheduler.getSchedulingView().getStartEndDatesFromRegion(zoneEl.getRegion(), 'round');

                t.isDateEqual(startEndDates.start, newZone.get('StartDate'), 'Zone rendered in correct place on the time axis');
                t.isDateEqual(startEndDates.end, newZone.get('EndDate'), 'Zone rendered in correct place on the time axis');

                var oldHeight = zoneEl.getHeight();
                if (isTree) {
                    rec = resourceStore.getRootNode().firstChild.copy();
                    rec.set({
                        leaf : true,
                        Id   : 'foo',
                        Name : 'newguy'
                    });
                    resourceStore.getRootNode().appendChild(rec);
                } else {
                    rec = resourceStore.first().copy();
                    rec.set({
                        Id   : 'foo',
                        Name : 'newguy'
                    });
                    resourceStore.add(rec);
                }
                next()
            },

            { 
                desc    : 'Zone width/height synchronized with the table',
                waitFor : function () {
                    var els = scheduler.el.select('.otherZoneStyle');

                    if (orientation === 'horizontal') {
                        return els.getCount() > 0 &&
                            Math.abs(els.first().getHeight() - viewEl.down('.x-grid-item-container').getHeight()) < 2;
                    } else {
                        return els.getCount() > 0 &&
                            Math.abs(els.first().getWidth() - viewEl.child('.x-grid-item-container').getWidth()) < 2;
                    }
                } 
            },

            function (next) {
                var zoneEl = scheduler.el.down('.otherZoneStyle');

                if (orientation === 'horizontal') {
                    t.isApprox(zoneEl.getHeight(), viewEl.down('.x-grid-item-container').getHeight(), 1, 'Height correct after resource record was added');
                }

                if (isTree) {
                    rec.remove();
                } else {
                    resourceStore.remove(rec);
                }
                next();
            },

            {
                desc    : 'Zone width/height synchronized with the table',
                waitFor : function () {
                    var els = scheduler.el.select('.otherZoneStyle');

                    if (orientation === 'horizontal') {
                        return els.getCount() > 0 &&
                            Math.abs(els.first().getHeight() - viewEl.down('.x-grid-item-container').getHeight()) < 2;
                    } else {
                        return els.getCount() > 0 &&
                            Math.abs(els.first().getWidth() - viewEl.child('.x-grid-item-container').getWidth()) < 2;
                    }
                }
            },

            function () {
                scheduler.destroy();
            }
        );
    };

    t.it('Grid horizontal orientation tests', function(t) {
        innerTest(t, false, 'horizontal');
    });

    t.it('Grid vertical orientation tests', function(t) {
        innerTest(t, false, 'vertical')
    });

    t.it('Tree tests', function(t) {
        innerTest(t, true, 'horizontal');
    });
});
