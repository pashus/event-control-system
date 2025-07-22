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

export const RoleShow = () => {
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
      title={`Роль: ${record?.name}`}
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

      <Title level={5}>{"Название"}</Title>
      <TextField value={record?.name} />

      <Title level={5}>{"Значения активностей"}</Title>
      {/* <TextField value={record?.activities_values} /> */}
    </Show>
  );
};
