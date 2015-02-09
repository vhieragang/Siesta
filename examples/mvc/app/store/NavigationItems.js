Ext.define("DEMO.store.NavigationItems", {
    extend : 'Ext.data.Store',
    model  : 'DEMO.model.NavigationItem',

    data   : [
        { id : 'schedule', name : 'Schedule' },
        { id : 'employeeList', name : 'Employee List' }
    ]
});