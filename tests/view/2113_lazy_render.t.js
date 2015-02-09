StartTest(function (t) {

    // Causes real Errors instead of just console log
    Ext.repoDevMode = true;

    Ext.create('Ext.Viewport', {
        layout : 'border',

        items : [
            {
                xtype  : 'container',
                region : 'center',
                layout : 'card',
                items  : [
                    { xtype : 'panel', cls : "foo" },
                    {
                        xtype         : 'schedulergrid',
                        resourceStore : t.getResourceStore(),
                        eventStore    : t.getEventStore(),
                        listeners     : {
                            afterrender : function() {
                                // This provokes an error it seems, as it causes a refresh during rendering
                                // during this refresh it seems unsafe to use suspendlayouts
                                this.eventStore.loadData([])
                            }
                        }
                    }
                ]
            }
        ]
    });

    t.waitForComponentQueryVisible('panel[cls=foo]', function () {
        t.cq1('viewport > container[region=center]').getLayout().setActiveItem(1);
        t.pass('Rendered scheduler ok')
    });
})    
