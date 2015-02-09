Ext.ns('App');

//Ext.Loader.setConfig({ enabled : true, disableCaching : true });
//Ext.Loader.setPath('Sch', '../../js/Sch');

//Ext.require([
//    'Sch.panel.SchedulerGrid'
//]);

Ext.onReady(function () {

    var start = new Date();

    // Make sure interval starts on a monday. 
    start = Sch.util.Date.add(start, Sch.util.Date.DAY, -start.getDay() + 1);

    Ext.define('Auction', {
        extend : 'Sch.model.Resource',
        fields : [
            {name : 'Id', mapping : 'itemId'}
        ]
    });

    Ext.define('AuctionItem', {
        extend : 'Sch.model.Event',
        fields : [
            {name : 'Id', mapping : 'itemId'},
            {name : 'Name', mapping : 'title[0]'},

            {name : 'ResourceId', mapping : 'itemId'},
            {name : 'Title', mapping : 'title[0]'},
            {name : 'Price', mapping : 'sellingStatus[0].currentPrice[0].__value__'},
            {name : 'Location', mapping : 'location[0]'},
            {name : 'GalleryUrl', convert : function (v, r) {
                return r.data.galleryURL ? r.data.galleryURL[0] : Ext.BLANK_IMAGE_URL;
            }},
            {name : 'ViewItemUrl', mapping : 'viewItemURL[0]'},
            {name : 'StartDate', mapping : 'listingInfo[0].startTime[0]', type : 'date', dateFormat : "c"},
            {name : 'EndDate', mapping : 'listingInfo[0].endTime[0]', type : 'date', dateFormat : "c"}
        ]
    });

    // Store holding all the resources
    var auctionStore = Ext.create("Sch.data.ResourceStore", {
        model : 'Auction'
    });

    // Store holding all the events
    var itemStore = Ext.create("Sch.data.EventStore", {
        model         : 'AuctionItem',
        proxy         : {
            type          : 'scripttag',
            callbackParam : 'callback',
            url           : 'http://svcs.ebay.com/services/search/FindingService/v1',

            extraParams : {
                "OPERATION-NAME"       : 'findItemsAdvanced',
                "SERVICE-VERSION"      : '1.0.0',
                "SECURITY-APPNAME"     : 'MatsBryn-c034-4a5d-90f1-2f4cd5a72edb',
                "RESPONSE-DATA-FORMAT" : 'JSON',
                "REST-PAYLOAD"         : true,
                "itemFilter(0).name"   : "Currency",
                "itemFilter(0).value"  : "USD",
                "paginationInput.pageNumber"     : 1,
                "paginationInput.entriesPerPage" : 20
            },
            startParam  : "paginationInput.pageNumber",      // The parameter name which specifies the start row
            limitParam  : "paginationInput.entriesPerPage",  // The parameter name which specifies number of rows to return
            reader      : {
                type : 'json',
                rootProperty : 'findItemsAdvancedResponse[0].searchResult[0].item'
            }
        },
        totalProperty : 'findItemsAdvancedResponse[0].paginationOutput[0].totalEntries[0]'
    });

    var gantt = Ext.create("Sch.panel.SchedulerGrid", {
        readOnly : true,
        border   : false,

        height    : ExampleDefaults.height,
        autoWidth : true,

        rowHeight : 50,

        viewPreset : 'dayAndWeek',

        startDate : Sch.util.Date.add(start, Sch.util.Date.DAY, -7),
        endDate   : Sch.util.Date.add(start, Sch.util.Date.DAY, 14),

        columnLines : false,
        columns     : [
            { hidden : true }
        ],

        viewConfig : {
            emptyText : 'No auctions found'
        },

        eventBodyTemplate : new Ext.Template(
            '<img src="{GalleryUrl}" class="thumb"/>',
            '<div class="title"><a href="{ViewItemUrl}" target="_blank" title="Click to view item in a new window">{Title}</a></div>',
            '<div class="price">{Price} {Currency} USD</div>',
            '<div class="location">{Location}</div>'
        ),

        resourceStore : auctionStore,
        eventStore    : itemStore
    });

    var mainPanel = Ext.create('Ext.Panel', {
        border : true,

        renderTo : 'example-container',

        tbar : [
            new Ext.form.TwinTriggerField({
                id    : 'searchField',
                value : 'car porsche',

                handler     : itemStore.load,
                scope       : itemStore,
                hideTrigger : true,
                allowEmpty  : false,

                onTrigger2Click : function () {
                    if (this.getValue()) {
                        itemStore.load({
                            params : {
                                "paginationInput.pageNumber"     : 1,
                                "paginationInput.entriesPerPage" : 20
                            }
                        });
                    } else {
                        alert('You must enter a text');
                    }
                },
                listeners       : {
                    'specialkey' : function (f, e) {
                        if (e.getKey() == e.ENTER) {
                            this.onTrigger2Click();
                        }
                    }
                }
            })
        ],

        items : gantt
    });

    itemStore.on({
        'beforeload' : function (store, options) {
            options.setParams({
                "paginationInput.pageNumber"     : 1,
                keywords : Ext.getCmp('searchField').getValue()
            });
        },
        'load'       : function () {
            var rs = [];
            Ext.each(this.proxy.reader.rawData.findItemsAdvancedResponse[0].searchResult[0].item, function (o) {
                rs.push({ Id : o.itemId });
            });
            auctionStore.loadData(rs);
        }
    });

    itemStore.load({
    });
});
