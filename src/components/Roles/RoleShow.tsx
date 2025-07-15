import {
  useGetOne,
  Show,
  SimpleShowLayout,
  TextField,
  FunctionField,
} from "react-admin";
import { useParams } from "react-router";

export const RoleShow = () => {
  const { id, role_id } = useParams();
  const { data, isLoading } = useGetOne(`events/${id}/roles`, {
    id: role_id,
  });

  if (isLoading) return <div>Загрузка...</div>;
  if (!data) return <div>Роль не найдена</div>;

  return (
    <Show
      resource={`events/${id}/roles`}
      id={role_id}
      title={`Информация про роль ${data.name}`}
    >
      <SimpleShowLayout>
        <TextField source="name" label="Название роли" />
        <FunctionField
          label="Активности"
          render={(record: any) => {
            if (
              !record.activities_values ||
              record.activities_values.length === 0
            ) {
              return <span>Нет активностей</span>;
            }
            return (
              <div>
                {record.activities_values.map(
                  (activity: any, index: number) => (
                    <div key={index} style={{ marginBottom: "16px" }}>
                      <div>
                        <span>Активность:</span>{" "}
                        {activity.activity_id || "не указан"}
                      </div>
                      {activity.act_vars && activity.act_vars.length > 0 ? (
                        <pre>{JSON.stringify(activity.act_vars, null, 2)}</pre> //тут пока код вместо нормального отображения
                      ) : (
                        <div style={{ marginTop: "8px" }}>Нет переменных</div>
                      )}
                    </div>
                  ),
                )}
              </div>
            );
          }}
        />
      </SimpleShowLayout>
    </Show>
  );
};
