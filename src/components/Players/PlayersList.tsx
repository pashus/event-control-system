import {
  useGetOne,
  List,
  Datagrid,
  TextField,
  BooleanField,
} from "react-admin";
import { useParams } from "react-router";
import { PlayersListActions } from "./PlayersListActions";

export function PlayersList() {
  const { id } = useParams();
  const { data, isLoading } = useGetOne("events", { id });

  if (!id) return null;
  if (isLoading) return <div>Загрузка...</div>;

  return (
    <List
      resource={`events/${id}/players`}
      title={`Участники мероприятия ${data.name}`}
      actions={<PlayersListActions eventId={id} />}
    >
      <Datagrid size="medium" rowClick="show">
        <TextField source="id" label="ID" />
        <TextField source="first_name" label="Имя" />
        <TextField source="last_name" label="Фамилия" />
        <TextField source="group_name" label="Группа" />
        <BooleanField source="is_present" label="Посетил/не посетил" />
      </Datagrid>
    </List>
  );
}
