StartTest(function (t) {

    var s = t.getScheduler({
        renderTo    : Ext.getBody(),
        width       : 400,
        height      : 250,
        multiSelect : true,
        forceFit    : true,
        viewConfig  : { deferInitialRefresh : false },
        plugins     : Ext.create("Sch.plugin.DragSelector")
    });

    var box;
    var tableContainerEl = s.getSchedulingView().el.down('.x-grid-item-container');

    t.is(s.getEventSelectionModel().getCount(), 0, 'No records selected');

    t.it('Should select events as you drag', function(t) {

        t.chain(
            { waitFor : 'eventsToRender' },

            { drag : tableContainerEl, fromOffset : [ 1, 1 ], to: tableContainerEl, toOffset : [ "100%-1", "100%-1" ], options : { ctrlKey : true }, dragOnly : true },

            function (next) {
                var proxyEl = Ext.getBody().down('.sch-drag-selector');
                var box = tableContainerEl.getBox();

                t.is(s.getEventSelectionModel().getCount(), Ext.select(s.getSchedulingView().eventSelector).getCount(), 'Records were selected ok');
                t.ok(proxyEl, 'Should find proxy el + sch-drag-selector CSS class');

                t.elementIsTopElement(proxyEl, true, 'Should find selector as the top element');
                t.isApprox(proxyEl.getWidth(), box.width, 'Should find right width');
                t.isApprox(proxyEl.getHeight(), box.height, 'Should find right height');

                t.ok(proxyEl.getBorderWidth('l'), 'Should find el l border');
                t.ok(proxyEl.getBorderWidth('r'), 'Should find el r border');
                t.ok(proxyEl.getBorderWidth('t'), 'Should find el t border');
                t.ok(proxyEl.getBorderWidth('b'), 'Should find el b border');

                next()
            },

            { action    : 'mouseup' }
        );
    })

    t.it('Should clear selected events on click', function(t) {

        t.isGreater(s.getEventSelectionModel().getCount(), 0, 'some events initially selected');

        t.chain(

            { click : tableContainerEl, offset : [ '80%', '50%' ] },
        
            function (next) {
                t.is(s.getEventSelectionModel().getCount(), 0, 'All events should be unselected');
            }
        )
    });

    t.it('Should be able to select events after view refresh', function(t) {
        s.getSchedulingView().refresh()

        var tableEl = s.getSchedulingView().el.down('.x-grid-item-container');

        t.chain(
            { drag : tableEl, fromOffset : [1, 1], to: tableEl, toOffset : ["100%-1", "100%-1"], options : { ctrlKey : true }, dragOnly : true },

            function (next) {
                var proxyEl = Ext.getBody().down('.sch-drag-selector');
                var box = s.getSchedulingView().el.down('.x-grid-item-container').getBox();

                t.is(s.getEventSelectionModel().getCount(), Ext.select(s.getSchedulingView().eventSelector).getCount(), 'Records were selected ok');
                t.ok(proxyEl, 'Should find proxy el + sch-drag-selector CSS class');

                t.elementIsTopElement(proxyEl, true, 'Should find selector as the top element');
                t.isApprox(proxyEl.getWidth(), box.width, 'Should find right width');
                t.isApprox(proxyEl.getHeight(), box.height, 'Should find right height');

                t.ok(proxyEl.getBorderWidth('l'), 'Should find el l border');
                t.ok(proxyEl.getBorderWidth('r'), 'Should find el r border');
                t.ok(proxyEl.getBorderWidth('t'), 'Should find el t border');
                t.ok(proxyEl.getBorderWidth('b'), 'Should find el b border');

                next()
            },

            { action    : 'mouseup' }
        );
    });

    t.it('Should scroll when dragging close to edges', function(t) {
        var scheduler = t.getScheduler({
            renderTo    : Ext.getBody(),
            width       : 400,
            height      : 200,
            multiSelect : true,
            viewConfig  : { deferInitialRefresh : false },
            plugins     : Ext.create("Sch.plugin.DragSelector"),
            eventStore  : new Sch.data.EventStore()
        });
        
        var normalView  = scheduler.normalGrid.view

        t.chain(
            { 
                waitForScrollChange : [ normalView.el, 'left' ],
                trigger             : { 
                    drag        : normalView, 
                    fromOffset  : [10, 1], 
                    to          : normalView, 
                    toOffset    : ["100%-15", 10], 
                    options     : { ctrlKey : true }, 
                    dragOnly    : true 
                }
            },
            { action : 'mouseUp' },
            function (next) {
                t.isGreater(normalView.el.dom.scrollLeft, 0)
                
                next()
            },
            { 
                waitForScrollChange     : [ normalView.el, 'top' ],
                trigger                 : { 
                    drag        : normalView, 
                    fromOffset  : [ 50, 1 ], 
                    to          : normalView, 
                    toOffset    : [ 50, "100%-20" ], 
                    options     : { ctrlKey : true }, 
                    dragOnly    : true 
                }
            },
            { action : 'mouseUp' },

            function () {
                t.isGreater(normalView.el.dom.scrollTop, 0)
            }
        );
    });
});
