Ext.define('DEMO.model.Booking', {
    extend: 'Sch.model.Event',
    fields: [
        { name: 'StartDate', type: 'date', dateFormat: 'time' },
        { name: 'EndDate', type: 'date', dateFormat: 'time' }
    ],

    proxy : {
        type : 'ajax',
        api: {
            read    : 'data-bookings.js',
            create  : 'TODO/Create',
            destroy : 'TODO/Update',
            update  : 'TODO/Update'
        },
        reader : {
            type : 'json',
            root: 'data'
        },
        writer : {
            type : 'json',
            encode: true,
            writeAllFields: true,
            root: 'data'
        }
    }
});