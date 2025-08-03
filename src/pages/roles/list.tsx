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

export const RolesList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { eventId } = useParams();

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
    useItemsDelete("roles", { parent: { resource: "events", id: eventId } });

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
          dataIndex="activities_values"
          title={"Активности"}
          render={() => <Text>см. внутри</Text>}
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
