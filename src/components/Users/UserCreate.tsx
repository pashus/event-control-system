import {
  Create,
  SimpleForm,
  TextInput,
  required,
  PasswordInput,
} from "react-admin";

export function UserCreate() {
  return (
    <Create redirect="list" title="Добавить пользователя">
      <SimpleForm>
        <TextInput source="username" label="Полное имя" validate={required()} />
        <PasswordInput source="password" label="Пароль" validate={required()} />
      </SimpleForm>
    </Create>
  );
}
