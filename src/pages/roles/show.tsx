import { UserSwitchOutlined } from "@ant-design/icons";
import {
  DeleteButton,
  EditButton,
  ListButton,
  Show,
  TextField,
} from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Card, Space, Typography } from "antd";
import { useParams } from "react-router";

const { Title, Text } = Typography;

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
          {listButtonProps && (
            <ListButton {...listButtonProps} icon={<UserSwitchOutlined />} />
          )}
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
      {record?.activities_values?.length ? (
        <Space direction="vertical" style={{ width: "100%" }}>
          {record.activities_values.map((activity: any, index: number) => (
            <Card
              key={index}
              type="inner"
              title={`Активность ID: ${activity.activity_id}`}
            >
              <Space direction="vertical">
                {activity.act_vars.map(
                  ([key, value]: [string, string], idx: number) => (
                    <Text key={idx}>
                      {key}: {value}
                    </Text>
                  )
                )}
              </Space>
            </Card>
          ))}
        </Space>
      ) : (
        <Text type="secondary">Нет значений активностей</Text>
      )}
    </Show>
  );
};
