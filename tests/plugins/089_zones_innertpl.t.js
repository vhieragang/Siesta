StartTest(function(t) {
    var zoneStore = Ext.create('Ext.data.JsonStore', {
        model : 'Sch.model.Range',
        data : [
            {
                StartDate : new Date(2011, 0, 3),
                EndDate : new Date(2011, 0, 13)
            }
        ]
    });

    var scheduler = t.getScheduler({
        startDate : new Date(2011, 0, 3), 
        endDate : new Date(2011, 0, 6), 
        plugins : Ext.create("Sch.plugin.Zones", {
            innerTpl : '<span class="foo"></span>',
            store : zoneStore
        })
    });

    scheduler.render(Ext.getBody());

    t.waitForSelector('.foo', function(els) {
        // Done
        t.pass('Should be able to configure an innerTpl for Zones');
    });
});
