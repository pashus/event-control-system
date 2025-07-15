import { Stack } from "@mui/material";
import {
  Show,
  SimpleShowLayout,
  TextField,
  DateField,
  useRecordContext,
  Button,
} from "react-admin";
import { timeOptions } from "../../constants/constants";
import { useNavigate } from "react-router";

function EventShowTitle() {
  const record = useRecordContext<{ name?: string }>();
  return <span>Мероприятие: {record?.name ?? ""}</span>;
}

export function EventShow() {
  return (
    <Show title={<EventShowTitle />}>
      <SimpleShowLayout>
        <TextField source="name" label="Название мероприятия" />
        <TextField source="description" label="Описание" />
        <DateField
          source="start_time"
          label="Время начала"
          showTime
          options={timeOptions}
        />
        <DateField
          source="end_time"
          label="Время окончания"
          showTime
          options={timeOptions}
        />
        <TextField source="location" label="Место проведения" />
        <Stack direction="row" spacing={2} mt={2}>
          <PlayersButton />
          <RegistrationButton />
          <ActivityButton />
          <RoleButton />
        </Stack>
      </SimpleShowLayout>
    </Show>
  );
}

const PlayersButton = () => {
  const record = useRecordContext();
  const navigate = useNavigate();
  if (!record) return null;

  return (
    <Button
      variant="contained"
      color="secondary"
      onClick={() => navigate(`/events/${record.id}/players`)}
      sx={{
        width: "230px",
        height: "30px",
      }}
    >
      Показать участников
    </Button>
  );
};

const RegistrationButton = () => {
  const record = useRecordContext();
  const navigate = useNavigate();
  if (!record) return null;

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={() => navigate(`/events/${record.id}/registration`)}
      sx={{
        width: "230px",
        height: "30px",
        backgroundColor: "#4caf50",
        "&:hover": {
          backgroundColor: "#388e3c",
        },
      }}
    >
      Открыть регистрацию
    </Button>
  );
};

const ActivityButton = () => {
  const record = useRecordContext();
  const navigate = useNavigate();
  if (!record) return null;

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={() => navigate(`/events/${record.id}/activities`)}
      sx={{
        width: "230px",
        height: "30px",
        backgroundColor: "#4a90e2",
        "&:hover": {
          backgroundColor: "#3a7bc8",
        },
      }}
    >
      Посмотреть активности
    </Button>
  );
};

const RoleButton = () => {
  const record = useRecordContext();
  const navigate = useNavigate();
  if (!record) return null;

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={() => navigate(`/events/${record.id}/roles`)}
      sx={{
        width: "230px",
        height: "30px",
        backgroundColor: "#FF8C00",
        "&:hover": {
          backgroundColor: "#FF6A00",
        },
      }}
    >
      Посмотреть роли
    </Button>
  );
};
