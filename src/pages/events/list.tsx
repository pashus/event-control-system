import {
  CreateButton,
  DateField,
  DeleteButton,
  EditButton,
  List,
  useTable,
} from "@refinedev/antd";
import { type BaseRecord } from "@refinedev/core";
import { Button, notification, Space, Table } from "antd";
import { useLocation, useNavigate } from "react-router";
import { useItemsDelete } from "@/hooks/useItemsDelete";

export const EventsList = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { tableProps } = useTable({
    syncWithLocation: true,
  });

  const { rowSelection, itemsDelete, selectedRowKeys, isPending } =
    useItemsDelete("events");

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
          onClick: (e) => {
            if ((e.target as HTMLElement).closest(".ant-btn")) return;
            navigate(`${location.pathname}/show/${record.id}`);
          },
          style: { cursor: "pointer" },
        })}
      >
        <Table.Column dataIndex="id" title={"ID"} />
        <Table.Column dataIndex="name" title={"Название"} />
        <Table.Column dataIndex="description" title={"Описание"} />
        <Table.Column
          dataIndex="start_time"
          title={"Время начала"}
          render={(value): any => (
            <DateField value={value} format="DD.MM.YYYY, HH:mm" />
          )}
        />
        <Table.Column
          dataIndex="end_time"
          title={"Время окончания"}
          render={(value): any => (
            <DateField value={value} format="DD.MM.YYYY, HH:mm" />
          )}
        />
        <Table.Column dataIndex="location" title={"Место проведения"} />
        <Table.Column
          title={"-"}
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id} />
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
