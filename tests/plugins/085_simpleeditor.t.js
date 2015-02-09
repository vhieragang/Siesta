StartTest(function (t) {

    window.top.focus();

    var editor = new Sch.plugin.SimpleEditor({
        dataIndex    : 'Name',
        newEventText : 'new'
    });

    var s = t.getScheduler({
        width      : 400,
        renderTo   : Ext.getBody(),
        forceFit   : true,
        plugins    : editor,
        eventStore : new Sch.data.EventStore()
    });

    t.chain(
        { waitFor : 'rowsVisible', args : s  },
        { action : 'drag', target : '.sch-timetd', by : [-100, 0] },

        { waitFor : 100 },

        function (next) {
            t.is(s.eventStore.getCount(), 0, 'Still no record in the store');

            t.is(editor.getValue(), "new", 'Editor has correct value after editing started');
            editor.setValue('');

            next();
        },

        { action : 'type', target : '.x-form-field', text : 'foo[ENTER]' },

        function (next) {
            t.is(s.eventStore.getCount(), 1, '1 record added to the store');
            next();
        },

        { action : 'doubleclick', target : '.sch-event' },

        function (next) {
            // Need to manually refresh it here since FF doesn't highlight the text properly if window loses focus (during automation)
            editor.setValue('');
            next();
        },

        { action : 'type', text : 'test1234[ENTER]' },

        function () {
            t.is(s.eventStore.first().get('Name'), "test1234", 'Record was updated ok');
            t.like(t.getFirstEventEl(s).dom.innerHTML, "test1234", 'Element was refreshed ok');
        }
    );
});
