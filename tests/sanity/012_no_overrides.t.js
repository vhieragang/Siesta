StartTest(function (t) {

    t.todo(function(t) {
        t.assertNoGlobalExtOverrides();
    }, 'Strange Ext behavior: Ext.globalEvents.curHeight`, `Ext.globalEvents.curWidth`, `Ext.GlobalEvents.curHeight`, `Ext.GlobalEvents.curWidth');
})
