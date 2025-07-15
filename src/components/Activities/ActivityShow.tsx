import {
  useGetOne,
  Show,
  SimpleShowLayout,
  TextField,
  FunctionField,
} from "react-admin";
import { useParams } from "react-router";

export const ActivityShow = () => {
  const { id, activity_id } = useParams();
  const { data, isLoading } = useGetOne(`events/${id}/activities`, {
    id: activity_id, //params.id будет принимать activity_id (в дата провайдер)
  });

  if (isLoading) return <div>Загрузка...</div>;

  return (
    <Show
      resource={`events/${id}/activities`}
      id={activity_id}
      title={`Активность: ${data.name}`}
    >
      <SimpleShowLayout>
        <TextField source="name" label="Название активности" />
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
      </SimpleShowLayout>
    </Show>
  );
};
