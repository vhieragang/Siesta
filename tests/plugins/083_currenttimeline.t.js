StartTest(function (t) {
    var today = new Date(),
        year = today.getFullYear(),
        month = today.getMonth(),
        day = today.getDate(),
        hour = today.getHours(),
        start = new Date(year, month, day, hour),
        resourceStore = new Sch.data.ResourceStore({
            data : [
                { Name : 'Dude' }
            ]
        });

    t.it('Horizontal orientation', function (t) {

        var timeline = Ext.create("Sch.plugin.CurrentTimeLine", {
            updateInterval : 100
        });

        var scheduler = t.getScheduler({
            height        : 200,
            width         : 300,
            startDate     : Ext.Date.add(start, Ext.Date.HOUR, -1),
            endDate       : Ext.Date.add(start, Ext.Date.HOUR, 2),
            viewPreset    : 'hourAndDay',
            resourceStore : resourceStore,
            forceFit      : true,
            plugins       : timeline
        });

        scheduler.render(Ext.getBody());

        var record = timeline.store.first(),
            originalDate = record.get('Date'),
            originalX;

        t.chain(
            { waitFor : 'selector', args : ['.sch-timeline.sch-todayLine', scheduler.el] },

            { waitFor : function () {
                return record.get('Date') > originalDate;
            } },

            function (next) {
                t.pass("Date value increased");

                t.wontFire(timeline.store, 'update', 'Store should not be updated after host is destroyed');
                scheduler.destroy();
                next()
            },

            { waitFor : 500 }
        );
    })

    t.it('Vertical orientation', function (t) {

        var timeline = Ext.create("Sch.plugin.CurrentTimeLine", {
            updateInterval : 100
        });

        var scheduler = t.getScheduler({
            height        : 400,
            width         : 400,
            startDate     : Ext.Date.add(start, Ext.Date.HOUR, -1),
            endDate       : Ext.Date.add(start, Ext.Date.HOUR, 2),
            viewPreset    : 'hourAndDay',
            resourceStore : resourceStore,
            orientation   : 'vertical',
            forceFit      : true,
            plugins       : timeline
        });

        scheduler.render(Ext.getBody());

        var record = timeline.store.first(),
            originalDate = record.get('Date'),
            originalX;

        t.chain(
            { waitFor : 'selector', args : ['.sch-timeline.sch-todayLine', scheduler.el] },

            { waitFor : function () {
                return record.get('Date') > originalDate;
            } },

            function (next) {
                var timelineEl = scheduler.el.down('.sch-timeline.sch-todayLine');

                t.isApprox(timelineEl.getWidth(), scheduler.down('resourcecolumn').getWidth(), 1, 'Line has correct width')
                t.pass("Date value increased");
            }
        );
    })
})
