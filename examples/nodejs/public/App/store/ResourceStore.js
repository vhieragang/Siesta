Ext.define('App.store.ResourceStore', {
    extend : "Sch.data.ResourceStore",
    mixins : [
        'App.store.mixin.SocketIO'
    ],

    sortInfo : { field : 'Name', direction : "ASC" },
    proxy    : {
        type   : 'memory',
        reader : {
            type : 'json'
        }
    },

    constructor : function (config) {

        this.callParent(arguments);

        this.setData([
            {Id : 1, Name : 'Linda', FavoriteColor : 'red'},
            {Id : 2, Name : 'Nickolay', FavoriteColor : 'navy'},
            {Id : 3, Name : 'Jakub', FavoriteColor : 'black'},
            {Id : 4, Name : 'Doug', FavoriteColor : 'green'},
            {Id : 5, Name : 'Peter', FavoriteColor : 'lime'},
            {Id : 6, Name : 'Karin', FavoriteColor : 'red'},
            {Id : 7, Name : 'Goran', FavoriteColor : 'orange'},
            {Id : 8, Name : 'Mats', FavoriteColor : 'purple'}
        ]);
    }
});