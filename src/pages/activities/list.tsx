import { type BaseRecord } from "@refinedev/core";
import { useLocation, useNavigate, useParams } from "react-router";
import { DeleteButton, EditButton, List, useTable } from "@refinedev/antd";
import { Space, Table, Typography } from "antd";

const { Text } = Typography;

export const ActivitiesList = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const location = useLocation();

  const { tableProps } = useTable({
    syncWithLocation: true,
    meta: {
      parent: {
        resource: "events",
        id: eventId,
      },
    },
  });

  return (
    <List>
      <Table
        {...tableProps}
        rowKey="id"
        onRow={(record) => ({
          onClick: (event) => {
            if ((event.target as HTMLElement).closest(".ant-btn")) {
              return;
            }
            navigate(`${location.pathname}/show/${record.id}`);
          },
          style: { cursor: "pointer" },
        })}
      >
        <Table.Column dataIndex="id" title={"ID"} />
        <Table.Column dataIndex="name" title={"Название"} />
        <Table.Column
          dataIndex="act_vars"
          title={"Переменные"}
          render={(actVars: [string, string][]) => (
            <Space direction="vertical">
              {actVars?.map(([key, value], index) => (
                <Text key={index}>
                  {key}: {value}
                </Text>
              ))}
            </Space>
          )}
        />
        <Table.Column
          title={"-"}
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id} />
              <DeleteButton
                hideText
                size="small"
                recordItemId={record.id}
                meta={{
                  parent: {
                    resource: "events",
                    id: eventId,
                  },
                }}
              />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
