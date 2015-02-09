StartTest(function(t) {
    var scripts = Ext.select('script', Ext.getHead());
    var foundScheduler = false;
    var foundExt = false;
    
    scripts.each(function(el) {
        if (el.dom.src && el.dom.src.match(/sch-all-debug\.js/)){
            foundScheduler = true;
        }

        if (el.dom.src && el.dom.src.match(/cdn\.sencha\.(io|com)/) && el.dom.src.match('ext-all.js|ext-all-rtl.js')){
            foundExt = true;
        }
    });

    t.ok(foundScheduler, 'Script tag with sch-all-debug.js found');

    t.ok(foundExt, 'ext-all.js script tag using cdn.sencha.io found');

    t.waitForSelector('.sch-timetd', function() {
        t.pass('Scheduler example rendered without exception');

        t.it('Search for suspicious header rendering artefacts', function(t) {
            Ext.select('.sch-column-header').each(function(el) {
                if (el.getWidth() <= 0) {
                    t.fail('Header cell has incorrect width');
                }
            });
        });

        t.it('Search for suspicious event rendering artefacts', function(t) {
            Ext.select('.sch-event').each(function(el) {
                if (el.getWidth() <= 0) {
                    t.fail('Event element has incorrect width');
                }
            });
        });

        var scheduler = t.cq1('schedulergrid,schedulertree');
        
        if (scheduler.columnLines && scheduler.isHorizontal()) {
            t.waitForSelector('.sch-column-line', function () {
                t.columnLinesSynced(scheduler, 'Lines are synced');
            });
        }

        t.waitForComponentQueryNotFound('loadmask{isVisible()}', function(){
            t.monkeyTest(scheduler, 10);

            t.selectorNotExists('[class*="undefined"]', 'No "undefined" class selectors found in DOM');
            t.selectorNotExists('[id*="undefined"]', 'No "undefined" ids found in DOM')
            t.selectorNotExists('[class*="null"]', 'No "null" class selectors found in DOM')
            t.selectorNotExists('[id*="null"]', 'No "null" ids found in DOM')

            if (!t.url.match('events.html')) {
                t.contentNotLike(document.body, '[object Object]', 'No stray objects found rendered in DOM')
            }
        });
    });
});
