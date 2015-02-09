StartTest(function(t) {
    t.diag("Verify all 4 corners of the event are 'on top' and not obstructed by some z-index issue");

    var s = t.getScheduler({
        renderTo : Ext.getBody(),
        eventResizeHandles : 'none'
    }, 1);

    t.chain(
        { waitForEventsToRender : s },

        function(next) {
		    var el = t.getFirstEventEl(s);
		    var region = el.getRegion();

		    t.elementIsAt(el, [region.left+5, region.top+5], true, 'Horizontal:  (t-l)');
		    t.elementIsAt(el, [region.left+5, region.bottom-5], true, 'Horizontal:  (b-l)');
		    t.elementIsAt(el, [region.right-5, region.top+5], true, 'Horizontal:  (t-r)');
		    t.elementIsAt(el, [region.right-5, region.bottom-5], true, 'Horizontal:  (b-r)');

            s.destroy();

            s = t.getScheduler({
                renderTo            : Ext.getBody(),
                eventResizeHandles  : 'none',
                orientation         : 'vertical'
            }, 1);

            t.waitForEventsToRender(s , next)
        },

        function(next) {
            var el = t.getFirstEventEl(s);
		    var region = el.getRegion();

		    t.elementIsAt(el, [region.left+5, region.top+5], true, 'Vertical (t-l)');
		    t.elementIsAt(el, [region.left+5, region.bottom-5], true, 'Vertical (b-l)');
		    t.elementIsAt(el, [region.right-5, region.top+5], true, 'Vertical (t-r)');
		    t.elementIsAt(el, [region.right-5, region.bottom-5], true, 'Vertical (b-r)');
        }
    );
})    
