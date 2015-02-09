StartTest(function (t) {
    
    t.waitForSelector('.sch-timetd', function () {
        t.chain(
            { action : "drag", target : "schedulergrid => " + Ext.grid.View.prototype.itemSelector + ":nth-child(4) .sch-timetd .sch-event-inner", by : [-116, 26], offset : [45, 6] },
        
            { action : "drag", target : ">> messagebox[title=Please confirm] header", by : [-5, -46] },
            
            function (next) {
                var proxy   = Ext.get(Ext.query('.x-dd-drag-proxy.sch-dragproxy')[0]);
                var window  = Ext.WindowManager.getActive();
                
                t.isLess(proxy.el.getZIndex(), window.el.getZIndex(), 'Proxy is under the window');
                
                next();
            },
            
            { action : "click", target : ">> messagebox[title=Please confirm] button[text=No]" }
        );
    });
});