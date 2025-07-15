import {
  Edit,
  SimpleForm,
  TextInput,
  required,
  DateTimeInput,
  useRecordContext,
} from "react-admin";

function EventEditTitle() {
  const record = useRecordContext<{ name?: string }>();
  return <span>Мероприятие {record?.name ?? ""}</span>;
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
