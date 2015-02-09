package bryntum.scheduler.exception;

/**
 * Contains possible values of CrudException codes.
 */
public final class Codes {

    private Codes() {}

    /**
     * Error of event updating.
     */
    public static final int UPDATE_EVENT = 10;
    /**
     * Error of event adding.
     */
    public static final int ADD_EVENT = 11;
    /**
     * Error of event removing.
     */
    public static final int REMOVE_EVENT = 12;
    /**
     * Error of events list getting.
     */
    public static final int GET_EVENTS = 13;
    /**
     * Error of resource updating.
     */
    public static final int UPDATE_RESOURCE = 14;
    /**
     * Error of resource adding.
     */
    public static final int ADD_RESOURCE = 15;
    /**
     * Error of resource removing.
     */
    public static final int REMOVE_RESOURCE = 16;
    /**
     * Error of resources list getting.
     */
    public static final int GET_RESOURCES = 17;
}
