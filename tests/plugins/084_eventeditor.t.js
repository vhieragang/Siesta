StartTest(function (t) {
    var titleField  = new Ext.form.TextField({
        name       : 'Name',
        fieldLabel : 'Task'
    });

    var editor = Ext.create("Sch.plugin.EventEditor", {
            height            : 140,
            width             : 280,
            constrain         : true,

            // panel with some form fields
            fieldsPanelConfig : {
                border  : false,
                padding : 10,
                xtype   : 'form',
                items   : titleField
            }
        }),
        editorPos;

    var s = t.getScheduler({
        width        : 500,
        height       : 300,
        allowOverlap : false,
        forceFit     : true,
        plugins      : editor,
        renderTo     : Ext.getBody()
    });


    var firstRec = s.eventStore.first();
    var lastRec = s.eventStore.last();
    firstRec.setCls('FOO');
    lastRec.setCls('BAR');
    lastRec.assign(firstRec.getResource());
    lastRec.setStartDate(firstRec.getEndDate(), Ext.Date.add(firstRec.getEndDate(), Ext.Date.DAY, 3))

    t.isLess(editor.el.getLeft(), -500, 'Editor is initially rendered outside the viewport');
    t.isLess(editor.el.getTop(), -500, 'Editor is initially rendered outside the viewport');

    t.isGreater(s.eventStore.getCount(), 0, 'Some records in the store');

    t.it('Should show editor on double click', function(t) {
        t.chain(
            { waitFor : 'eventsToRender', args : s },

            { action : 'doubleClick', target : '.FOO' },

            function (next) {
                t.isGreater(editor.el.getLeft(), 0, 'Editor is inside the viewport after double clicking an event');
                t.isGreater(editor.el.getTop(), 0, 'Editor is inside the viewport after double clicking an event');
            }
        );
    })

    t.it('Should show editor for other task on double click, even if it is already visible', function(t) {
        t.chain(
            { action : 'doubleClick', target : '.BAR' },
            { waitFor : 1000 },

            function (next) {
                t.notOk(editor.getCollapsed(), 'Editor expanded');
            }
        );
    })


    t.it('Should update record (+ DOM) after save', function(t) {
        t.chain(
            { action : 'doubleClick', target : '.FOO' },
            { waitFor : 1000 },

            function(next) {
                titleField.reset();
                next();
            },

            { action : 'type', target : titleField, text : 'test1234' },
            { action : 'click', target : editor.saveButton },

            function (next) {
                t.is(s.eventStore.first().getName(), "test1234", 'Record was updated ok');
                t.like(t.getFirstEventEl(s).dom.innerHTML, "test1234", 'Element was refreshed ok');
                next()
            },

            { waitFor : function() { return editor.getCollapsed() && editor.isHidden(); } }
        );
    });

    t.it('Should delete (triggers clear DOM) after delete', function(t) {
        t.chain(
            { action : 'doubleClick', target : '.FOO' },
            { waitFor : 1000 },

            // Testing deleting of existing event
            { action : 'click', target : editor.deleteButton },

            function (next) {
                t.is(s.eventStore.indexOf(firstRec), -1, 'Record no longer in the store');

                next();
            },

            { waitFor : 'selectorNotFound', args : '.FOO' }
        );
    });

    t.it('Should show editor after dragging in the schedule', function(t) {
        t.chain(
            function (next) {
                s.eventStore.removeAll();
                next();
            },

            // Testing creating a new event
            { drag : '.sch-timelineview', offset : [12, 12], by : [100, 0] },
            { waitFor : 1000 },

            { action : 'type', target : titleField, text : 'foo' },

            { action : 'click', target : editor.saveButton },

            function (next) {
                t.is(s.eventStore.getCount(), 1, '1 record was added to the store');
                t.is(s.eventStore.last().get('Name'), "foo", 'Correct name for new event');

                next();
            },

            { waitFor : function() { return editor.getCollapsed() && editor.isHidden(); } }
        );
    });
});
