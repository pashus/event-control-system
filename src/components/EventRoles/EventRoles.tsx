import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  List,
  Datagrid,
  TextField,
  useGetOne,
  Button,
  useNotify,
  useRefresh,
  useDataProvider,
  SimpleForm,
  TextInput,
  required,
  TopToolbar,
  FunctionField,
  Show,
  SimpleShowLayout,
  ArrayInput,
  SimpleFormIterator,
} from "react-admin";
import { Dialog, DialogTitle, DialogContent, Box } from "@mui/material";

export function EventRolesList() {
  const { id } = useParams();
  const { data: event } = useGetOne("events", { id });

  if (!id) return null;

  return (
    <List
      resource={`events/${id}/roles`}
      title={`Роли мероприятия ${event?.name || ""}`}
      actions={<RolesListActions eventId={id} />}
    >
      <Datagrid size="medium" rowClick="show">
        <TextField source="name" label="Название роли" />
        <FunctionField
          label="Активности"
          render={() => {
            return "Нажмите для просмотра";
          }}
        />
      </Datagrid>
    </List>
  );
}
const RolesListActions = ({ eventId }: { eventId: string }) => {
  return (
    <TopToolbar>
      <AddRoleButton eventId={eventId} />
    </TopToolbar>
  );
};

const AddRoleButton = ({ eventId }: { eventId: string }) => {
  const [open, setOpen] = useState(false);
  const notify = useNotify();
  const refresh = useRefresh();
  const dataProvider = useDataProvider();

  const handleSubmit = async (data: any) => {
    try {
      const postData = {
        name: data.name,
        activities_values: data.activities_values?.map((activity: any) => ({
          name: activity.name,
          act_vars: activity.act_vars?.map((varItem: any) => [
            varItem.key,
            varItem.value === 'true' ? true : 
            varItem.value === 'false' ? false : 
            !isNaN(varItem.value) ? Number(varItem.value) : 
            varItem.value
          ]) || []
        })) || []
      };

      await dataProvider.create(`events/${eventId}/roles`, {
        data: postData,
      });

      notify("Роль успешно добавлена", { type: "success" });
      refresh();
      setOpen(false);
    } catch (error: any) {
      notify(`Ошибка при добавлении роли: ${error.message}`, {
        type: "error",
      });
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Добавить роль</Button>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Добавить новую роль</DialogTitle>
        <DialogContent>
          <SimpleForm onSubmit={handleSubmit} toolbar={false}>
            <TextInput
              source="name"
              label="Название роли"
              validate={required()}
              fullWidth
            />

            <ArrayInput
              source="activities_values"
              label="Значения активностей"
              defaultValue={[]}
            >
              <SimpleFormIterator>
                <TextInput
                  source="name"
                  label="Название активности"
                  validate={required()}
                  fullWidth
                />

                <ArrayInput
                  source="act_vars"
                  label="Значения переменных"
                  defaultValue={[]}
                >
                  <SimpleFormIterator inline>
                    <TextInput
                      source="key"
                      label="Название переменной"
                      validate={required()}
                    />
                    <TextInput
                      source="value"
                      label="Значение (true/false или число)"
                      validate={required()}
                    />
                  </SimpleFormIterator>
                </ArrayInput>
              </SimpleFormIterator>
            </ArrayInput>

            <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
              <Button onClick={() => setOpen(false)}>Отмена</Button>
              <Button type="submit" variant="contained" color="primary">
                Сохранить
              </Button>
            </Box>
          </SimpleForm>
        </DialogContent>
      </Dialog>
    </>
  );
};

export const RoleShow = () => {
  const { id, role_id } = useParams();
  const { data: role, isLoading } = useGetOne(`events/${id}/roles`, {
    id: role_id,
  });

  if (isLoading) return <div>Загрузка...</div>;
  if (!role) return <div>Роль не найдена</div>;

  return (
    <Show
      resource={`events/${id}/roles`}
      id={role_id}
      title={`Роль: ${role.name}`}
    >
      <SimpleShowLayout>
        <TextField source="name" label="Название роли" />
        <FunctionField
          label="Активности"
          render={(record: any) => {
            if (!record.activities_values?.length) {
              return "Нет активностей";
            }
            return (
              <div>
                {record.activities_values.map((activity: any) => (
                  <div key={activity.activity_id} style={{ marginBottom: '16px' }}> 
                    <div><strong>Активность {activity.activity_id}</strong></div>
                    <div>
                      {activity.act_vars?.map(([name, value]: [string, any]) => (
                        <div key={name}>
                          {name}: {typeof value === 'boolean' ? (value ? 'Да' : 'Нет') : value}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            );
          }}
        />
      </SimpleShowLayout>
    </Show>
  );
};