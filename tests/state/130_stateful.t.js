StartTest(function(t) {
    t.diag('Ext 4.1 has this bug: http://www.sencha.com/forum/showthread.php?183996-4.1B3-Locking-grid-stateful-broken&goto=newpost');

    var scheduler = t.getScheduler({
        renderTo    : Ext.getBody(),
        viewPreset  : 'weekAndMonth',
        startDate   : new Date(2011, 9, 3),
        endDate     : new Date(2011, 9, 17),
        columns     : [
            { text : 'name', dataIndex : 'Name', width : 100 },
            { text : 'id', dataIndex : 'Id', width : 140 }
        ],
        id          : 'foo',         // Must set an id when state should be saved
        stateful    : true,    // State will be saved by the component
        saveDelay   : 0   // saving state is async by default. argh
    });

    var cp = Ext.create('Ext.state.CookieProvider');
    cp.state = {};  // HACK, start from fresh state
    Ext.state.Manager.setProvider(cp);
    
    t.chain(
        { waitFor : 'rowsVisible', args : scheduler },
        
        function(next) {
            scheduler.lockedGrid.headerCt.getGridColumns()[0].setWidth(110);
            scheduler.lockedGrid.headerCt.getGridColumns()[1].hide();
            t.is(scheduler.viewPreset, 'weekAndMonth', 'Correct initial view preset');
            t.isDateEqual(scheduler.getStart(), new Date(2011, 9, 3), 'Correct initial start date');
            t.isDateEqual(scheduler.getEnd(), new Date(2011, 9, 17), 'Correct initial end date');

            scheduler.switchViewPreset('monthAndYear', new Date(2011, 9, 1), new Date(2011, 10, 1));
            scheduler.shiftNext(1);
            next();
        },

        { waitFor : 'rowsVisible', args : scheduler },

        function(next) {
            scheduler.destroy();
        
            scheduler = t.getScheduler({
                renderTo    : Ext.getBody(),
                viewPreset  : 'weekAndMonth',
                startDate   : new Date(2011, 9, 3),
                endDate     : new Date(2011, 9, 17),
                columns     : [
                    { text : 'name', dataIndex : 'Name', width : 100 },
                    { text : 'id', dataIndex : 'Id', width : 140 }
                ],
                id          : 'foo',         // Must set an id when state should be saved
                stateful    : true,    // State will be saved by the component
                saveDelay   : 0   // saving state is async by default. argh
            });

            t.waitForRowsVisible(scheduler, next);
        },

        function(next) {
            t.is(scheduler.viewPreset, 'monthAndYear', 'Correct view preset applied from state');
            t.isDateEqual(scheduler.getStart(), new Date(2011, 10, 1), 'Correct start date applied from state');
            t.isDateEqual(scheduler.getEnd(), new Date(2011, 11, 1), 'Correct end date applied from state');

            // http://www.sencha.com/forum/showthread.php?183996-4.1B3-Locking-grid-stateful-broken
            t.is(scheduler.lockedGrid.headerCt.getGridColumns()[0].getWidth(), 110, 'Width: State applied to column');
            t.ok(scheduler.lockedGrid.headerCt.getGridColumns()[1].isHidden(), 'Hidden: State applied to column');
        }
    );
});