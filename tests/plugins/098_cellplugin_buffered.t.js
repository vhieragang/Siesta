StartTest(function (t) {
    var plugin, scheduler;
    
    var debug = false;
    
    var createFakeData = function (count) {
        var firstNames   = ['Ed', 'Tommy', 'Aaron', 'Abe', 'Jamie', 'Adam', 'Dave', 'David', 'Jay', 'Nicolas', 'Nige'],
            lastNames    = ['Spencer', 'Maintz', 'Conran', 'Elias', 'Avins', 'Mishcon', 'Kaneda', 'Davis', 'Robinson', 'Ferrero', 'White'];

        var resourceData = [], i;
        for (i = 0; i < (count || 25); i++) {
            var firstNameId = Math.floor(Math.random() * firstNames.length),
                lastNameId  = Math.floor(Math.random() * lastNames.length),

                name        = Ext.String.format("{0} {1}", firstNames[firstNameId], lastNames[lastNameId]);

            resourceData.push({
                Id          : i,
                Name        : name
            });
        }
        
        var eventData       = [];

        for (i = 0; i < (count || 25); i++) {
            eventData.push({
                Id          : 'Event' + i,
                Name        : 'Event' + i + '-1',
                ResourceId  : i,
                StartDate   : "2011-01-26",
                EndDate     : "2011-01-27"
            });
            
            if (i % 2) eventData.push({
                Id          : 'Event' + i + '-2',
                Name        : 'Event' + i + '-2',
                ResourceId  : i,
                StartDate   : "2011-01-26",
                EndDate     : "2011-01-28"
            });
            
        }
        
        return {
            resourceData    : resourceData,
            eventData       : eventData
        };
    };
    
    var setup = function (config) {
        scheduler && scheduler.destroy();
        config  = config || {};
        
        plugin = new Sch.plugin.CellPlugin(config.plugin || {});
        
        var data = createFakeData(500);
        
        scheduler = t.getScheduler(Ext.apply({
            width       : 1000,
            height      : 500,
            startDate   : new Date(2011, 0, 24),
            viewPreset  : 'weekAndDay',
            renderTo    : Ext.getBody(),
            plugins     : [
                plugin,
                'bufferedrenderer'
            ],
            resourceStore   : t.getResourceStore({
                data    : data.resourceData
            }),
            eventStore      : t.getEventStore({
                data    : data.eventData
            })
        }, config.scheduler || {}));
    };
    
    var checkPlugin = function (t) {
        var view        = scheduler.getSchedulingView();
        var resource    = scheduler.resourceStore.getAt(plugin.resourceIndex);
        var node        = Ext.get(view.getNodeByRecord(resource));
        var el          = plugin.containerEl;
        var result      = true;
        var tickWidth   = scheduler.timeAxisViewModel.getTickWidth();
        
        if (debug === true) {
            if (Math.abs(el.getWidth() - tickWidth) > 1) {
                result = false;
                t.fail('Width is correct', {
                    assertionName   : 'checkPlugin',
                    got             : el.getWidth(),
                    need            : tickWidth,
                    gotDesc         : "Plugin width",
                    needDesc        : "Column width"
                });
            }
            
            if (Math.abs(el.getHeight() - node.getHeight()) > 1) {
                result = false;
                t.fail('Height is correct', {
                    assertionName   : 'checkPlugin',
                    got             : el.getHeight(),
                    need            : node.getHeight(),
                    gotDesc         : "Plugin height",
                    needDesc        : "Row height"
                });
            }
            
            if (el.getX() !== (node.getX() + plugin.tickIndex * tickWidth)) {
                result = false;
                t.fail('X position is correct', {
                    assertionName   : 'checkPlugin',
                    got             : el.getX(),
                    need            : node.getX() + plugin.tickIndex * tickWidth,
                    gotDesc         : "Plugin x",
                    needDesc        : "Cell x"
                });
            }
            
            if (Math.abs(el.getY() - node.getY()) > 1) {
                result = false;
                t.fail('Y position is correct', {
                    assertionName   : 'checkPlugin',
                    got             : el.getY(),
                    need            : node.getY(),
                    gotDesc         : "Plugin y",
                    needDesc        : "Cell y"
                });
            }
            
            if (!el.isVisible()) {
                result = false;
                t.fail('Plugin is visible');
            }
        } else {
        
            result = result && Math.abs(el.getWidth() - tickWidth) < 2;
            result = result && Math.abs(el.getHeight() - node.getHeight()) < 2;
            result = result && el.getX() === (node.getX() + plugin.tickIndex * tickWidth);
            result = result && Math.abs(el.getY() - node.getY()) < 2;
            result = result && el.isVisible();
        }
        
        t.ok(result, 'Cell plugin rendered correctly');
    };
    
    t.it('Highlighter should be restored after scrolling down/back up', function (t) {
        setup({
            plugin  : {
                singleClickEditing  : false
            }
        });
        
        var view = scheduler.getSchedulingView();
        
        t.chain(
            { click : function () { return view.getNodeByRecord(scheduler.resourceStore.getById(3)); }, offset : [20, 20] },
            function (next) {
                checkPlugin(t);
                t.scrollVerticallyTo(view.el, 1500, next);
            },
            function (next) {
                t.ok(!plugin.containerEl.isVisible(), 'Plugin is hidden');
                t.scrollVerticallyTo(view.el, 0, function () { t.waitFor(100, next); });
            },
            function (next) {
                checkPlugin(t);
                next();
            }
        );
    });
    
    t.it('Highlighter should work after buffered range changed', function (t) {
        setup();
        
        var view = scheduler.getSchedulingView();
        
        t.chain(
            { waitForRowsVisible : scheduler },
            { click : function () { return view.getNodeByRecord(scheduler.resourceStore.getById(3)); }, offset : [20, 20] },
            function (next) {
                t.scrollVerticallyTo(view.el, 1500, next);
            },
            { click : function () { return view.getNodeByRecord(scheduler.resourceStore.getById(39)); }, offset : [20, 20] },
            function (next) {
                checkPlugin(t);
                plugin.moveLeft();
                checkPlugin(t);
                plugin.moveDown();
                checkPlugin(t);
                plugin.moveRight();
                checkPlugin(t);
                plugin.moveUp();
                checkPlugin(t);
            }
        );
    });
});