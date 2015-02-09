StartTest(function(t) {

    var v = new Sch.mixin.AbstractTimelineView();
    v.eventPrefix = 'pre-';

    document.body.innerHTML = '<div id="pre-1"></div>';
    var div = document.getElementById("pre-1");
    // Using a 'mock' record, only need its internalId
    var record = { internalId : '1' };

    t.is(v.getElementFromEventRecord(record).dom, div, 'getElementFromEventRecord ok');

    t.is(v.getEventNodeByRecord(record), div, 'getEventNodeByRecord ok');

    t.is(v.getEventIdFromDomNodeId("pre-1"), "1", 'getEventIdFromDomNodeId ok');


    t.it('getFormattedDate', function(t) {
        v.displayDateFormat = 'Y-m-d';
        t.is(v.getFormattedDate(new Date(2010, 1, 2), new Date(2010, 1, 1)), '2010-02-02');

        v.displayDateFormat = 'Y-m-d H:i';
        t.is(v.getFormattedDate(new Date(2010, 1, 2), new Date(2010, 1, 1)), '2010-02-02 00:00');
    })

    t.it('getFormattedEndDate', function(t) {
        // Remove 1 day to render 'inclusive' end date if display doesn't care about hour resolution
        v.displayDateFormat = 'Y-m-d';
        t.is(v.getFormattedEndDate(new Date(2010, 1, 2), new Date(2010, 1, 1)), '2010-02-01');

        // Keep as it and render 'exact' end date if display cares about hour resolution
        v.displayDateFormat = 'Y-m-d H:i';
        t.is(v.getFormattedEndDate(new Date(2010, 1, 2), new Date(2010, 1, 1)), '2010-02-02 00:00');
    })

})
