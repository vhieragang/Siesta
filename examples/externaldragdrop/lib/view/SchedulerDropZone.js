Ext.define("MyApp.view.SchedulerDropZone", {
    extend : "Ext.dd.DropZone",

    constructor : function() {
        this.callParent(arguments);
        var schedulerView = this.schedulerView;

        this.proxyTpl = this.proxyTpl || new Ext.XTemplate(
            '<span class="sch-dd-newtime">' +
                '{[ this.getText(values) ]}' +
            '</span>',
            {
                getText : function(vals) {
                    var retVal = schedulerView.getFormattedDate(vals.StartDate);

                    if (vals.Duration) {
                        retVal += ' - ' + schedulerView.getFormattedEndDate(Sch.util.Date.add(vals.StartDate, Sch.util.Date.MILLI, vals.Duration), vals.StartDate);
                    }
                    return retVal;
                }
            }
        );
    },

    validatorFn : Ext.emptyFn,

    getTargetFromEvent: function(e) {
        return e.getTarget('.' + this.schedulerView.timeCellCls);
    },

    onNodeOver : function(target, dragSource, e, data){
        var s = this.schedulerView,
            date = s.getDateFromDomEvent(e, 'round'),
            newText;

        if (!date) return this.dropNotAllowed;

        this.proxyTpl.overwrite(dragSource.proxy.el.down('.sch-dd-proxy-hd'), {
            StartDate : date,
            Duration : data.duration
        });

        var targetRecord = s.resolveResource(e.getTarget('.' + s.timeCellCls));

        if (this.validatorFn.call(this.validatorFnScope || this, data.records, targetRecord, date, data.duration, e) !== false) {
            return this.dropAllowed + ((this.enableCopy && e.ctrlKey) ? ' add' : '');
        } else {
            return this.dropNotAllowed;
        }
    },

    onNodeDrop : function(target, dragSource, e, data){
        var s = this.schedulerView,
            targetRecord = s.resolveResource(target),
            date = s.getDateFromDomEvent(e, 'round'),
            valid = false,
            isCopy = this.enableCopy && e.ctrlKey;

        if (date && this.validatorFn.call(this.validatorFnScope || this, data.records, targetRecord, date, data.duration, e) !== false) {
            var copies,
                index = s.resourceStore.indexOf(targetRecord);

            if (isCopy) {
                copies = this.copyRecords(data.records, date, targetRecord, data.sourceEventRecord, index);
                valid = true;
            } else {
                valid = this.updateRecords(data.records, date, targetRecord, data.sourceEventRecord, index, data);
            }

            // Clear selections after succesful drag drop
            if (valid) {
                s.getSelectionModel().deselectAll();
            }
            s.fireEvent('eventdrop', s, isCopy ? copies : data.records, isCopy);
        }

        s.fireEvent('aftereventdrop', s);
        return valid;
    },

    /**
     *  Update the event record with the new information
     */
    updateRecords : function(records, newStartDate, dropResourceRecord, sourceEventRecord, targetIndex, data) {
        // Simplified scenario, 1 drag drop item
        if (records.length === 1) {
            sourceEventRecord.beginEdit();
            sourceEventRecord.assign(dropResourceRecord);
            sourceEventRecord.setStartDate(newStartDate);
            sourceEventRecord.setEndDate(Sch.util.Date.add(newStartDate, Sch.util.Date.MILLI, data.duration));
            sourceEventRecord.endEdit();
            return true;
        }

        var sourceEventRecordStart = sourceEventRecord.getStartDate(),
            resourceStore = this.schedulerView.resourceStore,
            diffStart = newStartDate - sourceEventRecordStart,
            sourceIndex = resourceStore.indexOf(sourceEventRecord.getResource()),
            diff,
            oldIndex,
            newResourceRecord,
            r,
            newIndex,
            nbrRecords = resourceStore.getCount(),
            i;

        // Validate, make sure all items fit within the current view
        for (i = 0; i < records.length; i++) {
            r = records[i];
            oldIndex = resourceStore.indexOf(r.getResource());
            newIndex = oldIndex - sourceIndex + targetIndex;
            if (newIndex < 0 || newIndex > nbrRecords) {
                return false;
            }
        }

        for (i = 0; i < records.length; i++) {
            r = records[i];
            oldIndex = resourceStore.indexOf(r.getResource());
            diff = oldIndex - sourceIndex;
            newResourceRecord = resourceStore.getAt(targetIndex + diff);
            r.beginEdit();
            r.assign(newResourceRecord);
            r.setStartDate(Sch.util.Date.add(r.getStartDate(), Sch.util.Date.MILLI, diffStart));
            r.setEndDate(Sch.util.Date.add(r.getEndDate(), Sch.util.Date.MILLI, diffStart));
            r.endEdit();
        }

        return true;
    },

    // Update the event record with the new information
    copyRecords : function(records, newStartDate, targetRecord, sourceEventRecord, targetIndex) {
        var record = records[0],
            newItem = record.copy(),
            duration = sourceEventRecord.getEndDate() - sourceEventRecord.getStartDate();

        newItem.assign(targetRecord);
        newItem.setStartDate(newStartDate);
        newItem.setEndDate(Sch.util.Date.add(newStartDate, Sch.util.Date.MILLI, duration));

        return [newItem];
    }
});

