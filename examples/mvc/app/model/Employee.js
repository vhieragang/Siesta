Ext.define('DEMO.model.Employee', {
    extend: 'Sch.model.Resource',
    fields: [
        {name: 'Salary', type: 'float'},
        {name: 'Active', type: 'boolean'}
    ],
    proxy : {
        type : 'ajax',
        api: {
            read : 'data-employees.js',
            create: 'TODO/Create',
		    destroy: 'TODO/Delete',
            update: 'TODO/Update'
        },
        reader : {
            type : 'json',
            root: 'data'
        },
        writer : {
            root: 'data',
            type : 'json',
            encode: true,
            writeAllFields: true
        }
    }
});
