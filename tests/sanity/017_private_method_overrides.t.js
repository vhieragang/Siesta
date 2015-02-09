StartTest(function (t) {
    t.expectGlobal('Docs'); // JsDuck

    // Ignore some symbols that should be ignore + some bugs in the Ext docs
    var ignoreRe = /Ext.dd|DragZone.destroy|DragDrop.destroy|DragSource.destroy|Ext.grid.plugin.Editing.init|afterRender|initComponent|Ext.Base.configClass|Ext.Base.destroy/;

    var isPrivate = function (fullName) {
        var priv = false;

        Ext.Array.each(Docs.data.search, function (property) {

            if (property.fullName === fullName) {
                priv = property.meta.private;
                return false;
            }
        });

        return priv;
    };


    function findInSuperClasses(sourceCls, property) {
        var cls = sourceCls.superclass.self;

        while (cls && cls.prototype) {
            var name = Ext.ClassManager.getName(cls);
            var fullName = name + '.' + property;

            if (name.match(/^Ext./) && !ignoreRe.test(fullName) &&
                cls.prototype.hasOwnProperty(property)) {
                if (isPrivate(fullName)) {
                    return name;
                } else {
                    return false;
                }
            }
            cls = cls.superclass && cls.superclass.self;
        }

        return false;
    }

    var MAX_NBR_OVERRIDES = 11;
    var nbrFound = 0;

    t.it('Known overrides:', function (t) {

        Ext.iterate(Ext.ClassManager.classes, function (className, constr) {
            if (!className.match('Sch.')) return;

            for (var o in constr.prototype) {

                // Check only own properties, and only functions for now
                if (constr.prototype.hasOwnProperty(o) && typeof constr.prototype[o] === 'function') {
                    var result = findInSuperClasses(constr, o);

                    if (result) {
                        t.pass('Class ' + className + ' overrides ' + result + ':' + o);
                        nbrFound++;
                    }
                }
            }
        });
    })

    t.isLessOrEqual(nbrFound, MAX_NBR_OVERRIDES, 'Thou Shall Not Introduce New Overrides Of Private Ext Methods');
})
