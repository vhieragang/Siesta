StartTest(function(t) {

    window.top.Function.prototype.bind = Function.prototype.bind;
    Ext.Loader.setPath('Sch', '../js/Sch');

    // This test grab 1st level phrases from each locale class and tries to find its
    // usage in sch-all-debug.js. Purpose is to detect unused locales.

    var ignoreList = {
        'Sch.panel.TimelineGridPanel'   : ['loadingText', 'savingText'],
        'Sch.panel.TimelineTreePanel'   : ['loadingText', 'savingText'],
        'Sch.preset.Manager'            : /.+/
    };

    var getFile     = function (url, callback) {
        var as  = t.beginAsync();

        Ext.Ajax.request({
            url         : url,
            callback    : function(options, success, response) {
                t.endAsync(as);

                if (!success) t.fail('File [' + url + '] failed to load');

                success && callback && callback(response.responseText);
            }
        });
    };

    var localePhraseFoundInClass = function (phrase, classData, className) {
        var len     = classData.array.length,
            entry   = classData.byName[ className ],
            index   = entry.index,
            pos     = searchLocale(gntAllDebugText, phrase, entry.pos);

        // fail - if it's not found or found in another class
        return pos >= entry.pos && ((index < len - 1 && pos < classData.array[ index + 1 ].pos) || index == len - 1);
    };

    var localePhraseFoundInClassOrItsParents = function (phrase, classData, className, localeClass) {

        for (
            var classCons = Ext.ClassManager.get(className);
            classCons && classCons.$className in localeClass.l10n;
            classCons = classCons.superclass
        ) {
            if (localePhraseFoundInClass(phrase, classData, classCons.$className)) return true;
        }

        for (var i = 0; classData.subClassesByName[ className ] && i < classData.subClassesByName[ className ].length; i++) {
            if (localePhraseFoundInClass(phrase, classData, classData.subClassesByName[ className ][ i ])) return true;
        }

        return false;
    };

    var searchLocale = function (text, phrase, pos) {
        // we are looking for .L("phrase") call
        var str = '\\.L\\(\\s*["\']' + Ext.String.escapeRegex(phrase) + '["\']';

        var reg     = new RegExp(str, 'g'),
            match   = reg.exec(text),
            index   = match ? match.index : -1;
        while (index < pos && match) {
            match   = reg.exec(text);
            index   = match ? match.index : -1;
        }
        return index;
    };

    var testLocale = function (t, localeClass) {
        var classData           = {
            array               : [],
            byName              : {},
            subClassesByName    : {}
        };

        // loop over classes supported by locale
        for (var className in localeClass.l10n) {
            // get class definition start position
            var pos = gntAllDebugText.search(new RegExp('\\nExt\\.define\\(\\s*[\'"]' + className.replace('.', '\\.') + '["\']\\s*,'));
            if (pos > -1) {
                // keep position
                var entry   = { name : className, pos : pos, index : null };

                classData.array.push(entry);
                classData.byName[ className ] = entry;

                var classCons       = Ext.ClassManager.get(className);
                var superClassName  = classCons.superclass && classCons.superclass.$className;

                // if superclass is listed in the locale
                if (superClassName && (superClassName in localeClass.l10n)) {
                    if (!classData.subClassesByName[ superClassName ]) classData.subClassesByName[ superClassName ] = [];

                    classData.subClassesByName[ superClassName ].push(className);
                }
            } else {
                t.fail(className + ' not found');
            }
        }

        var classEntries    = classData.array;

        // sort classes by their position
        classEntries.sort(function (a, b) { return a.pos - b.pos; });

        Ext.Array.forEach(classEntries, function (entry, index) { entry.index = index; });
        // loop over collected classes
        Ext.Array.forEach(classEntries, function (entry) {
            var className   = entry.name;
            var ignore      = ignoreList[entry.name];
                // loop over their localized phrases
            for (var phrase in localeClass.l10n[ className ]) {
                if (!localePhraseFoundInClassOrItsParents(phrase, classData, className, localeClass) && (!ignore || (ignore.indexOf && ignore.indexOf(phrase) < 0) || (ignore.test && !ignore.test(phrase)) ))
                    t.fail(className + ': ' + phrase + ' not found');
            }
        });
    };

    var gntAllDebugText;

    getFile('../sch-all-debug.js', function (text) {

        gntAllDebugText = text;

        t.requireOk(
            [
                'Sch.locale.En',
                'Sch.locale.De',
                'Sch.locale.RuRU',
                'Sch.locale.Pl',
                'Sch.locale.SvSE',
                'Sch.locale.It',
                'Sch.locale.Nl'
            ],
            function() {
                t.it('Sch.locale.En', function(t) {
                    testLocale(t, Sch.locale.En);
                });

                t.it('Sch.locale.De', function (t) {
                    testLocale(t, Sch.locale.De);
                });

                t.it('Sch.locale.RuRU', function (t) {
                    testLocale(t, Sch.locale.RuRU);
                });

                t.it('Sch.locale.Pl', function (t) {
                    testLocale(t, Sch.locale.Pl);
                });

                t.it('Sch.locale.SvSE', function (t) {
                    testLocale(t, Sch.locale.SvSE);
                });

                t.it('Sch.locale.It', function (t) {
                    testLocale(t, Sch.locale.It);
                });

                t.it('Sch.locale.Nl', function (t) {
                    testLocale(t, Sch.locale.Nl);
                });
            }
        );
    });
});
