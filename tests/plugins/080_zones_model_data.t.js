StartTest(function (t) {

    t.it('Should include all data from the model when populating template', function(t) {
        Ext.define("Sch.FooEvent", {
            extend : 'Sch.model.Range',
            fields : ['Foo']
        })

        var scheduler = t.getScheduler({
            renderTo : document.body
        })

        var zoneStore = Ext.create('Ext.data.JsonStore', {
            model : 'Sch.FooEvent',
            data  : [
                {
                    StartDate : scheduler.getStart(),
                    EndDate   : scheduler.getEnd(),
                    Foo       : 'Bar'
                }
            ]
        });

        var zones = Ext.create("Sch.plugin.Zones", {
            store : zoneStore
        });

        zones.init(scheduler)
        var templateData = zones.getElementData(scheduler.getStart(), scheduler.getEnd());

        t.is(templateData[0].Foo, 'Bar')
    })
});
