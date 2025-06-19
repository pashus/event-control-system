import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  SimpleForm,
  TextInput,
  useDataProvider,
  useNotify,
  useGetOne,
} from "react-admin";

export const EventRegistrationPage = () => {
  const { id: eventId } = useParams();
  const navigate = useNavigate();
  const notify = useNotify();
  const dataProvider = useDataProvider();
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { data: event, isLoading: isEventLoading } = useGetOne("events", {
    id: eventId,
  });

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      await dataProvider.create(`events/${eventId}/players`, {
        data: {
          first_name: data.first_name,
          last_name: data.last_name,
          group_name: data.group_name,
        },
      });

      notify("Регистрация прошла успешно!", { type: "success" });
      setLoading(false);
    } catch (error) {
      notify("Ошибка при регистрации", { type: "error" });
    }
  };

  return (
    <Card
      sx={{
        maxWidth: 800,
        margin: "2rem auto",
        width: "90%",
        [theme.breakpoints.down("sm")]: {
          margin: "1rem auto",
          width: "95%",
        },
      }}
    >
      <CardContent sx={{ p: isMobile ? 2 : 3 }}>
        <Typography
          variant={isMobile ? "h5" : "h4"}
          gutterBottom
          align="center"
          sx={{ mb: 2 }}
        >
          Регистрация на мероприятие
        </Typography>

        {!isEventLoading && event && (
          <Box
            sx={{
              backgroundColor: theme.palette.primary.dark,
              p: 2,
              borderRadius: 1,
              mb: 3,
            }}
          >
            <Typography
              variant={isMobile ? "subtitle1" : "h4"}
              sx={{ fontWeight: "bold" }}
            >
              {event.name}
            </Typography>
            <Box sx={{ mt: 1 }}>
              <Typography variant="body1" color="text">
                <strong>Место:</strong> {event.location}
              </Typography>
              <Typography variant="body1" color="text" sx={{ mt: 1 }}>
                <strong>Время:</strong> {formatTime(event.start_time)}
              </Typography>
            </Box>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        <Typography
          variant={isMobile ? "subtitle1" : "h6"}
          gutterBottom
          sx={{ mb: 2 }}
        >
          Данные участника
        </Typography>

        <SimpleForm onSubmit={handleSubmit} toolbar={false}>
          <TextInput
            source="first_name"
            label="Имя"
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextInput
            source="last_name"
            label="Фамилия"
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextInput
            source="group_name"
            label="Группа"
            fullWidth
            required
            sx={{ mb: 3 }}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              justifyContent: "flex-start",
              gap: 2,
              mt: 3,
            }}
          >
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size={isMobile ? "medium" : "large"}
              disabled={loading || isEventLoading}
              fullWidth={isMobile}
            >
              {loading ? "Отправка..." : "Зарегистрироваться"}
            </Button>
            <Button
              onClick={() => navigate(-1)}
              variant="outlined"
              size={isMobile ? "medium" : "large"}
              fullWidth={isMobile}
            >
              Отмена
            </Button>
          </Box>
        </SimpleForm>
      </CardContent>
    </Card>
  );
};
