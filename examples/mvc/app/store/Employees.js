Ext.define("DEMO.store.Employees", {
    extend : 'Sch.data.ResourceStore',
    model : 'DEMO.model.Employee',
    autoLoad:true,
    sorters : 'Name',
    autoSync: false,
    batch : false
});
    