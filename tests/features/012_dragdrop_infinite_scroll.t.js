StartTest(function (t) {
//    Ext.override(Ext.AbstractComponent, {
//        suspendLayouts : function () {
//            this.callParent(arguments);
//        }
//    });
    
    t.it('Should render rows when dragging triggers timeaxis update (grid)', function (t) {
        var scheduler = t.getScheduler({
            renderTo        : Ext.getBody(),
            infiniteScroll  : true,
            eventRenderer : function (item, r, tplData, row) {
                var bgColor;

                switch (row % 3) {
                    case 0:
                        bgColor = 'lightgray';
                        break;
                    case 1:
                        bgColor = 'orange';
                        break;
                    case 2:
                        bgColor = 'lightblue';
                        break;
                }

                tplData.style = "background-color:" + bgColor;
                tplData.cls = "event-" + r.getId();

                return item.get('Name');
            }
        });
        
        t.chain(
            { waitForEventsToRender : scheduler },
            { drag : '.event-r1', by: [10, 0], dragOnly : true },
            function (next) {
                
                scheduler.scrollToDate(new Date(2011, 1, 31));
                t.schedulerRowsSynced(scheduler);
                
                scheduler.scrollToDate(new Date(2010, 1, 31));
                t.schedulerRowsSynced(scheduler);
                
                next();
            },
            { action : 'mouseUp' }
        );
    });
    
    t.it('Should render rows when dragging triggers timeaxis update (tree)', function (t) {
        var scheduler = t.getSchedulerTree({
            renderTo        : Ext.getBody(),
            infiniteScroll  : true,
            cls             : 'second',
            resourceStore   : t.getResourceTreeStore(),
            eventRenderer : function (item, r, tplData, row) {
                var bgColor;

                switch (row % 3) {
                    case 0:
                        bgColor = 'lightgray';
                        break;
                    case 1:
                        bgColor = 'orange';
                        break;
                    case 2:
                        bgColor = 'lightblue';
                        break;
                }

                tplData.style = "background-color:" + bgColor;
                tplData.cls = "event-" + r.getId();

                return item.get('Name');
            }
        });
        
        t.chain(
            { waitForEventsToRender : scheduler },
            { drag : '.second .event-r1', by: [10, 0], dragOnly : true },
            function (next) {
                
                scheduler.scrollToDate(new Date(2011, 1, 31));
                t.schedulerRowsSynced(scheduler);
                
                scheduler.scrollToDate(new Date(2010, 1, 31));
                t.schedulerRowsSynced(scheduler);
                
                next();
            },
            { action : 'mouseUp' }
        );
    });
});