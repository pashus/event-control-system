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
  SimpleShowLayout,
  Show,
  ArrayInput,
  SimpleFormIterator,
} from "react-admin";
import { Dialog, DialogTitle, DialogContent, Box } from "@mui/material";

export function EventActivitiesList() {
  const { id } = useParams();
  const { data: event } = useGetOne("events", { id });

  if (!id) return null;

  return (
    <List
      resource={`events/${id}/activities`}
      title={`Активности мероприятия ${event?.name}`}
      actions={<ActivitiesListActions eventId={id} />}
    >
      <Datagrid size="medium" rowClick="show">
        <TextField source="name" label="Название" />
        <FunctionField
          label="Переменные"
          render={(record: any) => (
            <div>
              {record.act_vars?.map(([name, type]: [string, string]) => (
                <div key={`${name}-${type}`}>{name}: {type}</div>
              ))}
            </div>
          )}
        />
      </Datagrid>
    </List>
  );
}

const ActivitiesListActions = ({ eventId }: { eventId: string }) => {
  return (
    <TopToolbar>
      <AddActivityButton eventId={eventId} />
    </TopToolbar>
  );
};

export const AddActivityButton = ({ eventId }: { eventId: string }) => {
  const [open, setOpen] = useState(false);
  const notify = useNotify();
  const refresh = useRefresh();
  const dataProvider = useDataProvider();

  const handleSubmit = async (data: any) => {
    try {
      const postData = {
        name: data.name,
        act_vars: data.act_vars?.map((varItem: any) => [
          varItem.key,
          varItem.type
        ]) || []
      };

      await dataProvider.create(`events/${eventId}/activities`, {
        data: postData,
      });

      notify("Активность успешно добавлена", { type: "success" });
      refresh();
      setOpen(false);
    } catch (error) {
      notify("Ошибка при добавлении активности", { type: "error" });
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Добавить активность</Button>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Добавить активность</DialogTitle>
        <DialogContent>
          <SimpleForm 
            onSubmit={handleSubmit} 
            toolbar={false}
            defaultValues={{ act_vars: [] }}
          >
            <TextInput
              source="name"
              label="Название активности"
              validate={required()}
              fullWidth
            />

            <ArrayInput
              source="act_vars"
              label="Переменные активности"
            >
              <SimpleFormIterator inline>
                <TextInput
                  source="key"
                  label="Название переменной"
                  validate={required()}
                />
                <TextInput
                  source="type"
                  label="Тип (bool или int)"
                  validate={required()}
                />
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

export const ActivityShow = () => {
  const { id, activity_id } = useParams();
  const { data: activity, isLoading } = useGetOne(`events/${id}/activities`, {
    id: activity_id,
  });

  if (isLoading) return <div>Загрузка...</div>;

  return (
    <Show
      resource={`events/${id}/activities`}
      id={activity_id}
      title={`Активность: ${activity.name}`}
    >
      <SimpleShowLayout>
        <TextField source="name" label="Название активности" />
        <FunctionField
          label="Переменные"
          render={(record: any) => (
            <div>
              {record.act_vars?.map(([name, type]: [string, string]) => (
                <div key={`${name}-${type}`}>{name}: {type}</div>
              ))}
            </div>
          )}
        />
      </SimpleShowLayout>
    </Show>
  );
};