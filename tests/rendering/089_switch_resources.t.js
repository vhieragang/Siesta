StartTest(function(t) {

    // https://www.assembla.com/spaces/bryntum/support/tickets/348

    var scheduler = t.getScheduler({
        renderTo : Ext.getBody()
    });

    var eventStore    = scheduler.getEventStore(),
        task          = eventStore.first(),
        resourceStore = scheduler.getResourceStore(),
        res1          = task.getResource();

    t.waitForEventsToRender(scheduler, function test() {
        task.setResource(scheduler.resourceStore.getAt(1));

        var taskEl        = scheduler.getSchedulingView().getElementFromEventRecord(task),
            taskRow       = taskEl.up(Ext.grid.View.prototype.itemSelector);

        t.ok(taskRow.hasCls(Ext.grid.View.prototype.altRowCls), 'Row has "alt" class.');

        task.setName("FOOOO");

        t.ok(taskRow.hasCls(Ext.grid.View.prototype.altRowCls), 'Row has "alt" class after event was updated.');
    });
});
