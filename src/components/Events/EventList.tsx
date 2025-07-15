import { List, Datagrid, TextField, DateField } from "react-admin";
import { timeOptions } from "../../constants/constants";
import { EventListActions } from "./EventListActions";

export function EventList() {
  return (
    <List actions={<EventListActions />} title="Мероприятия">
      <Datagrid size="medium">
        <TextField source="id" label="ID" />
        <TextField source="name" label="Название мероприятия" />
        <TextField source="description" label="Описание" />
        <DateField
          source="start_time"
          label="Время начала"
          showTime
          options={timeOptions}
        />
        <DateField
          source="end_time"
          label="Время окончания"
          showTime
          options={timeOptions}
        />
        <TextField source="location" label="Место проведения" />
      </Datagrid>
    </List>
  );
}
