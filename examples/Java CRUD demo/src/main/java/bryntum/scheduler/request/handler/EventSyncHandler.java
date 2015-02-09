package bryntum.scheduler.request.handler;

import java.text.DateFormat;
import java.util.HashMap;
import java.util.Map;

import bryntum.crud.exception.CrudException;
import bryntum.crud.request.SyncStoreRequestHandler;
import bryntum.scheduler.domain.Event;
import bryntum.scheduler.dao.Scheduler;

public class EventSyncHandler extends SyncStoreRequestHandler<Event> {

    private final Scheduler app;

    public EventSyncHandler(Scheduler app, DateFormat dateFormat) {
        super(dateFormat);
        this.app = app;
    }

    @Override
    public Event getRecord(Map<String, Object> changes) {
        Integer id = (Integer) changes.get("Id");
        if (id == null) return null;

        Event record = app.getEvent(id);
        if (record == null) return null;

        if (changes.containsKey("ResourceId")) {
            record.setResourceId(changes.get("ResourceId"));
        }
        if (changes.containsKey("Cls")) {
            record.setCls((String) changes.get("Cls"));
        }
        if (changes.containsKey("StartDate")) {
            try {
                record.setStartDate(strToDate((String) changes.get("StartDate")));
            } catch (Exception e) {
                log.error(e);
            }
        }
        if (changes.containsKey("EndDate")) {
            try {
                record.setEndDate(strToDate((String) changes.get("EndDate")));
            } catch (Exception e) {
                log.error(e);
            }
        }
        if (changes.containsKey("Name")) {
            record.setName((String) changes.get("Name"));
        }
        if (changes.containsKey("Draggable")) {
            record.setDraggable((Boolean) changes.get("Draggable"));
        }
        if (changes.containsKey("Resizable")) {
            record.setResizable((Boolean) changes.get("Resizable"));
        }
        if (changes.containsKey(record.getPhantomIdField())) {
            record.setPhantomId((String) changes.get(record.getPhantomIdField()));
        }
        return record;
    }

    protected Map<String, Object> prepareData(Event event) {
        // initialize returning hash
        Map<String, Object> result = new HashMap<String, Object>();

        String phantomResourceId = event.getRawResourceId();
        if (event.getResourceId() == null && phantomResourceId != null) {
            Integer resourceId = app.getResourceIdByPhantom(phantomResourceId);
            event.setResourceId(resourceId);
            result.put("ResourceId", resourceId);
        }

        return result;
    }

    @Override
    public Map<String, Object> add(Event event) throws CrudException {
        Map<String, Object> result = prepareData(event);
        app.saveEvent(event);
        return result;
    }

    @Override
    public Map<String, Object> update(Event event, Map<String, Object> changes) throws CrudException {
        Map<String, Object> result = prepareData(event);
        app.saveEvent(event);
        return result;
    }

    @Override
    public Map<String, Object> remove(Event event) throws CrudException {
        Map<String, Object> result = new HashMap<String, Object>();
        app.removeEvent(event);
        return result;
    }
}
