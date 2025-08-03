import { type BaseRecord } from "@refinedev/core";
import { useLocation, useNavigate, useParams } from "react-router";
import {
  CreateButton,
  DeleteButton,
  EditButton,
  List,
  useTable,
} from "@refinedev/antd";
import { Button, Space, Table, Typography } from "antd";
import { useItemsDelete } from "@/hooks/useItemsDelete";

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

  const { rowSelection, itemsDelete, selectedRowKeys, isPending } =
    useItemsDelete("activities", {
      parent: { resource: "events", id: eventId },
    });

  return (
    <List
      headerButtons={
        <>
          <CreateButton />
          <Button
            danger
            onClick={itemsDelete}
            disabled={selectedRowKeys.length === 0}
            loading={isPending}
          >
            Удалить выбранные ({selectedRowKeys.length})
          </Button>
        </>
      }
    >
      <Table
        {...tableProps}
        rowSelection={rowSelection}
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
              {Array.isArray(actVars) ? (
                actVars.map(([key, value], index) => (
                  <Text key={index}>
                    {key}: {value}
                  </Text>
                ))
              ) : (
                <Text type="secondary">Нет данных</Text>
              )}
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
