Ext.define('MyApp.store.ResourceStore', {
    extend      : 'Sch.data.ResourceStore',
    storeId     : 'resources',
    model       : 'Sch.model.Resource',
    //limit resources to 5 per page
    pageSize    : 5
});
