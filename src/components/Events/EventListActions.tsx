import { TopToolbar, CreateButton, ExportButton } from "react-admin";

export function EventListActions(): React.ReactElement {
  return (
    <TopToolbar>
      <CreateButton label="Создать мероприятие" />
      <ExportButton />
    </TopToolbar>
  );
}
