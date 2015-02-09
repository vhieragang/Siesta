Ext.define('MyApp.view.Scheduler', {
    extend              : 'Sch.panel.SchedulerGrid',
    requires            : [
        'Ext.form.field.Text',
        'Ext.menu.Menu',
        'Ext.grid.plugin.CellEditing',
        'Sch.util.Date',
        'Sch.plugin.SimpleEditor',
        'Sch.plugin.SummaryColumn'
    ],

    snapToIncrement     : true,

    initComponent : function() {
        var me = this;

        var summaryCol  = Ext.create('Sch.plugin.SummaryColumn', {
            header      : 'Time allocated',
            width       : 80,
            showPercent : false
        });

        Ext.apply(this, {

            columns : [
                {
                    header      : 'Name',
                    sortable    : true,
                    width       : 200,
                    dataIndex   : 'Name',
                    editor      : new Ext.form.field.Text()
                },
                summaryCol,
                {
                    xtype       : 'actioncolumn',
                    sortable    : false,
                    align       : 'center',
                    tdCls       : 'sch-valign',
                    width       : 22,
                    position    : 'right',
                    items       : [
                        {
                            iconCls     : 'icon-delete',
                            tooltip     : 'Delete resource',
                            scope       : this,
                            handler     : function (view, rowIndex, colIndex, btn, e, resource) {
                                this.eventStore.remove(resource.getEvents());
                                this.resourceStore.remove(resource);
                            }
                        }
                    ]
                }
            ],
            plugins : [
                Ext.create('Ext.grid.plugin.CellEditing', { clicksToEdit : 1 }),
                summaryCol,
                Ext.create('Sch.plugin.SimpleEditor', { dataIndex : 'Name' })
            ],
            listeners : {
                eventcontextmenu    : function(g, rec, e) {
                    e.stopEvent();

                    if (!g.gCtx) {
                        g.gCtx = new Ext.menu.Menu({
                            items : [{
                                text    : 'Delete event',
                                iconCls : 'icon-delete-context',
                                handler : function() {
                                    g.eventStore.remove(g.gCtx.rec);
                                }
                            }]
                        });
                    }

                    g.gCtx.rec = rec;
                    g.gCtx.showAt(e.getXY());
                },
                scope : this
            }
        });

        this.callParent(arguments);
    }
});
