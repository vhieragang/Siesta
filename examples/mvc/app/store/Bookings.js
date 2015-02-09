Ext.define("DEMO.store.Bookings", {
    extend : 'Sch.data.EventStore',
    model : 'DEMO.model.Booking',
    autoLoad:false,
    autoSync: false,
    batch : false
});