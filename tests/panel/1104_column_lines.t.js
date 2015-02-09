StartTest(function (t) {
    var s1 = t.getScheduler({
        height      : 200,
        width       : 600,
        viewPreset  : 'hourAndDay',
        startDate   : new Date(2010, 1, 1),
        endDate     : new Date(2010, 1, 1, 10),
        columnLines : true,
        renderTo    : Ext.getBody()
    });

    t.chain(
        { waitFor : 'selector', args : '.sch-column-line' },
        { waitFor : 100 },

        function (next) {
            var lines = Ext.select('.sch-column-line');
            var colWidth = s1.timeAxisViewModel.getTickWidth();
            var lineDom = lines.item(1).dom;
            var lineRegion = lines.item(1).getRegion();
            var found;

            for (var y = lineRegion.top; y < lineRegion.bottom; y++) {
                if (t.elementFromPoint(lineRegion.left, y) === lineDom) {
                    found = true;
                    break;
                }
            }

            t.notOk(found, 'Line should not be top of the stack anywhere, x=' + lineRegion.left + ', y=' + y);

            t.is(lines.first().getLeft(true), colWidth, 'First column lines positioned at first cell right');
            t.is(lines.last().getLeft(true), colWidth * 9, 'Last column lines positioned at last cell left');

            s1.resourceStore.removeAll();
            t.waitForSelectorNotFound('.sch-column-line', function () {
            });
        }
    );
})    

