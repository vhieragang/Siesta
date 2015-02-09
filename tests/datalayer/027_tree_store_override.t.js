StartTest(function (t) {
    t.diag('Initial load');

    t.expectGlobals('MyEvent2');

    var eventData = [
        {Id: 'ABC00000001', name : 'test1', startDate : "2012-04-07 08:20", endDate : "2012-04-07 11:25"},
        {Id: 'ABC00000002', name : 'test2', startDate : "2012-04-07 12:10", endDate : "2012-04-07 13:50"},
        {Id: 'ABC00000003', name : 'test3', startDate : "2012-04-07 14:30", endDate : "2012-04-07 16:10"},
        {Id: 'ABC00000004', name : 'test4', startDate : "2012-04-07 08:20", endDate : "2012-04-07 09:50"}
    ];
            
    var rootData = {
        Id          : 10000,
        children    : eventData
    };
    
    Ext.each(eventData, function(d){
        d.EventId = d.Id;
    }); 

    var resourceStore = Ext.create('Ext.data.TreeStore', {
        model   : 'Sch.model.Resource',
        root : rootData,
        proxy   : {
            type    : 'memory'
        },
        folderSort  : true
    });

    Ext.define('MyEvent2', {
        extend      : 'Sch.model.Event',
        resourceIdField : 'EventId',
        fields      : [
            { name: 'EventId', type : 'string' }
        ]
    });

    var eventStore = Ext.create('Ext.data.Store', {
        model   : 'MyEvent2',
        data: eventData
    });

    var firstEvent = eventStore.first();
    var firstRecord = resourceStore.getRootNode().getChildAt(0);
    
    t.is(firstEvent.resourceIdField, 'EventId', 'EventId overrides ResourceId');
    t.is(firstEvent.getResourceId(), firstRecord.getId(), 'Proper resource id returned');
})    
