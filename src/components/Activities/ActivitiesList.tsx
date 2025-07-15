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
      title={`Активности мероприятия ${data.name}`}
      actions={<ActivitiesListActions eventId={id} />}
    >
      <Datagrid size="medium" rowClick="show">
        <TextField source="id" label="ID" />
        <TextField source="name" label="Название" />
        <FunctionField
          label="Переменные"
          render={(record) =>
            record.act_vars?.length ? (
              <span>
                {record.act_vars.map(
                  ([name, type]: [string, string], index: number) => (
                    <span key={index}>
                      {name}, тип={type}
                      <br />
                    </span>
                  ),
                )}
              </span>
            ) : (
              "—"
            )
          }
        />
      </Datagrid>
    </List>
  );
}
