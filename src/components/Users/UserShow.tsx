import {
  Show,
  SimpleShowLayout,
  TextField,
  useRecordContext,
} from "react-admin";

function UserShowTitle() {
  const record = useRecordContext<{ username?: string }>();
  return <span>Пользователь: {record?.username ?? ""}</span>;
}

export function UserShow() {
  return (
    <Show title={<UserShowTitle />}>
      <SimpleShowLayout>
        <TextField source="username" label="Имя" />
      </SimpleShowLayout>
    </Show>
  );
}
