StartTest(function (t) {

    var getByKey = function (array, name) {
        return Ext.Array.findBy(array, function (f) {
            return f.name == name;
        });
    };

    var containsKey = function (array, name) {
        return !!Ext.Array.findBy(array, function (f) {
            return f.name == name;
        });
    };

    t.ok(Sch.model.Customizable, 'Sch.model.Customizable is here')

    t.expectGlobals('BaseModel', 'SubModel', 'SubSubModel', 'SubWithIdField');

    Ext.define('BaseModel', {
        extend             : 'Sch.model.Customizable',
        idProperty         : 'Usual',
        customizableFields : [
            {
                name    : 'Field1',
                persist : true
            },
            {
                name    : 'Field2',
                persist : true
            },
            {
                name    : 'FieldFoo',
                persist : true
            }
        ],

        fields : [
            'Usual'
        ]
    });

    t.it('Model.set should return array of modified fields', function (t) {
        var instance = new BaseModel();

        t.isDeeply(instance.set('Field1', instance.get('Field1')), [], 'Empty Array returned');
        t.isDeeply(instance.set('Field1', 'foo'), ['Field1'], 'Array returned');
    });


    Ext.define('SubModel', {
        extend : 'BaseModel',

        field1Field : 'subField1',
        field2Field : 'subField2',

        fields : [
            {
                name    : 'subField1',
                persist : false
            }
        ],

        customizableFields : [
            {
                name : 'Field3',
                type : 'int',
                defaultValue : 53
            },
            {
                name    : 'FieldFoo',
                persist : false
            }
        ],

        getField2 : function () {
            return "yo2"
        }
    });


    Ext.define('SubSubModel', {
        extend : 'SubModel',

        field1Field : 'subsubField1',
        field3Field : 'subsubField3',

        getField3 : function () {
            return "yo3"
        }
    });
    //=========================================================================

    t.it('Testing the base model (the one with customizableFields property)', function (t) {

        var baseModelFields = BaseModel.prototype.fields

        var Field1 = getByKey(baseModelFields, 'Field1')

        //http://www.sencha.com/forum/showthread.php?283847-Model-fields-not-behaving-sanely&p=1038286#post1038286
        //http://www.sencha.com/forum/showthread.php?286577-Model-id-field-leaks-into-subclasses&p=1047852#post1047852
        t.is(baseModelFields.length, 4, '4 baseModel fields')

        t.ok(Field1 && Field1.persist, '`Field1` was created')

        t.ok(containsKey(baseModelFields, 'Field1'), '`Field1` was created')
        t.ok(containsKey(baseModelFields, 'Field2'), '`Field2` was created')
        t.ok(containsKey(baseModelFields, 'FieldFoo'), '`FieldFoo` was created')
        t.ok(containsKey(baseModelFields, 'Usual'), '`Usual` field was also created')

        var baseModel = new BaseModel({
            Field1 : 'Field1',
            Field2 : 'Field2',
            Usual  : 'Usual'
        })

        t.is(baseModel.getField1(), 'Field1', 'Getter for customizable field `Field1` uses the correct name')
        t.is(baseModel.getField2(), 'Field2', 'Getter for customizable field `Field2` uses the correct name')

        t.notok(baseModel.getUsual, "There's no getter for usual field")
    })

    t.it('Testing the sub model (the one inheriting from base model, and w/o customizableFields)', function (t) {


        var subModelFields = SubModel.prototype.fields

        t.is(subModelFields.length, 5, '5 subModelFields + Ext JS "id" ')

        t.ok(containsKey(subModelFields, 'subField1'), 'Customizable field `Field1` was inherited as `subField1`')
        t.ok(containsKey(subModelFields, 'subField2'), 'Customizable field `Field2` was inherited as `subField2`')
        t.ok(containsKey(subModelFields, 'Field3'), 'Customizable field `field3` was created')
        t.ok(containsKey(subModelFields, 'Usual'), '`Usual` field was inherited`')

        t.ok(containsKey(subModelFields, 'FieldFoo'), '`FieldFoo` was created')
        t.notok(getByKey(subModelFields, 'FieldFoo').persist, "FieldFoo was re-defined")

        t.notok(containsKey(subModelFields, 'Field1'), "The customizable field `Field1` was not created since its overriden")
        t.notok(containsKey(subModelFields, 'Field2'), "The customizable field `Field2` was not created since its overriden")

        var subModel = new SubModel({
            subField1 : 'subField1',
            subField2 : 'subField2',
            Usual     : 'Usual'
        })

        t.is(subModel.getField1(), 'subField1', 'Getter for customizable field `Field1` uses the default name')
        t.is(subModel.getField2(), 'yo2', 'Custom getter for customizable field `Field2` was not overwritten')
        t.is(subModel.get('subField2'), 'subField2', 'Default getter returns correct data')

        t.notok(subModel.getUsual, "There's no getter for usual field")
        t.notok(subModel.getSubField1, "There's no getter named after overriden field")
    })


    t.it('Testing the sub sub model', function (t) {

        var subsubModelFields = SubSubModel.prototype.fields

        t.is(subsubModelFields.length, 5, '5 subsubModelFields')

        t.ok(containsKey(subsubModelFields, 'subsubField1'), 'Customizable field `Field1` was overriden to `subsubField1`')
        t.ok(containsKey(subsubModelFields, 'subField2'), 'Customizable field `Field2` was inherited as `subField2`')
        t.ok(containsKey(subsubModelFields, 'subsubField3'), 'Customizable field `Field3` was inherited as `subsubField3`')
        t.ok(containsKey(subsubModelFields, 'Usual'), '`Usual` field was inherited`')
        t.ok(containsKey(subsubModelFields, 'FieldFoo'), '`FieldFoo` field was inherited`')

        t.notok(containsKey(subsubModelFields, 'subField1'), "The customizable field `subField1` was not created since its overriden")
        t.notok(containsKey(subsubModelFields, 'Field1'), "The customizable field `Field1` was not created since its overriden")
        t.notok(containsKey(subsubModelFields, 'Field2'), "The customizable field `Field2` was not created since its overriden")
        t.notok(containsKey(subsubModelFields, 'Field3'), "The customizable field `Field3` was not created since its overriden")

        t.is(getByKey(subsubModelFields, 'subsubField3').defaultValue, 53, '`Field3` was re-defined in SubModel')
        t.is(getByKey(subsubModelFields, 'subsubField1').persist, false, '`Field1` was re-defined in SubModel and SubSubModel inherited the re-defiend field')

        var subsubModel = new SubSubModel({
            subsubField1 : 'subsubField1',
            subField2    : 'subField2',
            subsubField3 : 123,
            Usual        : 'Usual'
        })

        t.is(subsubModel.getField1(), 'subsubField1', 'Getter for customizable field `Field1` uses the default name')
        t.is(subsubModel.getField2(), 'yo2', 'Custom getter for customizable field `Field2` was not overwritten')
        t.is(subsubModel.getField3(), 'yo3', 'Custom getter for customizable field `Field3` was not overwritten')

        t.is(subsubModel.get('subField2'), 'subField2', 'Default getter returns correct data')
        t.is(subsubModel.get('subsubField3'), 123, 'Default getter returns correct data')

        t.notok(subsubModel.getUsual, "There's no getter for usual field")
        t.notok(subsubModel.getSubField1, "There's no getter named after overriden field")
        t.notok(subsubModel.getSubsubField3, "There's no getter named after overriden field")
    })

    // Crashes in Ext 5.1
    Ext.define('SubWithIdField', {
        extend     : 'Sch.model.Resource',
        idProperty : 'Id',
        fields     : [
            'Id'
        ]
    });
})
