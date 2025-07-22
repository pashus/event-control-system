import {
  DeleteButton,
  EditButton,
  ListButton,
  Show,
  TextField,
} from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Space, Typography } from "antd";
import { useParams } from "react-router";

const { Title, Text } = Typography;

export const ActivityShow = () => {
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
      title={`Активность: ${record?.name}`}
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

      <Title level={5}>{"Переменные активности"}</Title>
      <Space direction="vertical">
        {record?.act_vars?.length ? (
          record.act_vars.map(
            ([key, value]: [string, string], index: number) => (
              <Text key={index}>
                {key}: {value}
              </Text>
            )
          )
        ) : (
          <Text type="secondary">Нет переменных</Text>
        )}
      </Space>
    </Show>
  );
};
