import {
  useGetOne,
  List,
  Datagrid,
  TextField,
  FunctionField,
} from "react-admin";
import { useParams } from "react-router";
import { RolesListActions } from "./RolesListActions";
import { ActivityName } from "../Activities/ActivityName";

export function RolesList() {
  const { id } = useParams();
  const { data, isLoading } = useGetOne("events", { id });
  if (!id) return null;
  if (isLoading) return <div>Загрузка...</div>;

  return (
    <List
      resource={`events/${id}/roles`}
      title={`Роли мероприятия: ${data.name}`}
      actions={<RolesListActions eventId={id} />}
    >
      <Datagrid size="medium" rowClick="show">
        <TextField source="id" label="ID" />
        <TextField source="name" label="Название роли" />
        <FunctionField
          label="Активности"
          render={(record: any) => (
            <ActivityListByRole eventId={id!} roleId={record.id} />
          )}
        />
      </Datagrid>
    </List>
  );
}

function ActivityListByRole({
  eventId,
  roleId,
}: {
  eventId: string | number;
  roleId: number;
}) {
  const { data, isLoading, error } = useGetOne(`events/${eventId}/roles`, {
    id: roleId,
  });

  if (isLoading) return <span>Загрузка...</span>;
  if (error || !data) return <span>Ошибка загрузки</span>;

  if (!data.activities_values?.length) return <span>Нет активностей</span>;

  return (
    <span>
      {data.activities_values.map((activity: any, index: number) => (
        <div key={index}>
          <span>Активность: </span>
          <ActivityName eventId={eventId} activityId={activity.activity_id} />
        </div>
      ))}
    </span>
  );
}
