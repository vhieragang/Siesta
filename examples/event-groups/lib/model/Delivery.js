Ext.define('App.model.Delivery', {
    extend     : 'Ext.data.Model',
    idProperty : 'Id',

    fields : [
        {name : 'Id'},
        {name : 'Name'},
        {name : 'Date', type : 'date', dateFormat : 'Y-m-d G:i'}
    ],

    getTasks : function () {
        return this.joined[0].taskStore.getTasksByDeliveryId(this.getId());
    },

    set : function(field, value) {
        var current = this.get('Date');

        this.callParent(arguments)

        if (field === 'Date') {
            this.getTasks().each(function(t) {
                var diffMinutes = Sch.util.Date.getDurationInMinutes(current, value);

                t.setStartEndDate(Ext.Date.add(t.getStartDate(), Ext.Date.MINUTE, diffMinutes),
                                  Ext.Date.add(t.getEndDate(), Ext.Date.MINUTE, diffMinutes));
            })
        }
    }
});
