package bryntum.scheduler.response;

import org.codehaus.jackson.annotate.JsonIgnore;

import bryntum.crud.response.SyncResponse;
import bryntum.crud.response.SyncStoreResponse;

public class SchedulerSyncResponse extends SyncResponse {

    public SchedulerSyncResponse() {
        super();
    }

    public SchedulerSyncResponse(Long requestId) {
        super(requestId);
    }

    public void setResources(SyncStoreResponse resources) {
        setStore("resources", resources);
    }

    public void setEvents(SyncStoreResponse events) {
        setStore("events", events);
    }

    @JsonIgnore
    public SyncStoreResponse getEvents() {
        return getStore("events");
    }

    @JsonIgnore
    public SyncStoreResponse getResources() {
        return getStore("resources");
    }
}
