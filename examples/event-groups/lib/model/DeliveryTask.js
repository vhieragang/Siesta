Ext.define('App.model.DeliveryTask', {
    extend : 'Sch.model.Event',
    fields : [
        'DeliveryId'
    ],

    getDelivery : function(id) {
        return this.joined[0].deliveryStore.getById(this.get('DeliveryId'));

    }
});
