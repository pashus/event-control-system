import { Dialog, DialogTitle, DialogContent, Box } from "@mui/material";
import { useState } from "react";
import {
  TopToolbar,
  useNotify,
  useRefresh,
  useDataProvider,
  Button,
  SimpleForm,
  TextInput,
  required,
  ArrayInput,
  SimpleFormIterator,
} from "react-admin";

export const ActivitiesListActions = ({ eventId }: { eventId: string }) => {
  return (
    <TopToolbar>
      <AddActivityButton eventId={eventId} />
    </TopToolbar>
  );
};

const AddActivityButton = ({ eventId }: { eventId: string }) => {
  const [open, setOpen] = useState(false);
  const notify = useNotify();
  const refresh = useRefresh();
  const dataProvider = useDataProvider();

  const handleSubmit = async (data: any) => {
    console.log(data.act_vars);
    try {
      await dataProvider.create(`events/${eventId}/activities`, {
        data: {
          name: data.name,
          act_vars: data.act_vars?.map((item: any) => [item.key, item.type]),
        },
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
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Добавить активность</DialogTitle>
        <DialogContent>
          <SimpleForm onSubmit={handleSubmit} toolbar={false}>
            <TextInput
              source="name"
              label="Название активности"
              validate={required()}
            />
            <ArrayInput source="act_vars" label="Переменные активности">
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
            <Box display="flex" width="100%" justifyContent="space-between">
              <Button onClick={() => setOpen(false)} type="submit">
                Сохранить
              </Button>
              <Button onClick={() => setOpen(false)}>Отмена</Button>
            </Box>
          </SimpleForm>
        </DialogContent>
      </Dialog>
    </>
  );
};
