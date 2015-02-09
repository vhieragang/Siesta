Ext.define('TestApp.store.Events', {
    extend  : 'Sch.data.EventStore',
    
    data    : [
        { Id : 1, Name : 'Event1', ResourceId : 1, StartDate : new Date(2013, 10, 1), EndDate : new Date(2013, 10, 10) }
    ]
});