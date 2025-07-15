import {
  useGetOne,
  List,
  Datagrid,
  TextField,
  FunctionField,
} from "react-admin";
import { useParams } from "react-router";
import { ActivitiesListActions } from "./ActivitiesListActions";

export function ActivitiesList() {
  const { id } = useParams();
  const { data, isLoading } = useGetOne("events", { id });

  if (!id) return null;
  if (isLoading) return <div>Загрузка...</div>;

  return (
    <List
      resource={`events/${id}/activities`}
      title={`Активности мероприятия: ${data.name}`}
      actions={<ActivitiesListActions eventId={id} />}
    >
      <Datagrid size="medium" rowClick="show">
        <TextField source="id" label="ID" />
        <TextField source="name" label="Название" />
        <FunctionField
          label="Переменные"
          render={(record: any) => (
            <div>
              {record.act_vars?.map(([name, type]: [string, string]) => (
                <div key={`${name}-${type}`}>
                  {name}: {type}
                </div>
              ))}
            </div>
          )}
        />
      </Datagrid>
    </List>
  );
}
