import { TopToolbar, CreateButton, ExportButton } from "react-admin";

export function UserListActions() {
  return (
    <TopToolbar>
      <CreateButton label="Добавить пользователя" />
      <ExportButton />
    </TopToolbar>
  );
}
