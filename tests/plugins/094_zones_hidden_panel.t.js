StartTest(function (t) {
    var scheduler = t.getScheduler({
        startDate : new Date(2011, 0, 3),
        endDate   : new Date(2011, 0, 6),
        renderTo  : document.body,

        plugins : Ext.create("Sch.plugin.Zones", {
            store : Ext.create('Ext.data.JsonStore', {
                model : 'Sch.model.Range',
                data  : [
                    {
                        StartDate : new Date(2011, 0, 3),
                        EndDate   : new Date(2011, 0, 4),
                        Cls       : 'myZoneStyle'
                    }
                ]
            })
        })
    });

    t.chain(
        { waitFor : 'Selector', args : ['.myZoneStyle', scheduler.el] },

        function (next, els) {
            scheduler.hide();
            scheduler.setStart(new Date(2011, 0, 2));
            next();
        },

        { waitFor : 500 },

        // During this interval, zones will repaint with 0 height since view is hidden
        function (next) {
            scheduler.show();
            next();
        },

        { waitFor : 'Selector', args : ['.myZoneStyle', scheduler.el] },

        // Animation should finish first
        { waitFor : 500 },

        function (next) {
            t.isApprox(Ext.select('.sch-zone').first().getHeight(),
                scheduler.normalGrid.view.el.down('.x-grid-item-container').getHeight(),
                'Should find zones rendered correctly if scheduler is hidden initially')
        }
    );
});
