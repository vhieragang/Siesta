StartTest(function(t) {
    t.diag('Setup');
    t.expectGlobal('Line');

    var zoneStore = Ext.create('Ext.data.Store', {
        model : 'Sch.model.Range',

        // 1 valid + 3 invalid items which should not be rendered
        data : [
            {
                StartDate : new Date(2011, 1, 6),
                EndDate : new Date(2011, 1, 16),
                Cls : 'zone-foo'
            },
            {
                EndDate : new Date(2011, 1, 6),
                Cls : 'zone-foo'
            },
            {
                StartDate : new Date(2011, 1, 6),
                Cls : 'zone-foo'
            },
            {
                Cls : 'zone-foo'
            }
        ]
    }); 

    Ext.define('Line', {
        extend : 'Ext.data.Model',
        fields: [
            'Date',
            'Text',
            'Cls'
        ]
    });

    var lineStore = Ext.create('Ext.data.JsonStore', {
        model : 'Line',
        // 1 valid + 1 invalid item which should not be rendered
        data : [
            {
                Date : new Date(2011, 1, 8),
                Text : 'Some important date',
                Cls : 'line-foo'
            },
            {
            }
        ]
    });

    var scheduler = t.getScheduler({
        viewPreset : 'dayAndWeek',
        renderTo : Ext.getBody(),
        startDate : new Date(2011, 1, 5),
        endDate : new Date(2011, 1, 25),

        plugins: [
            Ext.create('Sch.plugin.Zones', { store: zoneStore }),
            Ext.create('Sch.plugin.Lines', { store: lineStore })
        ]
    });

    t.waitForSelector('.zone-foo', scheduler.el, function(result){
        t.is(zoneStore.getCount(), 4, 'Store loaded');
        t.is(result.length, 1, 'Only 1 zone rendered');

        t.waitForSelector('.line-foo', scheduler.el, function(result){
            t.is(lineStore.getCount(), 2, 'Store loaded');
            t.is(result.length, 1, 'Only 1 line rendered');
        });
    });
});  
