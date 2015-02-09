StartTest(function(t) {
    var fnScope;

    var scheduler = t.getScheduler({
        eventBarTextField : 'Name',
        renderTo : Ext.getBody(),

        eventBodyTemplate: '<div class="sch-event-header">{headerText}</div>',

        eventRendererScope : 'scope',

        eventRenderer       : function (item, resourceRec, tplData, row, col, ds) {
            tplData.style = 'background-color:yellow';
            tplData.cls = 'test-cls';

            fnScope = this;

            return {
                headerText: "foo"
            };
        }
    });

    t.waitForEventsToRender(scheduler, function() {
        var taskEl = t.getFirstEventEl(scheduler);
            
        t.hasCls(taskEl, 'test-cls', 'Correct CSS class applied to event wrapper');
        
        t.hasStyle(taskEl, 'background-color', Ext.isIE8 ? 'yellow' : 'rgb(255, 255, 0)', 'Correctly applied inline style to event wrapper');
        
        t.ok(taskEl.down('.sch-event-header'), 'Correctly included the defined template inside of event bar');
        
        t.contentLike(taskEl.down('.sch-event-header'), 'foo', 'Correctly applied the returned object from eventRenderer to eventBodyTemplate.');

        t.is(fnScope, 'scope', 'Correct scope detected in eventRenderer fn');
    });
})    
