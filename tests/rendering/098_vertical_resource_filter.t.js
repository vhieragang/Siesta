StartTest(function (t) {
    
    var scheduler = t.getScheduler({
        orientation     : 'vertical',
        renderTo        : Ext.getBody()
    });
    
    var resourceStore   = scheduler.resourceStore

    t.waitForRowsVisible(scheduler, function() {
        var headerCt        = scheduler.normalGrid.headerCt,
            nbrResources    = headerCt.getColumnCount();
            
        t.is(nbrResources, resourceStore.getCount(), 'Correct number of resource columns in headerCt found');

        resourceStore.filterBy(function() { return false; });
        
        t.is(resourceStore.getCount(), 0, 'No resource columns in headerCt after filtering');
        t.is(headerCt.el.select('.sch-resourcecolumn-header').getCount(), 0, 'No resource columns in DOM after filtering');
        
        resourceStore.clearFilter();
        
        t.is(resourceStore.getCount(), nbrResources, 'Correct number of resource columns in headerCt after clearing filter');
        t.is(headerCt.el.select('.sch-resourcecolumn-header').getCount(), nbrResources, 'Correct number of resource columns in DOM after clearing filter');
    });
});

