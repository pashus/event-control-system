import { Box, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { useEffect, useState } from "react";
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
import { apiUrl } from "../../constants/constants";
import httpClient from "../../api/httpClient";

const PlayersListActions = ({ eventId }: { eventId: string }) => {
  return (
    <TopToolbar>
      <AddPlayerButton eventId={eventId} />
    </TopToolbar>
  );
};

export function EventPlayersList() {
  const { id } = useParams();
  const { data: event } = useGetOne("events", { id });

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
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  useEffect(() => {
    const fetchQrCode = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/events/${id}/players/${player_id}/qr-code/`,
          {
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
              Accept: "image/png",
            },
          },
        );
        if (!response.ok) throw new Error("Ошибка при получении QR-кода");

        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setQrCodeUrl(imageUrl);
      } catch (error) {
        notify("Ошибка при получении QR-кода", { type: "error" });
      }
    };

    if (id && player_id) {
      fetchQrCode();
    }
  }, [id, player_id]);

  const {
    data: player,
    isLoading,
    error,
  } = useGetOne(`events/${id}/players`, { id: player_id });

  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка при загрузке данных игрока</div>;
  if (!player) return <div>Игрок не найден</div>;

  const handleCheckIn = async () => {
    setLoadingCheckIn(true);
    try {
      await dataProvider.create(`events/${id}/players/${player_id}/check-in`, {
        data: {},
      });
      notify("Участник отмечен", { type: "success" });
      refresh();
      navigate(-1);
    } catch (error) {
      notify("Ошибка при отметке", { type: "error" });
    }
  };

  return (
    <Show
      resource={`events/${id}/players`}
      id={player_id}
      title={`Информация про ${player.first_name} ${player.last_name}`}
    >
      <SimpleShowLayout record={player}>
        <TextField source="first_name" label="Имя" />
        <TextField source="last_name" label="Фамилия" />
        <TextField source="group_name" label="Группа" />
        <BooleanField source="is_present" label="Был/не был" />
        {qrCodeUrl && (
          <Box mt={2}>
            <img
              src={qrCodeUrl}
              alt="QR код участника"
              style={{ maxWidth: "200px" }}
            />
          </Box>
        )}
        {!player?.is_present && (
          <Button disabled={loadingCheckIn} onClick={handleCheckIn}>
            Отметить присутствие
          </Button>
        )}
      </SimpleShowLayout>
    </Show>
  );
}

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
