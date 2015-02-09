Ext.define('App.store.DeliveryStore', {
    extend : 'Ext.data.Store',

    model : 'App.model.Delivery',

    taskStore         : null,
    deliveryStepStore : null,

    constructor : function () {
        this.callParent(arguments);
        this.taskStore.setDeliveryStore(this);
    },

    proxy : {
        url    : 'data.js',
        type   : 'ajax',
        reader : {
            type         : 'json',
            rootProperty : 'deliveries'
        }
    },

    listeners : {
        load : function (s) {
            // Load related stores
            this.deliveryStepStore.loadData(s.proxy.reader.rawData.deliverySteps)
            this.taskStore.loadData(s.proxy.reader.rawData.deliveryTasks);

            var tasks = this.first().getTasks();
        }
    }
});
