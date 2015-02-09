StartTest(function(t) {
    var scheduler = t.getScheduler({
        normalViewConfig: {
            emptyText: 'empty_schedule'
        },
        renderTo        : Ext.getBody()
    });

    t.waitForEventsToRender(scheduler, function() {
        // https://www.assembla.com/spaces/bryntum/support/tickets/299
        // #299: emptyText displayed multiple times in scheduling view
        scheduler.resourceStore.removeAll();
        t.contentLike(scheduler.getSchedulingView().el, 'empty_schedule', 'Should find empty text in schedule with no rows');
        t.is(scheduler.getSchedulingView().el.dom.innerHTML.match('empty_schedule').length, 1, 'View should just show 1 empty text');
        
        var inner = scheduler.getSchedulingView().el.dom.innerHTML;
        scheduler.getSchedulingView().refresh();

        t.is(scheduler.getSchedulingView().el.dom.innerHTML.match('empty_schedule').length, 1, 'View should still just show 1 empty text');
    });
})    

