StartTest(function (t) {
    t.expectGlobal('View', 'Horizontal', 'Vertical');
    Ext.define('Horizontal', {});
    Ext.define('Vertical', {});

    Ext.define('View', {
        eventCls : 'foo',

        addCls                   : function () {
        },
        removeCls                : function () {
        },
        refresh                  : function () {
        },
        onUpdate                 : function () {
        },
        repaintEventsForResource : function () {
        },
        getId                    : function () {
            return 'foo';
        },
        eventBarTextField        : 'Name',

        horizontalLayoutCls : 'Horizontal',
        verticalLayoutCls   : 'Vertical',

        mixins : [
            'Sch.mixin.AbstractTimelineView',
            'Sch.mixin.AbstractSchedulerView'
        ]
    });

    var view = new View();
    var eventStore = t.getEventStore();

    // ---------------------------------
    // SETUP, initialization

    view.timeAxis = t.getTimeAxis('dayAndWeek');
    view.timeAxisViewModel = new Sch.view.model.TimeAxis({
        timeAxis : view.timeAxis
    });
    view.resourceStore = t.getResourceStore();
    view.bindEventStore(eventStore);
    view._initializeTimelineView();
    view._initializeSchedulerView();

    // EOF SETUP
    // ---------------------------------

    t.is(view.eventCls, 'foo', 'Should be able to specify eventCls');
    t.is(view.eventSelector, '.foo', 'Should find generated eventSelector');

    var event = eventStore.first();
    var resource = event.getResource();

    event.setName('Gobble');
    t.is(view.generateTplData(event, resource, 0).body, 'Gobble', 'Should find name if supplied in data');

    eventStore.first().setName(null);
    t.is(view.generateTplData(event, resource, 0).body, '', 'Should find empty name if name is null');

    t.like(view.generateTplData(event, resource, 0).internalCls, 'sch-dirty', 'Should find sch-dirty on a modified event');

    t.it('Should be possible to override the event layout classes', function (t) {

        t.isInstanceOf(view.eventLayout.horizontal, 'Horizontal');
        t.isInstanceOf(view.eventLayout.vertical, 'Vertical');

    })
})

