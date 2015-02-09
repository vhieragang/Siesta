StartTest(function(t) {
    var scheduler = t.getScheduler({
        eventBarTextField   : 'Name',
        renderTo            : Ext.getBody()
    });

    t.waitForEventsToRender(scheduler, function test() { 
        var task = scheduler.eventStore.first();
        
        task.setStartDate(Ext.Date.add(scheduler.getStart(), Ext.Date.SECOND, -1));
        var taskEl = t.getFirstEventEl(scheduler);

        t.hasCls(taskEl, 'sch-event-startsoutside', 'Correct CSS class applied for event starting outside view');

        t.hasStyle(taskEl, 'text-align', 'left', 'Text should be left aligned by default, and not be affected by what is stated in column config.');
        
        t.like(taskEl.dom.innerHTML, task.get('Name'), 'Correctly included the Name field inside of event bar');
        
        task.setEndDate(Ext.Date.add(scheduler.getEnd(), Ext.Date.SECOND, 1));
        taskEl = scheduler.getSchedulingView().getElementFromEventRecord(task);
        t.hasCls(taskEl, 'sch-event-endsoutside', 'Correct CSS class applied for event ending outside view');

        task.setStartEndDate(scheduler.getStart(), scheduler.getStart());
        taskEl = scheduler.getSchedulingView().getElementFromEventRecord(task);
        t.hasCls(taskEl, 'sch-event-milestone', 'CSS class for zero-duration event');
    });
})    
