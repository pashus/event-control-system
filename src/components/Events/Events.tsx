import {
  required,
  useRecordContext,
  List,
  Datagrid,
  TextField,
  DateField,
  Edit,
  SimpleForm,
  TextInput,
  Create,
  TopToolbar,
  ExportButton,
  CreateButton,
  Show,
  SimpleShowLayout,
  DateTimeInput,
  RadioButtonGroupInput,
  ArrayInput,
  SimpleFormIterator,
} from "react-admin";
import { apiUrl, timeOptions } from "../../constants/constants";
import { Box, Button, Stack } from "@mui/material";
import { useNavigate } from "react-router";
import httpClient from "../../api/httpClient";

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
function EventListActions(): React.ReactElement {
  return (
    <TopToolbar>
      <CreateButton label="Создать мероприятие" />
      <ExportButton />
    </TopToolbar>
  );
}

function EventEditTitle() {
  const record = useRecordContext<{ name?: string }>();
  return <span>Мероприятие {record?.name ?? ""}</span>;
}

export function EventList() {
  return (
    <List actions={<EventListActions />} title="Мероприятия">
      <Datagrid size="medium">
        <TextField source="id" label="ID" />
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
      </Datagrid>
    </List>
  );
}

export function EventShow() {
  return (
    <Show title={<EventEditTitle />}>
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

export function EventEdit() {
  return (
    <Edit title={<EventEditTitle />}>
      <SimpleForm>
        <TextInput
          source="name"
          label="Название мероприятия"
          validate={required()}
        />
        <TextInput
          source="description"
          label="Описание"
          validate={required()}
        />
        <DateTimeInput
          source="start_time"
          label="Время начала"
          validate={required()}
          parse={(value) => (value ? new Date(value).toISOString() : null)}
        />
        <DateTimeInput
          source="end_time"
          label="Время окончания"
          validate={required()}
          parse={(value) => (value ? new Date(value).toISOString() : null)}
        />
        <TextInput
          source="location"
          label="Место проведения"
          validate={required()}
        />
      </SimpleForm>
    </Edit>
  );
}

export function EventCreate() {
  const navigate = useNavigate();

  const handleSave = async (data: any) => {
    try {
      const payload = {
        event_info: {
          name: data.name,
          description: data.description,
          start_time: data.start_time,
          end_time: data.end_time,
          location: data.location,
        },
        settings: {
          has_player_balance: data.has_player_balance,
          activities: data.activities.map((act: any) => ({
            name: act.name,
            act_vars: act.act_vars.map((v: any) => [v.key, v.type]),
          })),
          roles: data.roles.map((role: any) => ({
            name: role.name,
            activities_values: role.activities_values.map((av: any) => ({
              name: av.name,
              act_vars: av.act_vars.map((v: any) => [
                v.key,
                JSON.parse(v.value),
              ]),
            })),
          })),
        },
        reg_form: {},
      };

      const { json, status } = await httpClient(`${apiUrl}/events/new/`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (status < 200 || status >= 300) {
        throw new Error("Ошибка при создании мероприятия");
      }

      navigate(-1);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Create title="Создать мероприятие">
      <SimpleForm onSubmit={handleSave}>
        <TextInput
          source="name"
          label="Название мероприятия"
          validate={required()}
        />
        <TextInput
          source="description"
          label="Описание"
          validate={required()}
        />
        <DateTimeInput
          source="start_time"
          label="Время начала"
          validate={required()}
          parse={(value) => (value ? new Date(value).toISOString() : null)}
        />
        <DateTimeInput
          source="end_time"
          label="Время окончания"
          validate={required()}
          parse={(value) => (value ? new Date(value).toISOString() : null)}
        />
        <TextInput
          source="location"
          label="Место проведения"
          validate={required()}
        />
        <RadioButtonGroupInput
          label="Выберите, будет ли у пользователя баланс"
          source="has_player_balance"
          choices={[
            { id: true, name: "Да" },
            { id: false, name: "Нет" },
          ]}
        />
        <ArrayInput source="activities" label="Активности">
          <SimpleFormIterator>
            <TextInput source="name" label="Название активности" />
            <ArrayInput source="act_vars" label="Переменные активности">
              <SimpleFormIterator>
                <TextInput source="key" label="Название переменной" />
                <TextInput source="type" label="Тип (bool или int)" />
              </SimpleFormIterator>
            </ArrayInput>
          </SimpleFormIterator>
        </ArrayInput>

        <ArrayInput source="roles" label="Роли">
          <SimpleFormIterator>
            <TextInput source="name" label="Название роли" />
            <ArrayInput source="activities_values" label="Значения активностей">
              <SimpleFormIterator>
                <TextInput source="name" label="Название активности" />
                <ArrayInput source="act_vars" label="Значения переменных">
                  <SimpleFormIterator>
                    <TextInput source="key" label="Название переменной" />
                    <TextInput
                      source="value"
                      label="Значение (true/false или число)"
                    />
                  </SimpleFormIterator>
                </ArrayInput>
              </SimpleFormIterator>
            </ArrayInput>
          </SimpleFormIterator>
        </ArrayInput>
      </SimpleForm>
    </Create>
  );
}
