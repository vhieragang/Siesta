Ext.define('App.view.LineDragZone', {
    extend          : 'Ext.dd.DragZone',
    repairHighlight : false,
    containerScroll : true,
    dropAllowed     : "timeline-dragproxy",
    dropNotAllowed  : "timeline-dragproxy",

    // Provide coordinates for the proxy to slide back to on failed drag.
    getRepairXY     : function () {
        return this.dragData.repairXY;
    },

    constructor : function (el, config) {
        config.proxy = new Ext.dd.StatusProxy({
            shadow         : false,
            dropAllowed    : Ext.dd.StatusProxy.prototype.dropAllowed + " timeline-dragproxy",
            dropNotAllowed : Ext.dd.StatusProxy.prototype.dropNotAllowed + " timeline-dragproxy"
        });
        this.callParent(arguments);
        this.scroll = false;
        this.isTarget = true;
        this.ignoreSelf = false;
    },

    // Don't seem to need these
    onDragEnter : Ext.emptyFn,
    onDragOut   : Ext.emptyFn,


    autoOffset : function (x, y) {
        var xy = this.dragData.repairXY, // Original position of the element
            xDelta = x - xy[0],
            yDelta = y - xy[1];

        this.setDelta(xDelta, yDelta);
    },

    constrainTo : function (constrainingRegion, elRegion) {
        this.resetConstraints();
        this.initPageX = constrainingRegion.left;
        this.initPageY = constrainingRegion.top;
        this.setXConstraint(constrainingRegion.left, constrainingRegion.right - (elRegion.right - elRegion.left), this.xTickSize);
        this.setYConstraint(constrainingRegion.top, constrainingRegion.bottom - (elRegion.bottom - elRegion.top), this.yTickSize);
    },

    setXConstraint : function (iLeft, iRight, iTickSize) {
        this.leftConstraint = iLeft;
        this.rightConstraint = iRight;

        this.minX = iLeft;
        this.maxX = iRight;
        if (iTickSize) {
            this.setXTicks(this.initPageX, iTickSize);
        }

        this.constrainX = true;
    },

    setYConstraint : function (iUp, iDown, iTickSize) {
        this.topConstraint = iUp;
        this.bottomConstraint = iDown;

        this.minY = iUp;
        this.maxY = iDown;
        if (iTickSize) {
            this.setYTicks(this.initPageY, iTickSize);
        }

        this.constrainY = true;
    },

    onDragOver : function (e, id) {
        var dd = this.dragData;

        if (!dd.originalHidden) {
            Ext.fly(dd.sourceNode).hide();

            dd.originalHidden = true;

            // Also hide related event bars at this time
            Ext.each(dd.relatedEls, function (el) {
                el.hide();
            });
        }
    },

    onStartDrag : function () {
        var s = this.scheduler,
            dd = this.dragData;

        this.start = dd.origStart;
    },

    // On receipt of a mousedown event, see if it is within a draggable element.
    // Return a drag data object if so. The data object can contain arbitrary application
    // data, but it should also contain a DOM element in the ddel property to provide
    // a proxy to drag.
    getDragData : function (e) {
        var s = this.scheduler,
            t = e.getTarget('.sch-timeline');

        if (!t) {
            return;
        }

        var delivery = this.linePlugin.resolveDelivery(t);

        if (!delivery) {
            return;
        }

        var xy = e.getXY(),
            lineXY = Ext.fly(t).getXY(),
            offsets = [xy[0] - lineXY[0], xy[1] - lineXY[1]],
            region = Ext.fly(t).getRegion(),
            tickSize = this.view.getSnapPixelAmount();

        this.clearTicks();

        this.constrainTo(this.view.getScheduleRegion(), region);
        this.setYConstraint(region.top, region.top);

        if (tickSize >= 1) {
            this.setXConstraint(this.leftConstraint, this.rightConstraint, tickSize);
        }

        var copy = t.cloneNode(true),
            bodyScroll = Ext.getBody().getScroll();
        copy.id = Ext.id();

        var relatedEventRecords = delivery.getTasks();
        var relatedEls = this.getRelatedEls(delivery, relatedEventRecords);
        this.appendRelatedElements(relatedEls, delivery, copy, t);

        return {
            offsets             : offsets,
            sourceNode          : t,
            repairXY            : lineXY,
            ddel                : copy,
            delivery          : delivery,
            bodyScroll          : bodyScroll,
            start               : delivery.get('Date'),
            origStart           : delivery.get('Date'),
            relatedEls          : relatedEls
        };
    },

    getRelatedEls : function (delivery, relatedRecords) {
        var els = [],
            scheduler = this.scheduler;

        relatedRecords.each(function (r) {
            var el = this.view.getElementFromEventRecord(r);
            if (el) {
                els.push(el);
            }
        }, this);

        return els;
    },

    appendRelatedElements : function (elsToAppend, delivery, ctEl, originalLineEl) {
        Ext.each(elsToAppend, function (el) {
            copy = el.dom.cloneNode(true);
            copy.id = Ext.id();
            ctEl.appendChild(copy);

            var offsets = el.getOffsetsTo(originalLineEl);

            // Adjust each element offset to the containing line element
            Ext.fly(copy).setStyle({
                left : offsets[0] + 'px',
                top  : offsets[1] + 'px'
            });
        });
    },

    afterRepair : function () {
        var s = this.scheduler;
        Ext.fly(this.dragData.sourceNode).show();
        this.dragging = false;
        // Also show related event bars at this time
        Ext.each(this.dragData.relatedEls, function (el) {
            el.show();
        });
    },

    onDragDrop : function (e, id) {
        var proxyRegion = this.proxy.el.getRegion(),
            s = this.scheduler,
            target = this.cachedTarget || Ext.dd.DragDropMgr.getDDById(id),
            dragData = this.dragData,
            dropDate = this.view.getDateFromXY([proxyRegion.left, proxyRegion.top], 'round'),
            rec = dragData.delivery,
            viewStart = s.getStart(),
            viewEnd = s.getEnd(),
            valid = true,
            tasks = rec.getTasks(),
            diffMinutes = Sch.util.Date.getDurationInMinutes(dragData.origStart, dropDate);

        tasks.each(function (item) {
            if (Ext.Date.add(item.getStartDate(), Ext.Date.MINUTE, diffMinutes) < viewStart ||
                Ext.Date.add(item.getEndDate(), Ext.Date.MINUTE, diffMinutes) > viewEnd) {
                valid = false;
            }
        });

        if (valid) {
            rec.set('Date', dropDate);
        }

        if (this.dropCallback) {
            this.dropCallback.call(this.dropCallbackScope || this, rec, tasks, diffMinutes);
        }

        if (valid) {
            this.onValidDrop(target, e, id);
        } else {
            this.onInvalidDrop(target, e, id);
        }
    }
});

