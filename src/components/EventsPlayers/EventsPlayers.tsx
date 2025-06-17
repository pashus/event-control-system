import { Box, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { useState } from "react";
import {
  BooleanField,
  Button,
  Datagrid,
  List,
  Show,
  SimpleForm,
  SimpleShowLayout,
  TextField,
  TextInput,
  TopToolbar,
  useDataProvider,
  useGetOne,
  useNotify,
  useRefresh,
} from "react-admin";
import { useNavigate, useParams } from "react-router";

export function EventPlayersList() {
  const { id } = useParams();
  const { data: event } = useGetOne("events", { id: id });

  if (!id) return null;

  return (
    <List
      resource={`events/${id}/players`}
      title={`Участники мероприятия ${event?.name}`}
      actions={<PlayersListActions eventId={id} />}
    >
      <Datagrid size="medium" rowClick="show">
        <TextField source="id" label="ID" />
        <TextField source="first_name" label="Имя" />
        <TextField source="last_name" label="Фамилия" />
        <TextField source="group_name" label="Группа" />
        <BooleanField source="is_present" label="Посетил/не посетил" />
      </Datagrid>
    </List>
  );
}

export function PlayerShow() {
  const { id, player_id } = useParams();
  const notify = useNotify();
  const refresh = useRefresh();
  const dataProvider = useDataProvider();
  const navigate = useNavigate();
  const [loadingCheckIn, setLoadingCheckIn] = useState(false);

  const { data: player } = useGetOne(
    `events/${id}/players`,
    { id: player_id || "" },
    { enabled: !!id && !!player_id },
  );

  const handleCheckIn = async () => {
    if (!id || !player_id) return;
    setLoadingCheckIn(true);
    try {
      await dataProvider.create(`events/${id}/players/${player_id}/check-in`, {
        data: {},
      });
      notify("Участник отмечен");
      refresh();
      navigate(-1); //ПОКА ТАК
    } catch (error) {
      notify("Ошибка при отметке", { type: "error" });
      navigate(-1); //ПОКА ТАК
    } finally {
      setLoadingCheckIn(false);
      refresh();
    }
  };

  return (
    <Show
      resource={`events/${id}/players`}
      id={player_id}
      title={`Информация про ${player.first_name}`}
    >
      <SimpleShowLayout record={player}>
        <TextField source="first_name" label="Имя" />
        <TextField source="last_name" label="Фамилия" />
        <TextField source="group_name" label="Группа" />
        <BooleanField source="is_present" label="Был/не был" />
        {!player?.is_present && (
          <Button disabled={loadingCheckIn} onClick={handleCheckIn}>
            Отметить присутствие
          </Button>
        )}
      </SimpleShowLayout>
    </Show>
  );
}

const PlayersListActions = ({ eventId }: { eventId: string }) => {
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
        },
      });

      notify("Участник успешно добавлен");
      refresh();
      setOpen(false);
    } catch (error) {
      notify("Ошибка при добавлении участника", { type: "error" });
      refresh();
      setOpen(false);
    }
  }; //тут пока траблы с сервером, поэтому ошибка, но потом добавляется на самом деле

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
            <Box display="flex" width="100%" justifyContent="space-between">
              <Button type="submit">Сохранить</Button>
              <Button onClick={() => setOpen(false)}>Отмена</Button>
            </Box>
          </SimpleForm>
        </DialogContent>
      </Dialog>
    </>
  );
};
