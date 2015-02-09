StartTest(function(t) {
    var scheduler
    
    var testingScenario = function (t, config) {
        scheduler && scheduler.destroy();
            
        var resourceStore = Ext.create('Sch.data.ResourceStore', {
            data : [
                {Id : 'r1', Name : 'Mats'},
                {Id : 'r2', Name : 'Nick'},
                {Id : 'r3', Name : 'Jakub'},
                {Id : 'r4', Name : 'Tom'},
                {Id : 'r5', Name : 'Mary'}
            ]
        });

        var eventStore = Ext.create('Sch.data.EventStore', {
            data : [
                //To clearly see the seconds-length event the custom viewPreset should be added to zoomLevels
                {ResourceId : 'r1', Name : 'Seconds', PercentAllocated : 20, StartDate : new Date(2011, 0, 1, 12, 10, 30), EndDate : new Date(2011, 0, 1, 12, 11)},
                {ResourceId : 'r2', Name : 'Minutes', PercentAllocated : 30, StartDate : new Date(2011, 0, 1, 12, 10), EndDate : new Date(2011, 0, 1, 12, 15)},
                {ResourceId : 'r3', Name : 'Hours', PercentAllocated : 40, StartDate : new Date(2011, 0, 1, 13), EndDate : new Date(2011, 0, 1, 16)},
                {ResourceId : 'r4', Name : 'Days', PercentAllocated : 50, StartDate : new Date(2011, 0, 1, 8), EndDate : new Date(2011, 0, 4, 18)},
                {ResourceId : 'r5', Name : 'Months', PercentAllocated : 60, StartDate : new Date(2011, 0, 1, 16), EndDate : new Date(2011, 1, 2, 13)}
            ]
        });

        scheduler = t.getScheduler(Ext.apply({
            renderTo        : Ext.getBody(),
            viewPreset      : 'hourAndDay',
            
            startDate       : new Date(2011, 0, 1, 6),
            endDate         : new Date(2011, 0, 2, 20),

            columns         : [
                { header : 'Name', sortable : true, width : 100, dataIndex : 'Name' }
            ],

            resourceStore   : resourceStore,
            eventStore      : eventStore
        }, config));
    
        t.chain(
            { waitFor : 'eventsToRender' },
            function (next) {
                var el = scheduler.el.select('.sch-event').elements[2];
                 
                t.dragTo(el, el, next, null, {}, false, [1, 0], [5, 0] );
            },
            function(next) {
                t.columnLinesSynced(scheduler);
                t.waitForEvent(scheduler.columnLinesFeature, 'columnlinessynced', next);
                scheduler.zoomOut();
            },
            { waitFor: 50 },
            function (next) {
                t.columnLinesSynced(scheduler);
                t.waitForEvent(scheduler.columnLinesFeature, 'columnlinessynced', next);
                scheduler.zoomIn();
            },
            { waitFor: 50 },
            function (next) {    
                t.columnLinesSynced(scheduler);
                next();
            }
        );
    }

    t.it('Should cancel drop in scheduler w/o infinite scroll', function (t) {
        testingScenario(t, { infiniteScroll  : false });
    }, 60000);
    
    t.it('Should cancel drop in scheduler w/ infinite scroll', function (t) {
        testingScenario(t, { infiniteScroll  : true });
    }, 60000);
});    