package bryntum.scheduler.request;

import java.util.List;
import java.util.Map;

import org.codehaus.jackson.annotate.JsonProperty;

import bryntum.crud.request.LoadRequest;

/**
 * This class implements load request structure.
 */
public class SchedulerLoadRequest extends LoadRequest {

    /**
     * Resources store request parameters.
     * Contains null if resources store is not requested.
     */
    public Map<String, Object> resources;

    /**
     * Events store request parameters.
     * Contains null if events store is not requested.
     */
    public Map<String, Object> events;

    /**
     * Sets all stores parameters.
     * Note: this method is invoked during request deserialization.
     * @param stores
     */
    @Override
    @JsonProperty("stores")
    public void setStores(List<Object> stores) {

        super.setStores(stores);

        // map known Scheduler related stores properties to public fields
        resources = getStoreParams("resources");
        events = getStoreParams("events");
    }
}
