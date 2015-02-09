Ext.ns('App');
Ext.Loader.setConfig({ enabled : true, disableCaching : true });
Ext.Loader.setPath('Sch', '../../js/Sch');

// get requested locale from URL hash
var localeClass = 'En',
    locale = window.location.hash.substr(1) || 'en';

switch (locale) {
    case 'ru' :
        localeClass = 'RuRU';
        break;

    case 'de' :
        localeClass = 'De';
        break;

    case 'pl' :
        localeClass = 'Pl';
        break;

    case 'sv_SE' :
        localeClass = 'SvSE';
        break;

    case 'it' :
        localeClass = 'It';
        break;

    case 'nl' :
        localeClass = 'Nl';
        break;
}

Ext.require([
    'Sch.panel.SchedulerGrid',
    'Sch.locale.' + localeClass
]);

// now that we know requested locale we need to load the corresponding Ext JS localization file
Ext.Loader.loadScript({
    url     : 'http://cdn.sencha.com/ext/gpl/4.2.1/locale/ext-lang-' + locale + '.js',
    onLoad  : function () {
        Ext.onReady(App.Scheduler.init, App.Scheduler);
    }
});

App.Scheduler = {

    // Bootstrap function
    init : function () {
        var combo = new Ext.form.ComboBox({
            width         : 122,
            margin        : '0 0 5 0',
            renderTo      : 'example-container',
            store         : new Ext.data.ArrayStore({
                fields : ['code', 'language'],
                data   : [
                    ['sv_SE', 'Swedish'],
                    ['en', 'English'],
                    ['de', 'German'],
                    ['it', 'Italian'],
                    ['ru', 'Russian'],
                    ['pl', 'Polish'],
                    ['nl', 'Dutch']
                ]
            }),
            displayField  : 'language',
            valueField    : 'code',
            mode          : 'local',
            triggerAction : 'all',
            emptyText     : 'Select a language...',
            selectOnFocus : true,
            value         : locale || '',
            listeners     : {
                select : function (f, record) {
                    window.location.hash = '#' + record[0].get('code');
                    window.location.reload(true);
                }
            }
        });

        this.grid = this.createGrid();

        this.grid.render('example-container');
    },

    createGrid : function () {
        Ext.define('Resource', {
            extend : 'Sch.model.Resource',
            fields : ['Type']
        });

        // Store holding all the resources
        var resourceStore = Ext.create("Sch.data.ResourceStore", {
            model : 'Resource',
            data  : [
                { Id : 'a', Name : 'Rob', Type : 'Sales' },
                { Id : 'b', Name : 'Mike', Type : 'Sales' },
                { Id : 'c', Name : 'Kate', Type : 'Management' },
                { Id : 'd', Name : 'Lisa', Type : 'Developer' },
                { Id : 'e', Name : 'Dave', Type : 'Developer' },
                { Id : 'f', Name : 'Arnold', Type : 'Developer' },
                { Id : 'g', Name : 'Lee', Type : 'Sales' },
                { Id : 'h', Name : 'Jong', Type : 'Management' }
            ]
        });

        Ext.define('Event', {
            extend : 'Sch.model.Event',
            fields : ['Type']
        });

        // Store holding all the events
        var eventStore = Ext.create("Sch.data.EventStore", {
            model : 'Event',
            data  : [   // Some inline dummy data
                {ResourceId : 'a', StartDate : "2010-02-03 08:00", EndDate : "2010-02-03 11:00", Name : 'Meeting'},
                {ResourceId : 'b', StartDate : "2010-02-03 09:00", EndDate : "2010-02-03 10:00", Name : 'Important task', Type : 'Important'},
                {ResourceId : 'c', StartDate : "2010-02-03 07:00", EndDate : "2010-02-03 11:00", Name : 'Business trip'},
                {ResourceId : 'd', StartDate : "2010-02-03 12:00", EndDate : "2010-02-03 14:00", Name : 'Shanghai Expo'},
                {ResourceId : 'e', StartDate : "2010-02-03 13:00", EndDate : "2010-02-03 16:00", Name : 'Meeting', Type : 'Important'},
                {ResourceId : 'f', StartDate : "2010-02-03 13:00", EndDate : "2010-02-03 16:00", Name : 'Customer gathering'}
            ]
        });

        var g = Ext.create("Sch.panel.SchedulerGrid", {
            height     : ExampleDefaults.height,
            width      : ExampleDefaults.width,
            rowHeight  : 40,

            startDate  : new Date(2010, 1, 3, 7),
            endDate    : new Date(2010, 1, 3, 17),
            viewPreset : 'hourAndDay',

            eventRenderer : function (ev, res, tplData) {
                tplData.cls = ev.get('Type') || 'Task';
                return ev.getName();
            },

            // Setup your static columns
            columns       : [
                {
                    header    : 'Name',
                    width     : 120,
                    dataIndex : 'Name',
                    renderer  : function (v, m, r) {
                        m.tdCls = r.get('Type');
                        return Ext.String.format('<dl><dt class="employeeName">{0}</dt><dd class="employeeType">{1}</dd></dl>', v, r.get('Type'));
                    }
                }
            ],

            resourceStore : resourceStore,
            eventStore    : eventStore
        });

        return g;
    }
};



