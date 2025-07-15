import { List, Datagrid, TextField } from "react-admin";
import { UserListActions } from "./UserListActions";

export function UserList() {
  return (
    <List actions={<UserListActions />} title="Пользователи" perPage={50}>
      <Datagrid size="medium">
        <TextField source="id" label="ID" />
        <TextField source="username" label="Имя" />
      </Datagrid>
    </List>
  );
}
