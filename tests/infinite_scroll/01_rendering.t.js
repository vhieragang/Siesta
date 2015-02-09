StartTest(function (t) {

    var startDate   = new Date(2011, 0, 3);

    var getScheduler = function (cfg) {

        return t.getScheduler(Ext.apply({
            height          : 200,
            infiniteScroll  : true,
            viewPreset      : 'weekAndDay',
            startDate       : startDate,
            endDate         : new Date(2011, 0, 13),
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
            
            function (next) { t.scrollVerticallyTo(view.el.dom, view.el.dom.scrollHeight/2, next); },

            t.getSubTest('Renders a proper initial state of view', function (t) {
                t.is(view.getDateFromCoordinate(view.el.dom.scrollLeft, null, true), startDate, 'visible area starts from a proper date');
            }),


            t.getSubTest('Keeps view body intact if scroll does not violate specified limit', function (t) {

                var width   = view.getWidth();

                var failFn  = function () { t.fail('should not refresh the view'); };

                view.on('refresh', failFn);

                var dom     = view.el.dom,
                    bodyDom = view.body.el.dom;

                var async   = t.beginAsync(),
                    tt      = t;

                t.it('doesnt get updated scroll to the left', function (t) {

                    t.scrollHorizontallyTo(dom, 1000, 100, function () {
                        t.ok(bodyDom === view.body.el.dom, 'view body DOM stayed the same');

                        t.it('doesnt get updated after scroll to the right', function (t) {

                            t.scrollHorizontallyTo(dom, dom.scrollWidth - 1000 - width, 100, function () {
                                t.ok(bodyDom === view.body.el.dom, 'view body DOM stayed the same');

                                view.un('refresh', failFn);

                                tt.endAsync(async);
                            });
                        });
                    });
                });
            }),


            t.getSubTest('refreshKeepingScroll() call keeps both horizontal and vertical scroll positions intact', function (t) {
                var dom         = view.el.dom,
                    leftScroll  = dom.scrollLeft,
                    topScroll   = dom.scrollTop,
                    dt          = view.getDateFromCoordinate(leftScroll, null, true);

                t.wontFire(view, 'viewchange', 'should not change the view');

                view.refreshKeepingScroll();

                t.waitFor(50, function () {
                    t.is(view.el.dom.scrollLeft, leftScroll, 'left scroll position is the same');
                    t.is(view.el.dom.scrollTop, topScroll, 'top scroll position is the same');
                    t.is(view.getDateFromCoordinate(view.el.dom.scrollLeft, null, true), dt, 'visible area starts from the same date');
                });
            }),


            t.getSubTest('Updates view body if scroll violates specified limit', function (t) {
                var width   = view.getWidth();

                t.willFireNTimes(view, 'refresh', 2, 'should refresh the view');

                var dom     = view.el.dom,
                    bodyDom = view.body.el.dom;

                var async   = t.beginAsync(),
                    tt      = t;

                t.it('for scroll to the left', function (t) {

                    var dateToScroll    = view.getDateFromCoordinate(10, null, true);
                    var topScroll       = dom.scrollTop;

                    t.scrollHorizontallyTo(dom, 10, 100, function () {
                        t.notOk(bodyDom === view.body.el.dom, 'view body DOM has been changed');

                        t.is(topScroll, dom.scrollTop, 'top scroll stayed the same ' + topScroll);

                        t.is(dateToScroll, view.getDateFromCoordinate(dom.scrollLeft, null, true), 'date stayed the same');

                        t.it('for scroll to the right', function (t) {

                            var posToScroll     = dom.scrollWidth - 10 - width;
                            var dateToScroll    = view.getDateFromCoordinate(posToScroll, null, true);
                            var topScroll       = dom.scrollTop;

                            t.scrollHorizontallyTo(dom, posToScroll, 100, function () {
                                t.notOk(bodyDom === view.body.el.dom, 'view body DOM has been changed');

                                t.is(topScroll, dom.scrollTop, 'top scroll stayed the same ' + topScroll);

                                t.is(dateToScroll, view.getDateFromCoordinate(dom.scrollLeft, null, true), 'date stayed the same');

                                tt.endAsync(async);
                            });

                        });

                    });
                });

            }),

            { waitFor : 50 },

            t.getSubTest('refresh() call keeps horizontal scroll position intact', function (t) {

                var dom         = view.el.dom,
                    leftScroll  = dom.scrollLeft,
                    dt          = view.getDateFromCoordinate(leftScroll, null, true);

                view.refresh();

                t.is(view.el.dom.scrollLeft, leftScroll, 'left scroll position is the same');
                t.is(view.getDateFromCoordinate(view.el.dom.scrollLeft, null, true), dt, 'visible area starts from the same date');
            })
        ); 
        // eof chain
    };
    
    var scenario2 = function (config) {
        return Ext.create('Sch.panel.SchedulerTree', Ext.apply({
            height           : 400,
            width            : 600,
            renderTo         : Ext.getBody(),
            eventStore       : t.getEventStore(),
            resourceStore    : t.getResourceTreeStore(),
            viewPreset       : 'hourAndDay',
            infiniteScroll  : true,
    
            columns : [
                {
                    xtype     : 'treecolumn',
                    text      : 'Name',
                    width     : 200,
                    dataIndex : 'Name'
                }
            ]
        }, config));
    }

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
    
    t.it('SchedulerTree with infinite scroll should scroll to startDate after render', function (t) {
        var flightStore = Ext.create('Sch.data.EventStore', {
            data : [
                {ResourceId : 'r1', Name : 'Summary', StartDate : "2011-12-02 08:20", EndDate : "2011-12-02 11:25"}
            ]
        });
        
        t.it('Without date specified', function (t) {
            var tree = scenario2({
                eventStore       : flightStore
            });
            
            t.chain(
                { waitForRowsVisible : tree },
                function (next) {
                    var view = tree.getSchedulingView();
                    var leftScroll = view.getScroll().left;
                    t.is(leftScroll, view.getCoordinateFromDate(new Date(2011, 11, 2, 8)), 'Scrolled to startDate specified');
                    t.isApprox(view.timeAxisViewModel.getTotalWidth(), leftScroll * 2, leftScroll / 4, 'View scrolled to center');
                    next();
                }
            );
        });
        
        t.it('With start date specified', function (t) {
            var testDate = new Date(2012, 11, 2, 8);
        
            var tree = scenario2({
                eventStore      : flightStore,
                startDate       : testDate,
                endDate         : new Date(2012, 11, 3, 8)
            });
            
            t.chain(
                { waitForRowsVisible : tree },
                function (next) {
                    var view = tree.getSchedulingView();
                    var leftScroll = view.getScroll().left;
                    t.is(leftScroll, view.getCoordinateFromDate(testDate), 'Scrolled to startDate specified');
                    t.isApprox(view.timeAxisViewModel.getTotalWidth(), leftScroll * 2, leftScroll / 4, 'View scrolled to center');
                    next();
                }
            );
        });
    });

});
