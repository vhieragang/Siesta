package bryntum.scheduler.response;

import java.util.List;
import bryntum.crud.response.LoadResponse;
import bryntum.crud.response.LoadStoreResponse;
import bryntum.scheduler.domain.*;

/**
 * This class implements response for the load request.
 */
public class SchedulerLoadResponse extends LoadResponse {

    public SchedulerLoadResponse() {
        this(null);
    }

    public SchedulerLoadResponse(Long requestId) {
        super(requestId);
    }

    /**
     * Sets list of resources to be responded.
     * @param resources List of resources.
     */
    public void setResources(List<Resource> resources, Integer total) {
        content.put("resources", new LoadStoreResponse<Resource>(resources, total));
    }

    /**
     * Sets list of events to be responded.
     * @param events List of events.
     */
    public void setEvents(List<Event> events) {
        content.put("events", new LoadStoreResponse<Event>(events));
    }

}
