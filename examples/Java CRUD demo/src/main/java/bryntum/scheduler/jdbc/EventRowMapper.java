package bryntum.scheduler.jdbc;

import java.sql.ResultSet;
import java.sql.SQLException;
import org.springframework.jdbc.core.RowMapper;

import bryntum.scheduler.domain.Event;

public class EventRowMapper implements RowMapper<Event> {

    @Override
    public Event mapRow(ResultSet rs, int n) throws SQLException {
        Event result = new Event();

        result.setId(rs.getInt("Id"));
        result.setName(rs.getString("Name"));
        result.setStartDate(rs.getTimestamp("StartDate"));
        result.setEndDate(rs.getTimestamp("EndDate"));
        result.setResourceId(rs.getInt("ResourceId"));
        result.setResizable(rs.getInt("Resizable") == 1);
        result.setDraggable(rs.getInt("Draggable") == 1);
        result.setCls(rs.getString("Cls"));

        return result;
    }

}
