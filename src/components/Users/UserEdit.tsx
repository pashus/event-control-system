import {
  Edit,
  SimpleForm,
  TextInput,
  required,
  useRecordContext,
} from "react-admin";

function UserEdititle() {
  const record = useRecordContext<{ username?: string }>();
  return <span>Пользователь: {record?.username ?? ""}</span>;
}

export function UserEdit() {
  return (
    <Edit title={<UserEdititle />}>
      <SimpleForm>
        <TextInput source="username" label="Имя" validate={required()} />
      </SimpleForm>
    </Edit>
  );
}
