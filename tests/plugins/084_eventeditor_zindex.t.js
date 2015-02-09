StartTest(function(t) {
    
    var scheduler, win, editor;

    function setupScheduler () {

		editor = Ext.create("Sch.plugin.EventEditor", {
		    height          : 140,
		    width           : 280,
		    constrain       : true,
            animCollapse    : false,

            // panel with some form fields
            fieldsPanelConfig : {
                xtype : 'form'
            }
        });

		scheduler = t.getScheduler({
		    allowOverlap : false,
		    forceFit : true,
		    plugins : editor
		}, 2);

		win = new Ext.Window({
		    width: 500,
		    height: 300,
		    x:0,
		    y:0,
		    draggable: true,
		    layout : 'fit',
		    items     : scheduler
		});

		win.show();
    }

    t.it('Should show editor visible, and keep it visible when clicking datepicker or containing window', function(t) {
        setupScheduler();

		t.chain(
		    { waitFor : 'eventsToRender', args : scheduler },

		    { action : 'doubleClick', target : '.sch-event' },

		    { action : 'click', target : 'eventeditor datefield => .x-form-trigger' },
		    { action : 'click', target : '.x-datepicker-date' },

		    function(next) {
		        t.ok(editor.isVisible(), 'Editor visible when clicking date in date picker');
		        next();
		    },

		    { action : 'click', target : win.getHeader() },

		    function(next) {
		        t.ok(editor.isVisible(), 'Editor visible when clicking containing window');
		        t.isGreater(editor.getEl().getZIndex(), win.getEl().getZIndex(), 'Editor visible when clicking containing window header');

                win.destroy()
            }
        )
    })

    t.it('Should show editor visible, and keep it visible when dragging containing window', function(t) {
        setupScheduler();

        t.chain(
		    { action : 'doubleClick', target : '.sch-event' },
            { action : 'drag', target : '.x-window-header', by : [0, 50]},

		    function(next) {
		        t.isGreater(editor.getEl().getZIndex(), win.getEl().getZIndex(), 'Editor on top of window');
                win.destroy()
            }
        )
    });

    t.it('Should show editor visible, and keep it visible when dragging containing window', function(t) {
        setupScheduler();

        var editorPos;

        scheduler.eventStore.removeAll();

        t.chain(

            { drag : '.sch-timetd', by : [100, 0] },
            { click : scheduler.getSchedulingView().el, offset : [2, 2] },

            //Testing blur when clicking outside of event editor
            { waitFor : function() { return editor.getCollapsed() && editor.isHidden(); } },

            { waitFor : 100 },
		    function(next) {
                var proxy = scheduler.el.down(".sch-dragcreator-proxy");

                t.isLess(proxy.getTop(), -100, 'Proxy hidden after clicking on schedule');

                next();
		    }
		);
    });
});
