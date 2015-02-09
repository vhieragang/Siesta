StartTest(function (t) {
    t.diag("Test if the scrollable element is scrolled during drag drop operations, both vertically and horizontally");

    var scheduler;
    var viewEl;
    
    function setup(callback) {
        scheduler = t.cq1('schedulerpanel[lockable=true]');
        scheduler && scheduler.destroy();

        scheduler = t.getScheduler({ deferRowRender : false, height: 200, width: 400, dragConfig: { showTooltip: false} });
        
        scheduler.eventStore.first().set({
            ResourceId  : scheduler.resourceStore.first().get('Id'),
            StartDate   : scheduler.getStart(),
            Cls         : 'someClass'
        });
        scheduler.render(Ext.getBody());

        viewEl = scheduler.getSchedulingView().el;
    }
    
    t.it("Should scroll vertically, when dragging event to the top/bottom edge of the view", function (t) {
        
        var distance;
        setup();

        t.chain(
            { waitForEventsToRender : scheduler },

            function (next) {
                t.isGreater(viewEl.child('.x-grid-item-container').getWidth(), viewEl.getWidth(), 'Enough width to scroll');
                t.isGreater(viewEl.child('.x-grid-item-container').getHeight(), viewEl.getHeight(), 'Enough height to scroll');
                t.isDeeply(viewEl.getScroll(), { left: 0, top: 0 }, 'Scroll initally 0');

                next();
            },

            { drag : '.someClass', to : viewEl, toOffset : ['50%', '100%-20'], dragOnly : true },

            { waitFor : 'ScrollTopChange', args : viewEl, timeout : 30000 },

            function (next, firstScrollValue) {
                t.isGreater(viewEl.getScroll().top, 0, 'Scrolled down ok');
                
                next();
            },

            { waitFor : 1000 },

            { action : 'mouseUp' },

            { waitFor : 1000 },

            { waitForAnimations : [] },

            { drag : '.someClass', to : viewEl, toOffset : ['50%', 10], dragOnly : true },

            { waitFor : 'ScrollTopChange', args : viewEl, timeout : 30000 },

            { action : 'mouseUp' },

            { waitForAnimations : [] },

            { waitFor : 1000 }
        )
    });

    t.it("Should scroll horizontally, when dragging event to the left/right edge of the view", function (t) {
        var distance;
        setup();

        t.chain(
            { waitForEventsToRender : scheduler },

            function (next) {
                t.isGreater(viewEl.child('.x-grid-item-container').getWidth(), viewEl.getWidth(), 'Enough width to scroll');
                t.isGreater(viewEl.child('.x-grid-item-container').getHeight(), viewEl.getHeight(), 'Enough height to scroll');
                t.isDeeply(viewEl.getScroll(), { left: 0, top: 0 }, 'Scroll initally 0');

                next();
            },

            { drag : '.someClass', to : viewEl, toOffset : ['100%-20', '50%'], dragOnly : true },

            { waitFor : 'ScrollLeftChange', args : viewEl, timeout : 30000 },

            function (next, firstScrollValue) {
                t.isGreater(viewEl.getScroll().left, 0, 'Scrolled right ok');

                next();
            },

            { waitFor : 1000 },

            { action : 'mouseUp' },

            { waitFor : 1000 },

            { waitForAnimations : [] },

            { drag : '.someClass', to : viewEl, toOffset : [10, '50%'], dragOnly : true },

            { waitFor : 'ScrollLeftChange', args : viewEl, timeout : 30000 },

            { action : 'mouseUp' },

            { waitForAnimations : [] }
        )
    })
})    
