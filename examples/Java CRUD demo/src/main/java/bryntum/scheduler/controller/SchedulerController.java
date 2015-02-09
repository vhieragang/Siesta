package bryntum.scheduler.controller;

import java.text.DateFormat;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import bryntum.crud.jackson.CrudObjectMapper;
import bryntum.crud.request.Rows;
import bryntum.crud.response.ErrorResponse;
import bryntum.crud.response.GeneralResponse;
import bryntum.scheduler.request.SchedulerLoadRequest;
import bryntum.scheduler.request.SchedulerSyncRequest;
import bryntum.scheduler.dao.Scheduler;
import bryntum.scheduler.request.handler.*;
import bryntum.scheduler.response.*;

/**
 * The controller object, receiving requests, processing them and returning corresponding responses.
 */
@Controller
public class SchedulerController {

    /**
     * Data access singleton object.
     */
    protected Scheduler scheduler;

    /**
     * A Jackson ObjectMapper instance used to encode/decode JSON.
     */
    protected final CrudObjectMapper objectMapper;

    private final DateFormat dateFormat;

    /**
     * Constructs new GanttController, given DAO object to deal with
     * stores and date format to encode/decode dates to/from JSON properly.
     * Note: Used as a bean.
     * @param scheduler The DAO object to work with the stores.
     * @param objectMapper A Jackson ObjectMapper instance used to encode/decode JSON.
     */
    public SchedulerController(Scheduler scheduler, CrudObjectMapper objectMapper) {
        super();
        this.scheduler = scheduler;
        this.objectMapper = objectMapper;
        this.dateFormat = objectMapper.getDeserializationConfig().getDateFormat();
    }

    /**
     * Processes JSON encoded load request.
     * @param json Request body string.
     * @return Response.
     * @throws Exception
     */
    @RequestMapping(value = "/load", method = RequestMethod.POST)
    public GeneralResponse load(@RequestBody String json) {

        Long requestId = null;

        try {
            SchedulerLoadRequest loadRequest = null;

            // decode request object
            try {
                loadRequest = objectMapper.readValue(json, SchedulerLoadRequest.class);
            } catch (Exception e) {
                throw new RuntimeException("Invalid load JSON");
            }

            // get request identifier
            requestId = loadRequest.requestId;

            // initialize response object
            SchedulerLoadResponse loadResponse = new SchedulerLoadResponse(requestId);

            // if a corresponding store is requested then add it to the response object

            if (loadRequest.resources != null) {
                loadResponse.setResources(scheduler.getResources((Integer) loadRequest.resources.get("page"),
                    (Integer) loadRequest.resources.get("pageSize")), scheduler.util.getFoundRows());
            }
            if (loadRequest.events != null) {
                loadResponse.setEvents(scheduler.getEvents());
            }

            // put current server revision to the response
            loadResponse.setRevision(scheduler.util.getRevision());

            return loadResponse;

        // handle exceptions
        } catch (Exception e) {
            return new ErrorResponse(e, requestId);
        }
    }

    /**
     * Processes JSON encoded sync request.
     * @param json Request body string.
     * @return Response.
     * @throws Exception
     */
    @RequestMapping(value = "/sync", method = RequestMethod.POST)
    public GeneralResponse sync(@RequestBody String json) {

        Long requestId = null;

        try {
            // initialize thread specific phantom to real Id maps
            scheduler.initPhantomIdMaps();

            SchedulerSyncRequest syncRequest = null;

            // decode request object
            try {
                syncRequest = objectMapper.readValue(json, SchedulerSyncRequest.class);
            } catch (Exception e) {
                throw new RuntimeException("Invalid sync JSON");
            }

            // get request identifier
            requestId = syncRequest.requestId;

            // initialize response object
            SchedulerSyncResponse syncResponse = new SchedulerSyncResponse(requestId);

            // Here we reject client's changes if we suspect that they are out-dated
            // considering difference between server and client revisions.
            // You can get rid of this call if you don't need such behavior.
            scheduler.util.checkRevision(syncRequest.revision);

            // if a corresponding store modified data provided then handle it
            ResourceSyncHandler resourceHandler = null;
            if (syncRequest.resources != null) {
                resourceHandler = new ResourceSyncHandler(scheduler);
                syncResponse.setResources(resourceHandler.handle(syncRequest.resources, Rows.ADDED_AND_UPDATED));
            }

            EventSyncHandler eventHandler = null;
            if (syncRequest.events != null) {
                eventHandler = new EventSyncHandler(scheduler, dateFormat);
                syncResponse.setEvents(eventHandler.handle(syncRequest.events, Rows.ADDED_AND_UPDATED));
            }

            // then let's process records removals

            if (eventHandler != null)
                syncResponse.setEvents(eventHandler.handleRemoved(syncRequest.events, syncResponse.getEvents()));

            if (resourceHandler != null)
                syncResponse.setResources(resourceHandler.handleRemoved(syncRequest.resources, syncResponse.getResources()));

            // put current server revision to the response
            syncResponse.setRevision(scheduler.util.getRevision());

            return syncResponse;

        // handle exceptions
        } catch (Exception e) {
            return new ErrorResponse(e, requestId);
        }
    }

    /**
     * Back-end test handler providing database cleanup.
     *
     * TODO: WARNING! This code clears the database. Please get rid of this code before running it on production.
     */
    @RequestMapping(value = "/reset")
    public void processRest() throws Exception {
        scheduler.reset();
    }
}
