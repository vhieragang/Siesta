describe('Should not show lock/unlock options for locked grid columns', function (t) {

    // http://www.sencha.com/forum/showthread.php?274441-Locked-grouped-grid-doesn-t-respect-lockable-attribute-of-column&p=1005556#post1005556
    function doTest(name, cfg, assertFn) {

        t.it(name, function(t) {
            var scheduler = t.getScheduler(Ext.apply({
                renderTo : Ext.getBody(),
                height   : 120,
                columns  : [
                    { header : 'Name', sortable : true, width : 100, dataIndex : 'Name'}
                ]
            }, cfg));

            t.chain(
                { click : scheduler.lockedGrid.headerCt, offset : ['100%', '50%'] },

                function() { assertFn(t) }
            )
        })
    }

    doTest('basic', null, function (t) {
        t.cqNotExists('menuitem[text=Lock]{isVisible()}')
    });

    doTest('grouping', {
        features : [
            {
                ftype              : 'grouping',
                hideGroupedHeader  : false,
                startCollapsed     : true,
                enableGroupingMenu : true
            }
        ]
    },function (t) {
        t.cqNotExists('[text*=Lock]{isVisible()}', 'Should not find Lock option')
        t.cqExists('[text*=Group]{isVisible()}', 'Should find Grouping option')
    })
});
