import {
  DeleteButton,
  EditButton,
  ListButton,
  Show,
  TextField,
} from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography } from "antd";
import { useParams } from "react-router";

const { Title } = Typography;

export const PlayerShow = () => {
  const { eventId } = useParams();

  const { query } = useShow({
    meta: {
      parent: {
        resource: "events",
        id: eventId,
      },
    },
  });
  const { data, isLoading } = query;

  const record = data?.data;

  return (
    <Show
      title={`Участник: ${record?.first_name} ${record?.last_name}`}
      isLoading={isLoading}
      headerButtons={({
        deleteButtonProps,
        editButtonProps,
        listButtonProps,
      }) => (
        <>
          {listButtonProps && <ListButton {...listButtonProps} />}
          {editButtonProps && <EditButton {...editButtonProps} />}
          {deleteButtonProps && (
            <DeleteButton
              {...deleteButtonProps}
              meta={{
                parent: {
                  resource: "events",
                  id: eventId,
                },
              }}
            />
          )}
        </>
      )}
    >
      <Title level={5}>{"ID"}</Title>
      <TextField value={record?.id} />

      <Title level={5}>{"Имя"}</Title>
      <TextField value={record?.first_name} />

      <Title level={5}>{"Фамилия"}</Title>
      <TextField value={record?.last_name} />

      <Title level={5}>{"Номер группы"}</Title>
      <TextField value={record?.group_name} />

      <Title level={5}>{"Отмечен"}</Title>
      <TextField value={record?.is_present} />

      <Title level={5}>{"Роли"}</Title>
      <TextField value={record?.role_id} />
    </Show>
  );
};
