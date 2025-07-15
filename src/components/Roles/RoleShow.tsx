import {
  useGetOne,
  Show,
  SimpleShowLayout,
  TextField,
  FunctionField,
} from "react-admin";
import { useParams } from "react-router";
import { ActivityName } from "../Activities/ActivityName";

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
                    <div key={index}>
                      <div>
                        <span>Активность:</span>{" "}
                        <ActivityName
                          eventId={id!}
                          activityId={activity.activity_id}
                        />
                      </div>
                      {activity.act_vars && activity.act_vars.length > 0 ? (
                        <pre>{JSON.stringify(activity.act_vars, null, 2)}</pre> //тут пока код вместо нормального отображения
                      ) : (
                        <div>Нет переменных</div>
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
