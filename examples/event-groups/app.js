Sch.preset.Manager.registerPreset("customday", {
    timeColumnWidth   : 30,
    displayDateFormat : 'G:i',
    shiftIncrement    : 1,
    shiftUnit         : "DAY",
    timeResolution    : {
        unit      : "MINUTE",
        increment : 5
    },
    defaultSpan       : 24,
    headerConfig      : {
        bottom : {
            unit       : "MINUTE",
            increment  : 15,
            dateFormat : 'i'
        },
        middle : {
            unit       : "HOUR",
            increment  : 1,
            dateFormat : 'G:i'
        },
        top    : {
            unit       : "DAY",
            dateFormat : 'Y-m-d'
        }
    }
});

Ext.Loader.setConfig({
    disableCaching : true,
    enabled        : true
});

Ext.application({
    name : 'App',       // Our global namespace

    appFolder : 'lib',  // The folder for the JS files

    views : [
        'App.view.Scheduler'
    ],

    requires : [
        'App.store.DeliveryStepStore',
        'App.store.DeliveryStore',
        'App.store.DeliveryTaskStore'
    ],

    models             : [
        'DeliveryStep',
        'Delivery',
        'DeliveryTask'
    ],

    // We'll create our own 'main' UI
    autoCreateViewport : false,

    launch : function () {

        var taskStore = new App.store.DeliveryTaskStore();

        var deliveryStepStore = new App.store.DeliveryStepStore()

        var deliveryStore = new App.store.DeliveryStore({
            taskStore         : taskStore,
            deliveryStepStore : deliveryStepStore
        });

        deliveryStore.load();

        var scheduler = new App.view.Scheduler({
            width         : ExampleDefaults.width,
            height        : ExampleDefaults.height,
            deliveryStore : deliveryStore,
            resourceStore : deliveryStepStore,
            eventStore    : taskStore,

            renderTo  : 'example-container',
            startDate : new Date(2011, 0, 1, 10),
            endDate   : new Date(2011, 0, 1, 16)
        });
    }
});
