StartTest(function(t) {
    
    var scheduler =  t.getScheduler({
        forceFit : true,
        // Setup static columns
        columns     : [
            {header : 'Name', sortable:true, width:100, dataIndex : 'Name'},
            {header : 'Name', position : 'right', width:100, dataIndex : 'Name'}
        ]
    });
    var col = scheduler.normalGrid.down('gridcolumn[position=right]');

    t.pass("Scheduler has been successfully instantiated with right columns")

    t.ok(col, "Should find right columns");
    t.is(scheduler.normalGrid.headerCt.items.indexOf(col), 1, "Should find right columns last in the header");

    scheduler.render(Ext.getBody())
    
    t.ok(scheduler.el, "Scheduler has been successfully rendered with right columns")

    scheduler.destroy();
    t.pass("Could destroy scheduler")
})    
