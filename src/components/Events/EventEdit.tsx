import {
  Edit,
  SimpleForm,
  TextInput,
  required,
  DateTimeInput,
  useRecordContext,
  useDataProvider,
  useNotify,
  useRefresh,
} from "react-admin";
import { useNavigate, useParams } from "react-router";

function EventEditTitle() {
  const record = useRecordContext<{ name?: string }>();
  return <span>Мероприятие {record?.name ?? ""}</span>;
}

export function EventEdit() {
  const dataProvider = useDataProvider();
  const { id } = useParams();
  const eventId = Number(id);
  const notify = useNotify();
  const refresh = useRefresh();
  const record = useRecordContext();
  const navigate = useNavigate();

  const handleSubmit = async (inputData: any) => {
    try {
      await dataProvider.update(`events`, {
        data: {
          name: inputData.name,
          description: inputData.description,
          start_time: inputData.start_time,
          end_time: inputData.end_time,
          location: inputData.location,
        },
        id: eventId,
        previousData: record,
      });

      notify("Мероприятие обновлено", { type: "success" });
    } catch (error) {
      notify("Ошибка при обновлении", { type: "error" });
      navigate("/events"); //заглушка пока
    }
  };

  return (
    <Edit title={<EventEditTitle />}>
      <SimpleForm onSubmit={handleSubmit}>
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
function notify(arg0: string, arg1: { type: string }) {
  throw new Error("Function not implemented.");
}

function refresh() {
  throw new Error("Function not implemented.");
}
