StartTest(function (t) {

    var s = t.getScheduler({
        enableDragCreation : false,
        renderTo           : Ext.getBody(),
        dragConfig         : {
            showTooltip : false
        }
    }, 1);

    var origRegion;
    var origEl;

    t.chain(
        { waitFor : 'eventsToRender' },

        { click : '.sch-event' },

        { waitFor : 400 },

        function (next) {
            origEl = Ext.getBody().down('.sch-timetd .sch-event');
            origRegion = origEl.getRegion();
            next();
        },

        { action : 'mouseDown', target : '.sch-event' },

        { action : 'moveCursor', by : [10, 0] },
        { action : 'moveCursor', by : [-10, 0] },

        function (next, el) {
            var origEl = Ext.getBody().down('.sch-timetd .sch-event');

            t.notOk(origEl.isVisible(origEl), 'Original element should be hidden during drag drop');

            t.hasRegion(Ext.getBody().down('.sch-dragproxy .sch-event'),
                origRegion,
                'At drag start: Drag drop proxy should be aligned with original event');
            next();
        },

        { action : 'moveCursor', by : [10, 0] },

        function (next, el) {
            t.is(Ext.getBody().down('.sch-dragproxy .sch-event').getLeft(),
                origRegion.left + 10,
                'Drag drop proxy should move with mouse');

            origEl.select('.sch-resizable-handle').each(function (el) {
                t.elementIsNotTopElement(el, false, el.dom.className + ': Should not find any visible sub-elements during drag drop');
            })

            next()
        },

        { action : 'mouseUp'}
    );
})    