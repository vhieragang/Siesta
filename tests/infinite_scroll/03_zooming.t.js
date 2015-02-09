StartTest(function (t) {

    // #1150: Check that time frame changes after zooming-in

    var getScheduler = function (cfg) {

        return t.getScheduler(Ext.apply({
            height          : 200,
            infiniteScroll  : true,
            viewPreset      : 'hourAndDay',
            startDate       : new Date(2011, 0, 1, 6),
            endDate         : new Date(2011, 0, 2, 20),
            resourceStore   : t.getResourceStore({
                data : [
                    { Id : 'r1', Name : 'Mike' },
                    { Id : 'r2', Name : 'Linda' },
                    { Id : 'r3', Name : 'Don' },
                    { Id : 'r4', Name : 'Karen' },
                    { Id : 'r5', Name : 'Doug' },
                    { Id : 'r6', Name : 'Peter' },
                    { Id : 'r7', Name : 'r7' },
                    { Id : 'r8', Name : 'r8' },
                    { Id : 'r9', Name : 'r9' },
                    { Id : 'r10', Name : 'r10' },
                    { Id : 'r11', Name : 'r11' },
                    { Id : 'r12', Name : 'r12' },
                    { Id : 'r13', Name : 'r13' },
                    { Id : 'r14', Name : 'r14' },
                    { Id : 'r15', Name : 'r15' },
                    { Id : 'r16', Name : 'r16' },
                    { Id : 'r17', Name : 'r17' },
                    { Id : 'r18', Name : 'r18' },
                    { Id : 'r19', Name : 'r19' },
                    { Id : 'r20', Name : 'r20' },
                    { Id : 'r21', Name : 'r21' },
                    { Id : 'r22', Name : 'r22' },
                    { Id : 'r23', Name : 'r23' },
                    { Id : 'r24', Name : 'r24' },
                    { Id : 'r25', Name : 'r25' },
                    { Id : 'r26', Name : 'r26' },
                    { Id : 'r27', Name : 'r27' },
                    { Id : 'r28', Name : 'r28' },
                    { Id : 'r29', Name : 'r29' },
                    { Id : 'r30', Name : 'r30' }
                ]
            }),
            renderTo        : Ext.getBody()
        }, cfg));

    };

    var scenario1   = function (scheduler, t) {
        var view  = scheduler.getSchedulingView();

        t.chain(
            { waitForRowsVisible : scheduler },
            
            function (next) { t.scrollVerticallyTo(view.el.dom, view.el.dom.scrollHeight / 2, next); },

            t.getSubTest('Keeps total timeframe bigger than visible area after zooming in', function (t) {
                t.diag('invoke triple zoom-in');

                var centerDate              = scheduler.getViewportCenterDate()
                var scrollTopBeforeZoom     = view.el.dom.scrollTop

                scheduler.zoomIn();
                scheduler.zoomIn();
                scheduler.zoomIn();
                
                t.is(view.el.dom.scrollTop, scrollTopBeforeZoom, 'Scroll top position has not change')
                
                t.isApprox(scheduler.getViewportCenterDate(), centerDate, 1 * 60 * 1000, "Center date should be approximately the same")

                t.isLess(view.getWidth(), view.timeAxis.count() * view.timeAxisViewModel.getTickWidth(), 'total timeframe stayed bigger than visible area');
            })
        ); 
        // chain
    };


    t.it('Works for scheduler with deferInitialRefresh enabled', function (t) {
        scenario1(getScheduler(), t);
    });

    t.it('Works for scheduler with deferInitialRefresh disabled', function (t) {
        scenario1(getScheduler({
            viewConfig  : { deferInitialRefresh : false }
        }), t);
    });

    t.it('Works for scheduler with buffered rendering', function (t) {
        scenario1(getScheduler({
            plugins         : [ 'bufferedrenderer' ]
        }), t);
    });

});
