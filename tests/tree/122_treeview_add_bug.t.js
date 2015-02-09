StartTest(function(t) {
    
    t.diag('Need to first verify if this really is a legit usecase of the Sencha TreeGrid');
    return;

    var scheduler = t.getSchedulerTree({
        renderTo : Ext.getBody()
    });

    scheduler.on('itemexpand', function(node, eOpts) {
        node.appendChild({
            Id      : 20013,
            Name    : 'TSK_1000013',
            leaf    : true,
            iconCls : 'sch-gate'
        });
        
        scheduler.getEventStore().add({
            ResourceId: 20013, // add new resourceID of leaf
            Name : 'New event',
            Color:'#FF1420',
            StartDate : new Date(2011, 11, 2, 9, 30),
            EndDate : new Date(2011, 11, 2, 11, 50)
        });
    }/*, scheduler, { delay : 1 }*/); // uncomment to fix    
    
    
    t.knownBugIn('4.1.0', function (t) {
        
        t.waitForRowsVisible(scheduler, function () { 
            var view = scheduler.getSchedulingView(),
                viewEl = view.el,
                records,
                elements;

            // first collapse the rows
            t.click(scheduler.el.down('.x-tree-expander'), function() {
                
                // then expand them - will trigger the `itemexpand` listener
                t.click(function() {
                    records = view.store.getRange().length;
                    elements = view.all.elements.length;

                    t.is(records, elements, 'Equal number of records and dom elements');
                });
            });
        });
    });
})    
