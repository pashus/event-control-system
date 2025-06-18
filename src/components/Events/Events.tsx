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
  DateInput,
  Create,
  TopToolbar,
  ExportButton,
  CreateButton,
  Show,
  SimpleShowLayout,
  DateTimeInput,
} from "react-admin";
import { timeOptions } from "../../constants/constants";
import { Button } from "@mui/material";
import { useNavigate } from "react-router";

const PlayersButton = () => {
  const record = useRecordContext();
  const navigate = useNavigate();
  if (!record) return null;

  return (
    <Button
      variant="contained"
      color="secondary"
      onClick={() => navigate(`/events/${record.id}/players`)}
    >
      Показать участников
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
        <PlayersButton />
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
        <DateInput source="date" label="Дата" validate={required()} />
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
      </SimpleForm>
    </Edit>
  );
}

export function EventCreate() {
  const navigate = useNavigate();

  const handleSave = async (values: any) => {
    try {
      const settingsParsed = JSON.parse(values.settings);

      const payload = {
        event_info: {
          name: values.name,
          description: values.description,
          start_time: values.start_time,
          end_time: values.end_time,
          location: values.location,
        },
        settings: settingsParsed,
        reg_form: {},
      };
      const token = localStorage.getItem("token");

      const response = await fetch("http://127.0.0.1:8000/api/v1/events/new/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Ошибка при создании мероприятия");
      }

      navigate(-1);
    } catch (error) {
      alert("Ошибка: " + (error as Error).message);
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
        <TextInput
          source="settings"
          label="Настрйоки"
          multiline
          validate={required()}
        />
      </SimpleForm>
    </Create>
  );
}
