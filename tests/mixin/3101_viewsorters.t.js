StartTest(function (t) {
    t.expectGlobal('View');

    Ext.define('View', {
        refresh                  : function () {
            //impl abstract method
        },
        repaintEventsForResource : function () {
            //impl abstract method
        },
        getId                    : function () {
            //impl abstract method
            return 'foo';
        },
        mixins                   : [
            'Sch.mixin.AbstractTimelineView',
            'Sch.mixin.AbstractSchedulerView'
        ]
    });

    var sorterFn = function (a, b) {

        var startA = a.getStartDate(), endA = a.getEndDate();
        var startB = b.getStartDate(), endB = b.getEndDate();

        var sameStart = (startA - startB === 0);

        if (sameStart) {
            return endA > endB ? 1 : -1;
        } else {
            return (startA < startB) ? 1 : -1;
        }
    };

    var defaultEventData = [
        {Id : 'e10', ResourceId : 'r1', Name : 'Meet Client X', StartDate : "2010-03-02", EndDate : "2010-03-04"},
        {Id : 'e11', ResourceId : 'r1', Name : 'Go to Dallas', StartDate : "2010-03-02", EndDate : "2010-03-07"}
    ];

    var resourceStore = new Sch.data.ResourceStore({
        data : [
            {Id : 'r1', Name : 'Mike'}
        ]
    });

    var getEventStore = function (eventData) {

        var eventStore = new Sch.data.EventStore({
            sorters : 'StartDate',
            proxy   : {
                type : 'memory',
                data : eventData || defaultEventData
            }
        });

        return eventStore;
    }

    var ObjectsUnitTest = function () {

        var eventStore = getEventStore();
        eventStore.load();

        var view = new View();
        view.timeAxis = t.getTimeAxis('weekAndDayLetter', {
            start : new Date(2010, 2, 2),
            end   : new Date(2010, 2, 7)
        });
        view.timeAxisViewModel = new Sch.view.model.TimeAxis({
            timeAxis : view.timeAxis
        });
        view.resourceStore = resourceStore;
        view.bindEventStore(eventStore);
        view._initializeTimelineView();
        view._initializeSchedulerView();

        var resourceRecord = view.resourceStore.getById('r1');
        var eventLayoutConfig = { view : view, timeAxisViewModel : view.timeAxisViewModel };
        var resourceEvents = eventStore.getEventsForResource(resourceRecord);
        var horizontalLayout = Ext.create('Sch.eventlayout.Horizontal', Ext.apply({}, eventLayoutConfig, { sortEvents : sorterFn }));
        var verticalLayout = Ext.create('Sch.eventlayout.Vertical', Ext.apply({}, eventLayoutConfig, { sortEvents : sorterFn }));

        return {

            view             : view,
            eventStore       : view.eventStore,
            resourceStore    : view.resourceStore,
            resourceRecord   : resourceRecord,
            resourceEvents   : resourceEvents,
            horizontalLayout : horizontalLayout,
            verticalLayout   : verticalLayout
        }
    }

    t.describe('Horizontal and Vertical Layout', function (t) {

        t.it('Unit test Horizontal Layout', function (t) {

            var o = new ObjectsUnitTest();

            t.diag('Assert resourceEvent data');
            t.expect(o.resourceEvents.length).toBe(2);

            var renderData = Ext.Array.map(o.resourceEvents, function(r){
                return {
                    start : r.getStartDate(),
                    end   : r.getEndDate(),
                    event : r
                };
            });

            t.diag('Asssert sort');
            var sortedEvents = o.resourceEvents.slice().reverse();//make sure the sortorder is wrong
            sortedEvents.sort(o.horizontalLayout.sortEvents);
            t.expect(sortedEvents[0].getId()).toBe('e10');

            t.diag('Assert applyLayout');
            var numberOfBands = o.horizontalLayout.applyLayout(renderData, o.resourceRecord);
            t.expect(numberOfBands).toBe(2);

            t.diag('Assert calculateNumberOfBands');

            var assertLayoutFunctions = function (events, value, message) {

                t.diag(message);

                numberOfBands = o.horizontalLayout.calculateNumberOfBands(o.resourceRecord, events);
                t.expect(numberOfBands).toBe(value);

                numberOfBands = o.horizontalLayout.getNumberOfBands(o.resourceRecord, events);
                t.expect(numberOfBands).toBe(value);
            }

            while (o.resourceEvents.length != 0) {
                assertLayoutFunctions(o.resourceEvents, o.resourceEvents.length, 'With ' + o.resourceEvents.length + ' events');
                o.resourceEvents.pop();
            }

            assertLayoutFunctions(o.resourceEvents, 1, 'With 0 events');
        });

        t.it('Unit test Vertical Layout', function (t) {

            var o = new ObjectsUnitTest();

            t.diag('Assert resourceEvent data');
            t.expect(o.resourceEvents.length).toBe(2);

            var renderData = [];

            for (var i = 0; i < o.resourceEvents.length; i++) {
                renderData.push({
                    start : o.resourceEvents[i].getStartDate(),
                    end   : o.resourceEvents[i].getEndDate(),
                    event : o.resourceEvents[i]
                });
            }

            t.diag('Assert sort');
            var sortedEvents = o.resourceEvents.slice().reverse();
            sortedEvents.sort(o.verticalLayout.sortEvents);
            t.expect(sortedEvents[0].getId()).toBe('e10');

            t.diag('Assert applyLayout');
            o.verticalLayout.applyLayout(renderData, 100);
            t.expect(renderData[0].left).toBeLessThan(renderData[1].left);
        });

        t.it('Integration test', function (t) {

            var scheduler = t.getScheduler({
                renderTo      : Ext.getBody(),
                startDate     : new Date(2010, 2, 2),
                endDate       : new Date(2010, 2, 7),
                viewPreset    : 'weekAndDayLetter',
                viewConfig    : {
                    horizontalEventSorterFn : sorterFn,
                    verticalEventSorterFn   : sorterFn
                },
                resourceStore : resourceStore,
                eventStore    : getEventStore()
            });

            scheduler.eventStore.load();

            t.chain(
                { waitFor : 'rowsVisible' },

                function (next) {
                    //Do a check if the events are ordered as expected, e10 before e11
                    var e10 = scheduler.getSchedulingView().getElementFromEventRecord(scheduler.eventStore.getById('e10'));
                    var e11 = scheduler.getSchedulingView().getElementFromEventRecord(scheduler.eventStore.getById('e11'));

                    t.isGreater(e11.getY(), e10.getY(), 'Horizontal position: e10 is first item');

                    scheduler.setOrientation('vertical')
                    next();
                },

                { waitFor : 'rowsVisible' },

                function (next) {
                    //Do a check if the events are ordered as expected, e10 before e11
                    var e10 = scheduler.getSchedulingView().getElementFromEventRecord(scheduler.eventStore.getById('e10'));
                    var e11 = scheduler.getSchedulingView().getElementFromEventRecord(scheduler.eventStore.getById('e11'));

                    //compare top e10 must be smaller than top e11
                    t.isGreater(e11.getX(), e10.getX(), 'Vertical position: e10 is first item');
                }
            );
        })

    });

});