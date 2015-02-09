StartTest(function (t) {

    var scheduler = t.getScheduler({
        renderTo    : document.body
    });

    var view = scheduler.getSchedulingView();
    var dt = new Date(2010, 1, 1, 3, 5);

    t.it('Max zoomed in, secondAndMinute preset', function(t) {
        scheduler.zoomInFull();

        t.expect(view.getDisplayDateFormat()).toBe('g:i:s')
        t.expect(view.getFormattedDate(dt)).toBe('3:05:00')
    })

    t.it('Max zoomed out, manyYears preset', function(t) {
        scheduler.zoomOutFull();

        t.expect(view.getDisplayDateFormat()).toBe('m/d/Y')
        t.expect(view.getFormattedDate(dt)).toBe('02/01/2010')
    })

})    
