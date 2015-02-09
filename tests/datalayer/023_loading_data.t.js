StartTest(function(t) {
    
    var eventStore = t.getEventStore({
        proxy : {
            type    : 'ajax',
            url     : t.harness.absolutizeURL('data/050_data.json')
        }
    });

    var scheduler = t.getScheduler({
        passStartEndParameters  : true,
        startParamName          : 'foo',
        endParamName            : 'bar',
        eventStore              : eventStore
    });

    t.wait('storeload');

    eventStore.load({
        callback : function(f, operation) {
            t.endWait('storeload');
            var params = eventStore.proxy.extraParams || eventStore.proxy.getExtraParams();

            t.isDateEqual(params.foo, scheduler.getStart(), "Start date parameter applied to request params");
            t.isDateEqual(params.bar, scheduler.getEnd(), "End date parameter applied to request params");
                 
            t.is(eventStore.getCount(), 6, 'Correct number of events has been loaded');
        }
    });
});
