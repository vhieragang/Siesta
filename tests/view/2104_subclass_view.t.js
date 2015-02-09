StartTest(function(t) {
    var called = false;

    Ext.define('Sch.FooView', {
        extend: 'Sch.view.SchedulerGridView',
        alias: 'widget.fooview',

        initComponent: function() {
            called = true;
            this.callParent(arguments);
        }
    });


    var scheduler = t.getScheduler({
        viewType : 'fooview' 
    });

    scheduler.render(Ext.getBody());
    t.ok(t.cq('fooview').length, 1, 'Custom view found');
    t.ok(called, "Sch.FooView initComponent called");
})    

