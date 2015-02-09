StartTest(function (t) {
    Ext.define('Sch._Resource', {
        extend : 'Sch.model.Resource',
        fields : [
            'Category',
            'Type'
        ]
    });

    var scheduler = t.getScheduler({
        forceFit : true,
        features : [
            {
                ftype          : 'grouping',
                groupHeaderTpl : '{name}'
            }
        ],

        resourceStore : t.getResourceStore({
            model      : 'Sch._Resource',
            groupField : 'Category',
            data       : [
                {Id : 'r1', Name : 'Mike Anderson', Category : 'Consultants', Type : 'Full time'},
                {Id : 'r2', Name : 'Kevin Larson', Category : 'Consultants', Type : 'Full time'},
                {Id : 'r3', Name : 'Brett Hornbach', Category : 'Consultants', Type : 'Full time'},
                {Id : 'r4', Name : 'Lars Holt', Category : 'Consultants', Type : 'Full time'},
                {Id : 'r5', Name : 'Fred Arnold', Category : 'Consultants', Type : 'Full time'},
                {Id : 'r10', Name : 'Matt Demon', Category : 'Sales', Type : 'Full time'},
                {Id : 'r11', Name : 'Karl Lager', Category : 'Testers', Type : 'Full time'},
                {Id : 'r12', Name : 'Pete Wilson', Category : 'Testers', Type : 'Full time'},
                {Id : 'r13', Name : 'Derek Ronburg', Category : 'Testers', Type : 'Full time'}
            ]
        }),
        renderTo      : Ext.getBody(),
        eventStore    : t.getEventStore({ data : null })
    });


    t.chain(
        { waitFor : 'rowsVisible' },

        { action : 'click', target : '.x-grid-group-hd' },

        { drag : '.sch-timetd', by : [30, 0] },

        function () {
            t.is(scheduler.eventStore.getCount(), 1, 'should find created record');
        }
    );
});

