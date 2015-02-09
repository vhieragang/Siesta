StartTest(function(t) {

    window.top.Function.prototype.bind = Function.prototype.bind;
    // this test compares each locale class with english one to find not supported phrases or sub-classes
    Ext.Loader.setPath('Sch', '../js/Sch');

    // list specifying phrases equality of which to corresponding phrases from En locale should be ignored
    var ignoreRe = {
        RuRU    : /Sch.preset.Manager|Sch.plugin.exporter.AbstractExporter/,
        Pl      : /Sch.preset.Manager|Sch.util.Date.unitNames|Sch.plugin.exporter.AbstractExporter/,
        SvSE    : /Sch.preset.Manager|Sch.util.Date.unitNames|Sch.plugin.exporter.AbstractExporter/,
        De      : /Sch.preset.Manager|Sch.util.Date.unitNames|Sch.plugin.exporter.AbstractExporter/,
        It      : /Sch.preset.Manager|Sch.util.Date.unitNames\.(QUARTER\.abbrev|MINUTE\.abbrev|SECOND\.abbrev|MILLI\..+)|Sch.plugin.exporter.AbstractExporter/,
        Nl      : /Sch.preset.Manager|Sch.util.Date.unitNames\.(WEEK\.(single|abbrev)|DAY\.abbrev|SECOND\.abbrev|MILLI)|Sch.plugin.exporter.AbstractExporter/
    };
    var errors = 0;

    var checkObject = function (t, master, tested, path, ignoreRe) {
        for (var prop in master) {
            var p = path + (path ? '.' : '') + prop;

            if (prop in tested && typeof tested[prop] === typeof master[prop]) {
                if ('object' === typeof master[prop]) {
                    checkObject(t, master[prop], tested[prop], p, ignoreRe);

                // if phrase matches corresponding one from En locale and not mentioned in ignore list
                } else if (master[prop] === tested[prop] && (!ignoreRe || !p.match(ignoreRe))) {
                    t.fail(p + ' matches En locale');
                    errors++;
                }
            } else if (!ignoreRe || !p.match(ignoreRe)) {
                t.fail(p + ' is not supported');
                errors++;
            }
        }
    };

    function assertLocale(t, master, tested) {
        errors = 0;
        // get last fraction of class name to retreive corresponding list from ignoreRe
        var id = Ext.getClassName(Ext.getClass(tested)).split('.').pop();

        // compare the content of l10n
        checkObject(t, master.l10n, tested.l10n, '', ignoreRe[id]);
        t.is(errors, 0, 'Locale is completely translated');
    }

    t.requireOk(
        [
            'Sch.locale.En',
            'Sch.locale.RuRU',
            'Sch.locale.De',
            'Sch.locale.Pl',
            'Sch.locale.SvSE',
            'Sch.locale.It',
            'Sch.locale.Nl'
        ],
        function () {

            t.it('Sch.locale.RuRU', function(t) {
                assertLocale(t, Sch.locale.En, Sch.locale.RuRU);
            });

            t.it('Sch.locale.SvSE', function (t) {
                assertLocale(t, Sch.locale.En, Sch.locale.SvSE);
            });

            t.it('Sch.locale.De', function (t) {
                assertLocale(t, Sch.locale.En, Sch.locale.De);
            });

            t.it('Sch.locale.Pl', function (t) {
                assertLocale(t, Sch.locale.En, Sch.locale.Pl);
            });

            t.it('Sch.locale.It', function (t) {
                assertLocale(t, Sch.locale.En, Sch.locale.It);
            });

            t.it('Sch.locale.Nl', function (t) {
                assertLocale(t, Sch.locale.En, Sch.locale.Nl);
            });
        }
    );
});
