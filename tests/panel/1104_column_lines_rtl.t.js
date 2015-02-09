StartTest(function (t) {
    var s1 = t.getScheduler({
        height      : 200,
        width       : 600,
        viewPreset  : 'hourAndDay',
        startDate   : new Date(2010, 1, 1),
        endDate     : new Date(2010, 1, 1, 10),
        columnLines : true,
        rtl         : true,
        renderTo    : Ext.getBody()
    });

    t.chain(
        { waitFor : 'selector', args : '.sch-column-line' },

        { waitFor : 100 },

        function (next) {
            var lines = Ext.select('.sch-column-line');
            var colWidth = s1.timeAxisViewModel.getTickWidth();

            t.is(lines.first().getStyle('right'), colWidth + 'px', 'First column line right style ok');
            t.is(lines.last().getStyle('right'), colWidth*9 + 'px', 'Last column line right style ok');

            t.is(s1.normalGrid.view.el.getRight(), s1.el.down('.sch-secondary-canvas').el.getRight(), 'Secondary canvas ok');
            t.isApprox(s1.normalGrid.view.el.down('.x-grid-item-container').dom.clientWidth,
                      s1.normalGrid.headerCt.el.down('.x-column-header').dom.clientWidth,
                      1,
                      'Grid view and header equally sized');
        }
    );
})    

