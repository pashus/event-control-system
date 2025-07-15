import {
  useGetOne,
  List,
  Datagrid,
  TextField,
  FunctionField,
} from "react-admin";
import { useParams } from "react-router";
import { RolesListActions } from "./RolesListActions";

export function RolesList() {
  const { id } = useParams();
  const { data, isLoading } = useGetOne("events", { id });

  if (!id) return null;
  if (isLoading) return <div>Загрузка...</div>;

  return (
    <List
      resource={`events/${id}/roles`}
      title={`Роли мероприятия ${data.name || ""}`}
      actions={<RolesListActions eventId={id} />}
    >
      <Datagrid size="medium" rowClick="show">
        <TextField source="id" label="ID" />
        <TextField source="name" label="Название роли" />
        <FunctionField
          label="Активности"
          render={(record: { activities_values?: Array<any> }) =>
            record.activities_values?.length || 0
          }
        />
      </Datagrid>
    </List>
  );
}
