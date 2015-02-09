StartTest(function(t) {
    var scope = { foo : 'bar' };
    var resourceStore = Ext.create('Sch.data.ResourceStore', {
        model : 'Sch.model.Resource',
        data : [
            {Id : 'c1', Name : 'Foo'}
        ]
    });
    // Simple Scheduler, no forceFit and no snapToIncrement, and no need to expand the columns to fit the available width. Should just use the column width value from viewPreset.
    var scheduler = t.getScheduler({
        renderTo : Ext.getBody(),
        orientation : 'vertical',
        resourceStore : resourceStore,
        viewPreset : 'hourAndDay',
        startDate : new Date(2010, 11, 9, 8),
        endDate : new Date(2010, 11, 9, 9),

        /**
        * An empty function by default, but provided so that you can manipulate the html cells that make up the schedule.
        * This is called once for each cell, just like a normal GridPanel renderer though returning values from it has no effect.
        * @param {Object} meta The same meta object as seen in a standard GridPanel cell renderer. Use it to modify CSS/style of the cell.
        * @param {Ext.data.Model} record The resource record to which the cell belongs
        * @param {Int} row The row index
        * @param {Int} col The col index
        * @param {Ext.data.Store} ds The resource store
        * @param {Date} startDate The start date of the cell
        * @param {Date} endDate The end date of the cell
        */
        timeCellRenderer : function(meta, resourceRecord, row, col, store, startDate, endDate) {
            t.is(this, scope, 'Scope was correctly set');
            t.ok(Ext.isObject(meta), 'meta was found');
            t.is(resourceRecord, resourceStore.first(), 'resourceRecord was found');
            t.is(row, 0, 'row index was found');
            t.is(col, 0, 'col index was found');
            t.is(store, resourceStore, 'resourceStore was found');
            t.ok(startDate instanceof Date, 'startDate was found');
            t.ok(endDate instanceof Date, 'endDate was found');
            t.isGreater(endDate, startDate, 'endDate > startDate');
        },
                
        timeCellRendererScope : scope
    });
    
    t.waitForRowsVisible(scheduler, Ext.emptyFn);
})    
