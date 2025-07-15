import { Box } from "@mui/material";
import { useState, useEffect } from "react";
import {
  useNotify,
  useRefresh,
  useDataProvider,
  useGetOne,
  Show,
  SimpleShowLayout,
  TextField,
  BooleanField,
  Button,
} from "react-admin";
import { useParams, useNavigate } from "react-router";

export function PlayerShow() {
  const { id, player_id } = useParams();
  const notify = useNotify();
  const refresh = useRefresh();
  const dataProvider = useDataProvider();
  const navigate = useNavigate();
  const [loadingCheckIn, setLoadingCheckIn] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  useEffect(() => {
    if (!id || !player_id) return;

    dataProvider
      .getPlayerQrCode(id, player_id)
      .then((url: string) => {
        setQrCodeUrl(url);
      })
      .catch(() => notify("Ошибка при получении QR-кода", { type: "error" }));
  }, [id, player_id]);

  const { data, isLoading, error } = useGetOne(`events/${id}/players`, {
    id: player_id,
  });

  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка при загрузке данных игрока</div>;
  if (!data) return <div>Игрок не найден</div>;

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
      title={`Информация про ${data.first_name} ${data.last_name}`}
    >
      <SimpleShowLayout record={data}>
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
        {!data?.is_present && (
          <Button disabled={loadingCheckIn} onClick={handleCheckIn}>
            Отметить присутствие
          </Button>
        )}
      </SimpleShowLayout>
    </Show>
  );
}
