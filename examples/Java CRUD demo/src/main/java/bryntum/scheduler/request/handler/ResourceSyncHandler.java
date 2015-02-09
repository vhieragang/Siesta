package bryntum.scheduler.request.handler;

import java.util.HashMap;
import java.util.Map;

import bryntum.crud.exception.CrudException;
import bryntum.crud.request.SyncStoreRequestHandler;
import bryntum.scheduler.domain.Resource;
import bryntum.scheduler.dao.Scheduler;

public class ResourceSyncHandler extends SyncStoreRequestHandler<Resource> {

    private final Scheduler app;

    public ResourceSyncHandler(Scheduler app) {
        this.app = app;
    }

    @Override
    public Resource getRecord(Map<String, Object> changes) {
        Integer id = (Integer) changes.get("Id");
        if (id == null) return null;

        Resource record = app.getResource(id);
        if (record == null) return null;

        if (changes.containsKey("Name")) {
            record.setName((String) changes.get("Name"));
        }

        return record;
    }

    @Override
    public Map<String, Object> add(Resource resource) throws CrudException {
        Map<String, Object> result = new HashMap<String, Object>();
        app.saveResource(resource);
        return result;
    }

    @Override
    public Map<String, Object> update(Resource resource, Map<String, Object> changes) throws CrudException {
        Map<String, Object> result = new HashMap<String, Object>();
        app.saveResource(resource);
        return result;
    }

    @Override
    public Map<String, Object> remove(Resource resource) throws CrudException {
        Map<String, Object> result = new HashMap<String, Object>();
        app.removeResource(resource);
        return result;
    }
}
