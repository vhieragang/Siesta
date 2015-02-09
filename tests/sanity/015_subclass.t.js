describe('Subclassing Ext Scheduler', function (t) {

    t.it('Should be possible to subclass the scheduler and find overridden values', function (t) {

        Ext.define('Ext.ux.Sub', {
            extend              : 'Sch.panel.SchedulerGrid',
            columns             : [
                { text : 'foo' }
            ],
            enableEventDragDrop : false,
            stateful            : false
        });

        var s = new Ext.ux.Sub({
            resourceStore           : t.getResourceStore(),
            eventStore              : t.getEventStore(),
            constrainDragToResource : true,

            viewConfig : {
                barMargin : 100
            }
        });

        t.expect(s.enableEventDragDrop).toBe(false);
        t.expect(s.stateful).toBe(false);
        t.expect(s.getSchedulingView().barMargin).toBe(100);
        t.expect(s.getSchedulingView().constrainDragToResource).toBe(true);

        t.expect(Ext.ux.Sub.prototype.columns.length).toBe(1);

        s.destroy();

        new Ext.ux.Sub({
            resourceStore : t.getResourceStore(),
            eventStore    : t.getEventStore(),
            renderTo      : document.body
        }).destroy();
    })
})
