package bryntum.scheduler.dao;

import static bryntum.scheduler.exception.Codes.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

import bryntum.crud.dao.Util;
import bryntum.crud.exception.CrudException;
import bryntum.scheduler.jdbc.*;
import bryntum.scheduler.domain.*;

public class Scheduler {

    /**
     * Object providing interface to interact with the database.
     */

    protected JdbcTemplate tmpl;
    /**
     *
     */
    public Util util;

    // JdbcTemplate row mappers to extract data from the database
    private static RowMapper<Resource> RESOURCE_ROW_MAPPER = new ResourceRowMapper();
    private static RowMapper<Event> EVENT_ROW_MAPPER = new EventRowMapper();

    static Logger log = Logger.getLogger(Scheduler.class.getName());

    public Scheduler (JdbcTemplate tmpl, Util util) {
        this.tmpl = tmpl;
        this.util = util;
    }

    public void initPhantomIdMaps() {
        ThreadLocal<Map<String, Map<String, Integer>>> local = new ThreadLocal<Map<String,Map<String,Integer>>>();
        local.set(new HashMap<String, Map<String,Integer>>());

        Map<String, Map<String, Integer>> map = local.get();
        map.put("events", new HashMap<String, Integer>());
        map.put("resources", new HashMap<String, Integer>());
        util.setPhantomIdMap(map);
    }

    /**
     * Gets real event identifier by specified phantom one.
     * @param phantomId Event phantom identifier.
     * @return Event real identifier.
     */
    public Integer getEventIdByPhantom(String phantomId) {
        return util.getIdByPhantom("events", phantomId);
    }

    /**
     * Gets real resource identifier by specified phantom one.
     * @param phantomId Resource phantom identifier.
     * @return Resource real identifier.
     */
    public Integer getResourceIdByPhantom(String phantomId) {
        return util.getIdByPhantom("resources", phantomId);
    }

    /**
     * Gets an event by its identifier.
     * @param id Event identifier.
     * @return Event.
     */
    public Event getEvent(int id) {
        return tmpl.queryForObject("select * from events where Id = ?", new Object[] { id }, EVENT_ROW_MAPPER);
    }

    /**
     * Saves an event.
     * Either creates a new record (if event identifier is null) or updates
     * existing one (if identifier is provided).
     * @param event Event to save.
     * @throws CrudException
     */
    public void saveEvent(Event event) throws CrudException {
        Integer id = event.getId();

        // update existing record
        if (id != null) {
            try {
                Event t = getEvent(id);
                if (t == null) throw new CrudException("Cannot find event.", UPDATE_EVENT);
            } catch (Exception e) {
                throw new CrudException("Cannot find event.", UPDATE_EVENT);
            }

            try {
                tmpl.update("update events set "+
                    "Name = ?, "+
                    "StartDate = ?, "+
                    "EndDate = ?, "+
                    "Resizable = ?, "+
                    "Draggable = ?, "+
                    "Cls = ?, "+
                    "ResourceId = ? "+
                    "where Id = ?",
                    new Object[] {
                        event.getName(),
                        event.getStartDate(),
                        event.getEndDate(),
                        event.getResizable() ? 1 : 0,
                        event.getDraggable() ? 1 : 0,
                        event.getCls(),
                        event.getResourceId(),
                        event.getId()
                    }
                );
            } catch (Exception e) {
                throw new CrudException("Cannot update event #" + Integer.toString(id), UPDATE_EVENT);
            }

        // create new record
        } else {
            try {
                tmpl.update("insert into events ("+
                    "Name, "+
                    "StartDate, "+
                    "EndDate, "+
                    "Resizable, "+
                    "Draggable, "+
                    "Cls, "+
                    "ResourceId "+
                    ") values (?,?,?,?,?,?,?)",
                    new Object[] {
                        event.getName(),
                        event.getStartDate(),
                        event.getEndDate(),
                        event.getResizable() ? 1 : 0,
                        event.getDraggable() ? 1 : 0,
                        event.getCls(),
                        event.getResourceId()
                    }
                );

                id = util.getLastInsertId();

                event.setId(id);

                // let's keep mapping from phantom Id to actual Id
                util.getPhantomIdMap("events").put(event.getPhantomId(), id);
            } catch (Exception e) {
                throw new CrudException("Cannot create event.", ADD_EVENT);
            }
        }

        util.updateRevision();
    }

    /**
     * Removes event.
     * @param event Event to remove.
     * @throws CrudException
     */
    public void removeEvent(Event event) throws CrudException {
        Integer id = event.getId();

        try {
            tmpl.update("delete from events where Id = ?", new Object[] { id });
        } catch (Exception e) {
            throw new CrudException("Cannot remove event #" + Integer.toString(id) + ".", REMOVE_EVENT);
        }

        util.updateRevision();
    }

    /**
     * Gets full list of events.
     * @return List of events.
     */
    public List<Event> getEvents() {
        return tmpl.query("select * from events", EVENT_ROW_MAPPER);
    }

    /**
     * Gets resource by its identifier.
     * @param id Resource identifier.
     * @return Resource.
     */
    public Resource getResource(int id) {
        return tmpl.queryForObject("select * from resources where Id = ?", new Object[] { id }, RESOURCE_ROW_MAPPER);
    }

    /**
     * Saves a resource.
     * Either creates a new record (if resource identifier is null) or updates
     * existing one (if identifier is provided).
     * @param resource Resource to save.
     * @throws CrudException
     */
    public void saveResource(Resource resource) throws CrudException {
        Integer id = resource.getId();

        // update existing record
        if (id != null) {
            try {
                tmpl.update("update resources set Name = ? where Id = ?", new Object[] { resource.getName(), id });
            } catch (Exception e) {
                throw new CrudException("Cannot update resource #" + Integer.toString(id), UPDATE_RESOURCE);
            }

        } else {
            try {
                tmpl.update("insert into resources (Name) values (?)", new Object[] { resource.getName() });
                id = util.getLastInsertId();

                resource.setId(id);

                // let's keep mapping from phantom Id to actual Id
                util.getPhantomIdMap("resources").put(resource.getPhantomId(), id);
            } catch (Exception e) {
                throw new CrudException("Cannot create resource.", ADD_RESOURCE);
            }
        }

        util.updateRevision();
    }

    /**
     * Removes resource.
     * @param resource Resource to remove.
     * @throws CrudException
     */
    public void removeResource(Resource resource) throws CrudException {
        Integer id = resource.getId();

        try {
            tmpl.update("delete from resources where Id = ?", new Object[] { id });
        } catch (Exception e) {
            throw new CrudException("Cannot remove resource #" + Integer.toString(id) + ".", REMOVE_RESOURCE);
        }

        util.updateRevision();
    }

    /**
     * Gets list of resources.
     * @return List of resources.
     */
    public List<Resource> getResources(Integer page, Integer pageSize) {
        if (page == null || page < 1) page = 1;

        return tmpl.query("select sql_calc_found_rows * from resources limit ?, ?", new Object[] { (page - 1) * pageSize, pageSize },
            RESOURCE_ROW_MAPPER);
    }

    /**
     * Clears the database.
     * TODO: this method is used for testing purposes only. Please remove it before deploy to production version.
     * @throws CrudException
     */
    public void reset() throws CrudException {
        tmpl.update("delete from events");
        tmpl.update("delete from resources");
        tmpl.update("delete from options");

        // initialize server revision stamp
        util.setOption("revision", "1");
    }

}
