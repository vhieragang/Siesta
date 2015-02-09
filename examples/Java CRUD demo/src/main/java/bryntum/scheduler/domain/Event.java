package bryntum.scheduler.domain;

import java.util.Date;

import org.codehaus.jackson.annotate.JsonIgnore;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.annotate.JsonProperty;

import bryntum.crud.domain.General;

@JsonIgnoreProperties(ignoreUnknown=true)
public class Event extends General {
    protected String name;
    protected Date startDate;
    protected Date endDate;
    protected String cls;
    protected Integer resourceId;
    protected String rawResourceId;
    protected Boolean resizable;
    protected Boolean draggable;

    @JsonProperty("Name")
    public String getName() {
        return name;
    }
    @JsonProperty("Name")
    public void setName(String name) {
        this.name = name;
    }

    @JsonProperty("StartDate")
    public Date getStartDate() {
        return startDate;
    }
    @JsonProperty("StartDate")
    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    @JsonProperty("EndDate")
    public Date getEndDate() {
        return endDate;
    }
    @JsonProperty("EndDate")
    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    @JsonProperty("Cls")
    public String getCls() {
        return cls;
    }
    @JsonProperty("Cls")
    public void setCls(String cls) {
        this.cls = cls;
    }

    @JsonProperty("ResourceId")
    public Integer getResourceId() {
        return resourceId;
    }
    @JsonProperty("ResourceId")
    public void setResourceId(Object resourceId) {
        if (resourceId instanceof Integer) {
            this.resourceId = (Integer) resourceId;
        } else if (resourceId instanceof String) {
            try {
                this.resourceId = Integer.valueOf((String) resourceId);
            } catch (NumberFormatException e) {
                this.resourceId = null;
            }
            rawResourceId = (String) resourceId;
        }
    }

    @JsonIgnore
    public String getRawResourceId() {
        return rawResourceId;
    }

    @JsonProperty("Resizable")
    public Boolean getResizable() {
        return resizable == null ? false : resizable;
    }

    @JsonProperty("Resizable")
    public void setResizable(Boolean resizable) {
        this.resizable = resizable;
    }

    @JsonProperty("Draggable")
    public Boolean getDraggable() {
        return draggable == null ? false : draggable;
    }

    @JsonProperty("Draggable")
    public void setDraggable(Boolean draggable) {
        this.draggable = draggable;
    }

    @Override
    public String toString() {
        return "Event { id: "+id+", name: "+name+", startDate: "+startDate+", endDate: "+endDate+
            ", cls: "+cls+", resourceId: "+resourceId+", rawResourceId: "+rawResourceId+
            ", resizable: "+resizable+", draggable: "+draggable+", "+getPhantomIdField()+": "+phantomId+" }";
    }
}
