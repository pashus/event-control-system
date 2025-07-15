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
} from "react-admin";

export const PlayersListActions = ({ eventId }: { eventId: string }) => {
  return (
    <TopToolbar>
      <AddPlayerButton eventId={eventId} />
    </TopToolbar>
  );
};

const AddPlayerButton = ({ eventId }: { eventId: string }) => {
  const [open, setOpen] = useState(false);
  const notify = useNotify();
  const refresh = useRefresh();
  const dataProvider = useDataProvider();

  const handleSubmit = async (data: any) => {
    try {
      await dataProvider.create(`events/${eventId}/players`, {
        data: {
          first_name: data.first_name,
          last_name: data.last_name,
          group_name: data.group_name,
          role_id: data.role_id,
        },
      });

      notify("Участник успешно добавлен", { type: "success" });
      refresh();
    } catch (error) {
      notify("Ошибка при добавлении участника", { type: "error" });
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Добавить участника</Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Добавить участника</DialogTitle>
        <DialogContent>
          <SimpleForm onSubmit={handleSubmit} toolbar={false} sx={{ p: 0 }}>
            <TextInput source="first_name" label="Имя" />
            <TextInput source="last_name" label="Фамилия" />
            <TextInput source="group_name" label="Группа" />
            <TextInput source="role_id" label="ID роли" />
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
