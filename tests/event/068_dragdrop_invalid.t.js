StartTest(function (t) {

    var scheduler = t.getScheduler({
        enableDragCreation : false,
        renderTo           : Ext.getBody(),
        dragConfig         : {
            showTooltip : false
        }
    });


    t.it('Should not change a record after trying to drag it outside of the chart', function (t) {
        t.wontFire(scheduler.eventStore, 'update');

        t.chain(
            { waitFor : 'eventsToRender' },
            { drag : '.sch-event', to : [5, 5] }
        );
    });
})
