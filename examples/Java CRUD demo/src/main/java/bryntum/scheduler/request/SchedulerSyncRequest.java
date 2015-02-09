package bryntum.scheduler.request;

import bryntum.crud.request.SyncRequest;
import bryntum.crud.request.SyncStoreRequest;
import bryntum.scheduler.domain.*;

public class SchedulerSyncRequest extends SyncRequest {

    public SyncStoreRequest<Resource> resources;

    public SyncStoreRequest<Event> events;

}
