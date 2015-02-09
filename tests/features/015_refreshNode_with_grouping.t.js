StartTest(function(t) {
    t.expectGlobals('Resource')
    
    Ext.define('Resource', {
        extend : 'Sch.model.Resource',
        fields : [
            'Category'
        ]
    });
    
    var resourceStore = new Sch.data.ResourceStore({
        groupField  : 'Category',
        sorters     : ['Category', 'Name'],
        model       : 'Resource',
        
        data        : [
            {Id : 'r1', Name : 'Mike Anderson', Category : 'Consultants'},
            {Id : 'r2', Name : 'Kevin Larson', Category : 'Consultants'},
            {Id : 'r3', Name : 'Brett Hornbach', Category : 'Consultants'},
            {Id : 'r4', Name : 'Lars Holt', Category : 'Consultants'},
            {Id : 'r5', Name : 'Fred Arnold', Category : 'Consultants'},
            {Id : 'r10', Name : 'Matt Demon', Category : 'Sales'},
            {Id : 'r11', Name : 'Karl Lager', Category : 'Testers'},
            {Id : 'r12', Name : 'Pete Wilson', Category : 'Testers'},
            {Id : 'r13', Name : 'Derek Ronburg', Category : 'Testers'},
            {Id : 'r14', Name : 'Alyssa Patterson', Category : 'Testers'},
            {Id : 'r15', Name : 'Will Pherrel', Category : 'Testers'},
            {Id : 'r16', Name : 'Ofelia Larson', Category : 'Research'},
            {Id : 'r17', Name : 'David Mantorp', Category : 'Research'},
            {Id : 'r18', Name : 'Ann Withersby', Category : 'Research'}
        ]
    })

    var scheduler = t.getScheduler({
        renderTo        : Ext.getBody(),
        
        features        : [
            {
                ftype               : 'grouping'
            }
        ],
        
        resourceStore   : resourceStore
    });

    
    t.chain(
        {
            waitFor     : 'RowsVisible',
            args        : scheduler
        },
        {
            action      : 'click',
            target      : '.x-grid-group-title'
        },
        function () {
            var normalView      = scheduler.normalGrid.getView();
            
            // http://www.sencha.com/forum/showthread.php?263515-getAt-indexOf-methods-mismatch-of-the-Ext.grid.feature.Grouping
            // http://www.sencha.com/forum/showthread.php?265078-Broken-contracts-of-getAt-indexOf-methods-of-the-Ext.grid.feature.Grouping&p=971212
            t.knownBugIn("4.2.1.883", function (t) {
                var index
                
                normalView.on('itemupdate', function (record, idx) {
                    index   = idx
                })
                
                normalView.refreshNode(5)
                
                t.is(index, 5, "`itemupdate` should receive the same index as given to `refreshNode`")
            })
            
            t.knownBugIn("4.2.1.883", function (t) {
                t.livesOk("Refresh row should not cause an exception", function () {
                    normalView.refreshNode(7)    
                })
            })
        }
    )
});
