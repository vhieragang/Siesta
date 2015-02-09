package bryntum.scheduler.domain;

import org.codehaus.jackson.annotate.JsonProperty;

import bryntum.crud.domain.General;

public class Resource extends General {
    protected String name;
    protected String rawCalendarId;

    @JsonProperty("Name")
    public String getName() {
        return name;
    }
    @JsonProperty("Name")
    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "Resource { id: "+id+", name: "+name+", "+getPhantomIdField()+": "+phantomId+" }";
    }
}
