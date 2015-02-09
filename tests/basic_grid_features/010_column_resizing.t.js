StartTest(function (t) {

    function doTest(t, config) {
        var scheduler = t[config.tree ? "getSchedulerTree" : "getScheduler"](Ext.apply({
            renderTo   : Ext.getBody(),
            viewPreset : 'dayAndWeek',
            width      : 500,
            height     : 100,
            columns    : [
                {header : 'Name', sortable : true, width : 100, dataIndex : 'Name'},
                {header : 'Foo', sortable : true, width : 200, dataIndex : 'Foo'},
                {header : 'Bar', sortable : true, width : 50, dataIndex : 'Bar'}
            ]
        }, config));

        var firstHeader = scheduler.lockedGrid.headerCt.items.getAt(0)
        var secondHeader = scheduler.lockedGrid.headerCt.items.getAt(1)

        t.chain(
            {
                waitFor : 'RowsVisible',
                args    : scheduler
            },
            function (next) {
                // Make sure things work as expected after a view change
                scheduler.switchViewPreset('monthAndYear');

                t.willFireNTimes(scheduler, 'columnresize', 2, 'columnresize event should bubble');

                next()
            },
            {
                drag : function () {
                    return secondHeader.el.getXY()
                },
                by   : [ 50, 0 ]
            },
            function (next) {
                t.isApprox(firstHeader.getWidth(), 150, 1, 'Column correctly resized 1st time');

                next()
            },
            {
                // we can't start drag from exactly the same point where previous drag has stopped
                // (bug or "feature" in Ext?) so we need to move cursor on additional 1px
                drag : function () {
                    var xy = secondHeader.el.getXY();
                    xy[0]++;
                    return xy
                },
                by   : [ -50, 0 ]
            },
            function () {
                t.isApprox(firstHeader.getWidth(), 100, 1, 'Column correctly resized 2nd time');
            }
        )
    }

    t.it('Plain scheduler grid', function (t) {
        doTest(t, {})
    })

    t.it('Scheduler tree', function (t) {
        doTest(t, { tree : true })
    })

    t.it('Scheduler tree fixed locked width', function (t) {
        doTest(t, {
            tree             : true,
            layout           : 'border',
            lockedGridConfig : {
                width : 300
            }
        })
    })
});
