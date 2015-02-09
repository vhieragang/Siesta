StartTest(function (t) {

    if (window.console) {
        // Prevent test from failing due to model field duplication warning
        console.error = console.warn = Ext.emptyFn;
    }

    t.expectGlobals('MyResource', 'MyResource2', 'MyEvent');

    var EventFields = Sch.model.Event.prototype.fields;

    var containsKey = function (array, name) {
        return !!Ext.Array.findBy(array, function (f) {
            return f.name == name;
        });
    };

    t.ok(containsKey(EventFields, 'Id'), 'Sch.model.Event#Id')
    t.ok(containsKey(EventFields, 'StartDate'), 'Sch.model.Event#StartDate')
    t.ok(containsKey(EventFields, 'EndDate'), 'Sch.model.Event#EndDate')

    t.is(EventFields.length, 8, 'Sch.model.Event nbr fields')

    Ext.define('MyResource', {
        extend     : 'Sch.model.Resource',
        idProperty : 'MyId',
        nameField  : 'MyName',
        fields     : [
            // Should be ok for implementor to define their own fields with 'our' default names.
            'Name',


            'MyId',
            'MyName'
        ]
    });

    var MyResourceFields = MyResource.prototype.fields;

    t.is(MyResourceFields.length, 3, 'Should find only 3 model fields in Resource');

    t.notOk(containsKey(MyResourceFields, 'Id'), 'Id field not created');

    var resourceStore = Ext.create('Sch.data.ResourceStore', {
        model : 'MyResource',
        data  : [
            {MyId : 'c1', MyName : 'Foo'},
            {MyId : 'c2', MyName : 'Bar'}
        ]
    });

    Ext.define('MyEvent', {
        extend          : 'Sch.model.Event',
        nameField       : 'MyName',
        startDateField  : 'MyStartDate',
        endDateField    : 'MyEndDate',
        resourceIdField : 'MyResourceId',
        fields          : [
            // Should be ok for implementor to define their own fields with 'our' default names.
            {name : 'StartDate', type : 'bool'},
            {name : 'ResourceId', type : 'bool'},
            {name : 'EndDate', type : 'bool'},

            {name : 'MyStartDate', type : 'date', dateFormat : 'Y-m-d'},
            {name : 'MyEndDate', type : 'date', dateFormat : 'Y-m-d'},
            'MyName',
            'MyResourceId'
        ]
    });


    var eventStore = t.getEventStore({
        resourceStore : resourceStore,
        data          : [
            { MyResourceId : 'c1', MyName : 'Linda', MyStartDate : "2010-11-09", MyEndDate : "2010-12-09" },
            { MyResourceId : 'c2', MyName : 'Foo', MyStartDate : "2010-11-09", MyEndDate : "2010-12-09" }
        ],
        model         : 'MyEvent'
    });

    resourceStore.eventStore = eventStore;
    var event = eventStore.first();

    t.is(event.get('MyName'), 'Linda', "Read MyName ok");
    t.is(event.get('MyResourceId'), 'c1', "Read MyResourceId ok");
    t.is(event.get('MyStartDate'), new Date(2010, 10, 9), "Read MyStartDate ok");
    t.isDateEqual(event.getStartDate(), new Date(2010, 10, 9), "Read start date ok");
    t.isDateEqual(event.getEndDate(), new Date(2010, 11, 9), "Read end date ok");

    t.is(event.getResource(), resourceStore.first(), "getResource located the resource from an event");
    t.is(resourceStore.first().getEvents()[0], eventStore.first(), "getEvents located the correct event");

    t.ok(containsKey(EventFields, 'StartDate'), 'StartDate found in event Model fields');
    t.ok(containsKey(EventFields, 'EndDate'), 'EndDate found in event Model fields');
    t.ok(containsKey(EventFields, 'ResourceId'), 'ResourceId found in event Model fields');

    t.is(resourceStore.first().get('MyName'), 'Foo', 'Name found in resource Model fields');

    eventStore.on('update', function (s, model) {
        t.is(model.modified.MyResourceId, 'c1', 'After "set", The model "modified" object contained the original resource value');
        t.is(model.previous.MyResourceId, 'c1', 'After "set", The model "previous" object contained the previous resource value');
    }, null, { single : true });

    event.setResource('c2');

    eventStore.on('update', function (s, model) {
        t.is(model.previous.MyResourceId, 'c2', 'After "reject", The model "previous" object contained the previous resource value');
    }, null, { single : true });

    t.it('Should be ok to use id/Id fields as non-id fields', function(t) {
        Ext.define('MyResource2', {
            extend     : 'Sch.model.Resource',
            idProperty : 'Foo',

            fields     : [
                // Should be ok for implementor to define their own fields with 'our' default names.
                'id',
                'Id',
                'Foo'
            ]
        });

        t.is(MyResource2.getFields().length, 4, 'Should find only 4 model fields in MyResource2');
    })
})    
