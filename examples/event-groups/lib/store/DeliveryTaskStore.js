Ext.define('App.store.DeliveryTaskStore', {
    extend        : 'Sch.data.EventStore',
    model         : 'App.model.DeliveryTask',
    deliveryStore : null,

    setDeliveryStore : function(store) {
        this.deliveryStore = store;
    },

    getTasksByDeliveryId : function(id) {
        return this.query('DeliveryId', id);
    }
});
