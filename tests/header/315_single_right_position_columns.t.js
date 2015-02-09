StartTest(function(t) {
    
    var scheduler = new Sch.panel.SchedulerGrid({
        viewPreset          : 'dayAndWeek',
        
        lightWeight : true,
        height              : 250,
        width               : 700,
        
        startDate           : new Date(2010, 11, 6),
        endDate             : new Date(2010, 11, 13),
        
        renderTo            : Ext.getBody(),
        viewConfig          : { forceFit : true },

        // Setup static columns
        columns             : [
            { header : 'Name',              width:130, dataIndex : 'Name'},
            { header : 'Favorite Color',    width:100, dataIndex : 'FavoriteColor', position : 'right'}
        ],
                        
        // Store holding all the resources
        resourceStore : new Sch.data.ResourceStore({
            model       : 'Sch.model.Resource',
            
            data        : [
                {Id : 'r1', Name : 'Mike', FavoriteColor : 'blue'},
                {Id : 'r2', Name : 'Linda', FavoriteColor : 'red'},
                {Id : 'r3', Name : 'Don', FavoriteColor : 'yellow'},
                {Id : 'r4', Name : 'Karen', FavoriteColor : 'black'},
                {Id : 'r5', Name : 'Doug', FavoriteColor : 'green'},
                {Id : 'r6', Name : 'Peter', FavoriteColor : 'lime'}
            ]
        }),
    
        // Store holding all the events
        eventStore : new Sch.data.EventStore({
            data        : [
                { ResourceId: 'r1', Title : 'Assignment 1', StartDate : "2010-12-06", EndDate : "2010-12-07"},
                { ResourceId: 'r2', Title : 'Assignment 2', StartDate : "2010-12-07", EndDate : "2010-12-09"},
                { ResourceId: 'r3', Title : 'Assignment 3', StartDate : "2010-12-08", EndDate : "2010-12-12"},
                { ResourceId: 'r4', Title : 'Assignment 4', StartDate : "2010-12-07", EndDate : "2010-12-11"},
                { ResourceId: 'r5', Title : 'Assignment 5', StartDate : "2010-12-09", EndDate : "2010-12-18"},
                { ResourceId: 'r6', Title : 'Assignment 6', StartDate : "2010-12-18", EndDate : "2010-12-20"}
            ]
        })
    });
    
    t.waitForEventsToRender(scheduler, function () {
        var normalHeader    = scheduler.normalGrid.headerCt;
        var lockedHeader    = scheduler.lockedGrid.headerCt;
        
        var timeAxisColumn  = scheduler.down('timeaxiscolumn')
        t.pass('Rendered right columns ok');

        timeAxisColumn.el.select('.sch-header-row-middle td').each(function(td) {
            t.ok(td.dom.style.width, 'Width detected in style definition');
        });
    });
})    
