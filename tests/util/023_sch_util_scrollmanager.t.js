StartTest(function(t) {

    var SM                      = Sch.util.ScrollManager;
    var scrollEl, cmp;

    function createCmp () {
        cmp && cmp.destroy();
        cmp = new Ext.Component({
            renderTo : document.body,
            height : 200,
            width  : 200,
            autoScroll : true,
            html   : '<div style="background:#aaa;margin:20px;width:400px;height:400px"></div>'
        });
    }
    
    function updatescrollEl () {
        scrollEl                 = cmp.el.dom;
        scrollEl.scrollLeft      = scrollEl.scrollTop = 0;
    }

    t.it('Should store and clear variables on activate/deactivate', function (t) {
        t.chain(
            function (next) {
                createCmp();
                next();
            },
            { waitFor : 500 },
            function (next) {
                updatescrollEl();
                t.wontFire(scrollEl, 'scroll');
                
                SM.activate(cmp, 'horizontal');
                t.is(SM.direction, 'horizontal', 'Should use direction if provided');
                
                SM.deactivate();
                
                SM.activate(cmp);
                t.is(SM.direction, 'both', 'Should default to both if direction is omitted');
        
                t.is(SM.activeEl.dom, scrollEl, 'Element ref stored')
                t.isDeeply(SM.scrollElRegion, Ext.fly(scrollEl).getRegion(), 'Element region ref stored')
        
                SM.deactivate();
        
                t.notOk(SM.activeEl, 'Element ref cleared')
                t.notOk(SM.scrollElRegion, 'Element region ref cleared');
            }
        );
    });


    t.it('Should not scroll target el if not activated', function (t) {
        t.chain(
            function (next) {
                createCmp();
                next();
            },
            { waitFor : 500 },
            function (next) {
                updatescrollEl();
                t.wontFire(scrollEl, 'scroll');
                next();
            },
            { moveCursorTo : scrollEl, offset : [ '14', '100%-24' ] },

            { waitFor : 1000 },

            function() {
                t.is(scrollEl.scrollLeft, 0);
                t.is(scrollEl.scrollTop, 0);
            }
        )
    })

    t.it('Should scroll target el when mouse is close to right edge', function (t) {
        t.chain(
            function (next) {
                createCmp();
                next();
            },
            { waitFor : 500 },
            function (next) {
                updatescrollEl();
                
                t.firesAtLeastNTimes(scrollEl, 'scroll', 1);
                SM.activate(cmp, 'both');
                
                next();
            },
            { moveCursorTo : scrollEl, offset : ['100%-24', '50%'] },

            {
                waitFor : function() {
                    return scrollEl.scrollLeft == scrollEl.scrollWidth - scrollEl.clientWidth && scrollEl.scrollTop == 0;
                }
            },

            function() {
                t.isGreater(scrollEl.scrollLeft, 0);
                t.is(scrollEl.scrollTop, 0);

                SM.deactivate();
            }
        )
    })

    t.it('Should scroll target el when mouse is close to bottom edge', function(t) {
        t.chain(
            function (next) {
                createCmp();
                next();
            },
            { waitFor : 500 },
            function (next) {
                updatescrollEl();
                
                t.firesAtLeastNTimes(scrollEl, 'scroll', 1);

                SM.activate(cmp, 'both');
                
                next();
            },
            { moveCursorTo : scrollEl, offset : ['20', '100%-20'] },

            {
                waitFor : function() {
                    return scrollEl.scrollLeft == 0 && scrollEl.scrollTop == scrollEl.scrollHeight - scrollEl.clientHeight;
                }
            },

            function() {
                SM.deactivate();
            }
        )
    })

    t.it('Should scroll left+top when mouse is close to bottom/left edge', function(t) {
        t.chain(
            function (next) {
                createCmp();
                next();
            },
            { waitFor : 500 },
            function (next) {
                updatescrollEl();
                
                scrollEl.scrollLeft = scrollEl.scrollTop = 100;

                t.firesAtLeastNTimes(scrollEl, 'scroll', 1);
        
                SM.activate(cmp, 'both');
                
                next();
            },
            { moveCursorTo : scrollEl, offset : ['4', '100%-24'] },

            {
                waitFor : function() {
                    return scrollEl.scrollLeft == 0 && scrollEl.scrollTop == scrollEl.scrollHeight - scrollEl.clientHeight;
                }
            },
            function () {
                SM.deactivate();
            }
        )
    })

	t.it('Should not scroll horizontally when SM configured with the vertical direction.', function (t) {
        t.chain(
            function (next) {
                createCmp();
                next();
            },
            { waitFor : 500 },
            function (next) {
                updatescrollEl();
                t.wontFire(scrollEl, 'scroll');
                SM.activate(cmp, 'vertical');
                next();
            },
            { moveCursorTo : scrollEl, offset : ['100%-24', '50%'] },

            {
                waitFor : 500
            },

            function() {
                t.is(scrollEl.scrollLeft, 0);
                t.is(scrollEl.scrollTop, 0);

                SM.deactivate();
            }
        )
    })
    
    t.it('Should not scroll vertically when SM configured with the horizontal direction.', function (t) {
        t.chain(
            function (next) {
                createCmp();
                next();
            },
            { waitFor : 500 },
            function (next) {
                updatescrollEl();
                t.wontFire(scrollEl, 'scroll');
                SM.activate(cmp, 'horizontal');
                next();
            },
            { moveCursorTo : scrollEl, offset : ['50%', '100%-24'] },

            { waitFor : 500 },

            function() {
                t.is(scrollEl.scrollLeft, 0);
                t.is(scrollEl.scrollTop, 0);

                SM.deactivate();
            }
        )
    })
    
})    
