StartTest(function (t) {

    Ext.define('Sch.model.TempResource', {
        extend  : 'Sch.model.Resource',
        fields  : ['Description']
    });

    var scheduler = t.getScheduler({
        features : [
            {
                ftype             : 'grouping',
                groupHeaderTpl    : '{name}',
                hideGroupedHeader : false,
                startCollapsed    : true
            }
        ],

        columns : [
            { text: 'Name', dataIndex : 'Name' },
            { text: 'Description', dataIndex : 'Description' }
        ],

        resourceStore : t.getResourceStore({
            groupField : 'Name',
            model : 'Sch.model.TempResource'
        }),
        renderTo      : Ext.getBody()
    });

    var GP = Ext.grid.feature.Grouping.prototype;
    var collCls = '.x-grid-group-hd-collapsed';
    var nbrGroups = scheduler.getResourceStore().getCount();

    t.chain(
        { waitForRowsVisible : scheduler },

        // Testing clicking on locked view section
        function (next) {
            t.is(scheduler.lockedGrid.el.select(collCls).getCount(), nbrGroups, 'Locked collapsed groups found');
            t.is(scheduler.normalGrid.el.select(collCls).getCount(), nbrGroups, 'Schedule collapsed groups found');

            next();
        },
        { action : 'click', target : '.x-grid-locked ' + GP.eventSelector },

        function (next) {

            t.is(scheduler.lockedGrid.el.select(collCls).getCount(), nbrGroups - 1, '-1 Locked collapsed groups found');
            t.is(scheduler.normalGrid.el.select(collCls).getCount(), nbrGroups - 1, '-1 Schedule collapsed groups found');

            t.rowHeightsAreInSync(scheduler, 'After collapsed group is expanded');
            scheduler.resourceStore.first().set('Description', 'asf'); // Triggers a row update
            t.rowHeightsAreInSync(scheduler, 'After collapsed group is expanded');

            next();
        },

        { action : 'click', target : '.sch-schedulerview ' + GP.eventSelector },

        // Testing clicking on normal view section
        function (next) {
            t.is(scheduler.lockedGrid.el.select(collCls).getCount(), nbrGroups, 'Locked collapsed groups found');
            t.is(scheduler.normalGrid.el.select(collCls).getCount(), nbrGroups, 'Schedule collapsed groups found');

            next();
        },

        { action : 'click', target : '.sch-schedulerview ' + GP.eventSelector },

        function (next) {
            t.is(scheduler.lockedGrid.el.select(collCls).getCount(), nbrGroups - 1, '-1 Locked collapsed groups found');
            t.is(scheduler.normalGrid.el.select(collCls).getCount(), nbrGroups - 1, '-1 Schedule collapsed groups found');

            next();
        }
    );
});

