StartTest(function(t) {
    t.diag('Double clicking any time vertical header row should fire an event');

     var scheduler = t.getScheduler({
        orientation     : 'vertical',
        renderTo        : Ext.getBody()
    });


    t.willFireNTimes(scheduler, 'timeheaderdblclick', 3);

    
    t.chain(
        function (next) {
            scheduler.on('timeheaderdblclick', function(sender, start, end, rowIndex, e) {
                t.ok(sender instanceof Ext.grid.GridPanel, 'Time column is lockedGrid ok');
                t.isDateEqual(start, new Date(2011, 0, 3), 'StartDate ok');
                t.isDateEqual(end, new Date(2011, 0, 4), 'EndDate ok');
                t.is(rowIndex, 0, 'We have clicked on the cell in first row');
                t.ok(e.getTarget, 'e ok');

                t.diag('Changing orientation to horizontal');
                scheduler.setOrientation('horizontal');

                next()
            }, null, { single : true });
            
            t.doubleClick('.x-grid-inner-locked .x-grid-cell-first', function () {});
        },

        { waitFor : 100 },

        function (next) {
            scheduler.on('timeheaderdblclick', function(sender, start, end, rowIndex, e) {
                t.ok(sender instanceof Sch.view.HorizontalTimeAxis, 'Row header type ok');

                t.diag('Changing orientation to vertical, doing dblclick again');
                scheduler.setOrientation('vertical');
                
                next()
            }, null, { single : true, delay : 10 });
            // we need a delay here, because our "dblclick" listener is attached to the timeaxis column's "el"
            // and as of 4.2.1 ExtJS also attaches "dblclick" on the "titleEl" 
            // so w/o delay, our listener is processed first, switches orientation/destroys the column
            // and Sencha's listener is in inconsistent state
            
            t.doubleClick(scheduler.el.down('.x-grid-inner-locked .x-grid-cell-first'), function () {
                t.doubleClick(scheduler.el.down('.sch-simple-timeheader'), function () {});
            });
        },
        
        'waitFor(100)',
        
        function (next) {
            scheduler.on('timeheaderdblclick', function(sender, start, end, rowIndex, e) {
                t.ok(sender instanceof Ext.grid.GridPanel, 'Time column is lockedGrid ok');
                t.isDateEqual(start, new Date(2011, 0, 3), 'StartDate ok');
                t.isDateEqual(end, new Date(2011, 0, 4), 'EndDate ok');
                t.is(rowIndex, 0, 'We have clicked on the cell in first row');
                t.ok(e.getTarget, 'e ok');
                
                next()
            }, null, { single : true });
            
            t.doubleClick(scheduler.el.down('.x-grid-inner-locked .x-grid-cell-first'), function () {});
        }
    )
});    
