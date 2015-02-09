StartTest({
    overrideSetTimeout : false
},function(t) {

    var printable   = new Sch.plugin.Printable({ autoPrintAndClose : false });

    var scheduler   = t.getScheduler({
        viewPreset          : 'weekAndDayLetter',
        
        renderTo            : Ext.getBody(),
        viewConfig          : { forceFit : true },
        
        plugins             : [
            printable,
            new Sch.plugin.Zones({
                store       : new Ext.data.Store({
                    model   : 'Sch.model.Range',
                    data    : [
                        {
                            StartDate   : new Date(2010, 1, 3),
                            EndDate     : new Date(2010, 1, 7),
                            Cls         : 'myZoneStyle'
                        }
                    ]
                })
            })
        ],
        
        startDate           : new Date(2010, 1, 1),
        endDate             : new Date(2010, 1, 20),
        
        eventStore          : new Sch.data.EventStore({
            data        : [
                { Id : 1, StartDate : new Date(2010, 1, 3), EndDate : new Date(2010, 1, 5), ResourceId  : 1 },
                { Id : 11, StartDate : new Date(2010, 1, 3), EndDate : new Date(2010, 1, 5), ResourceId  : 1 },
                { Id : 2, StartDate : new Date(2010, 1, 5), EndDate : new Date(2010, 1, 7), ResourceId  : 2 },
                { Id : 3, StartDate : new Date(2010, 1, 11), EndDate : new Date(2010, 1, 11), ResourceId  : 3 },
                { Id : 31, StartDate : new Date(2010, 1, 11), EndDate : new Date(2010, 1, 12), ResourceId  : 3 },
                { Id : 32, StartDate : new Date(2010, 1, 11), EndDate : new Date(2010, 1, 13), ResourceId  : 3 }
            ]
        }),
        resourceStore       : new Sch.data.ResourceStore({
            data        : [
                { Id : 1, Name  : 'Resource1' },
                { Id : 2, Name  : 'Resource2' },
                { Id : 3, Name  : 'Resource3' }
            ]
        }),
        
        columns             : [
            {
                dataIndex       : 'Name'
            }
        ]
    });

    t.chain(
        { waitFor : 'rowsVisible', args : scheduler },
        { waitFor : 100 },

        function (next) {
            if (scheduler.print() !== false) 
                t.chain(
                    { waitFor : 1000 },
                    
                    function (next) {
                        var win         = printable.printWindow;
                        var bodyHtml    = win.document.body.innerHTML;

                        t.hasCls(win.document.body, 'sch-print-body', 'Should find sch-print-body on the print body element');
                        t.ok(Ext.fly(win.document.body).down('.sch-print-ct'), 'Should find sch-print-ct class as a child of the print body element');

                        t.like(bodyHtml, 'sch-timeline', 'Found rendered column line');
                        t.like(bodyHtml, 'myZoneStyle', 'Found rendered zone style');
                        t.like(bodyHtml, 'sch-zone', 'Found rendered zone');
                        
                        var doc         = win.document
                        
                        var normalRowsCt    = doc.getElementById('normalRowsCt')
                        var lockedRowsCt    = doc.getElementById('lockedRowsCt')
                        
                        var lockedRows      = Ext.query(Ext.grid.View.prototype.itemSelector, lockedRowsCt)
                        var normalRows      = Ext.query(Ext.grid.View.prototype.itemSelector, normalRowsCt)
                        
                        t.is(lockedRows.length, normalRows.length, 'Sanity - equal number of rows')
                        
                        Ext.Array.each(lockedRows, function (lockedRow, index) {
                            t.is(lockedRow.offsetHeight, normalRows[ index ].offsetHeight, 'Row height sync is ok')
                        })
                        
                        win.close();
                        
                        next();
                    },
                    next
                )
            else
                next()
        },

        { action : 'done'}
    );
});
