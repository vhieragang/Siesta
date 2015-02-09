Ext.define('MyApp.store.CrudManager', {
    extend      : 'Sch.data.CrudManager',
    autoLoad    : true,
    transport   : {
        load        : {
            url             : 'services/load',
            method          : 'POST'
        },
        sync        : {
            url             : 'services/sync',
            method          : 'POST'
        }
    }
});
