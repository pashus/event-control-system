import { type BaseRecord } from "@refinedev/core";
import { useLocation, useNavigate } from "react-router";
import {
  CreateButton,
  DeleteButton,
  EditButton,
  List,
  useTable,
} from "@refinedev/antd";
import { Button, Space, Table } from "antd";
import { useItemsDelete } from "@/hooks/useItemsDelete";

export const UsersList = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { rowSelection, itemsDelete, selectedRowKeys, isPending } =
    useItemsDelete("events");

  const { tableProps } = useTable({
    syncWithLocation: true,
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
        rowKey="id"
        rowSelection={rowSelection}
        onRow={(record) => ({
          onClick: (event) => {
            /**
             * Тут скорее всего надо будет изменять
             */
            if ((event.target as HTMLElement).closest(".ant-btn")) {
              return;
            }
            navigate(`${location.pathname}/show/${record.id}`);
          },
          style: { cursor: "pointer" },
        })}
      >
        <Table.Column dataIndex="id" title={"ID"} />
        <Table.Column dataIndex="username" title={"Имя пользователя"} />
        <Table.Column
          dataIndex="email"
          title={"Почта"}
          render={(email: string) => (email ? email : "-")}
        />
        <Table.Column
          title={"-"}
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
              <EditButton
                disabled
                hideText
                size="small"
                recordItemId={record.id}
              />
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
