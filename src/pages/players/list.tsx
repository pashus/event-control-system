import { BaseRecord, useDeleteMany } from "@refinedev/core";
import { useLocation, useNavigate, useParams } from "react-router";
import {
  CreateButton,
  DeleteButton,
  EditButton,
  List,
  useTable,
} from "@refinedev/antd";
import { Space, Table, Button } from "antd";
import ExcelImport from "@/components/ImportExcel/importExcel";
import { useState } from "react";
import { useItemsDelete } from "@/hooks/useItemsDelete";

export const PlayersList = () => {
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
    useItemsDelete("players", { parent: { resource: "events", id: eventId } });

  return (
    <List
      headerButtons={
        <>
          <CreateButton />
          <ExcelImport eventId={eventId!} />
          <Button
            danger
            onClick={itemsDelete}
            disabled={selectedRowKeys.length === 0}
            loading={isPending}
            style={{ marginLeft: 8 }}
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
        <Table.Column dataIndex="id" title="ID" />
        <Table.Column dataIndex="first_name" title="Имя" />
        <Table.Column dataIndex="last_name" title="Фамилия" />
        <Table.Column dataIndex="group_name" title="Номер группы" />
        <Table.Column dataIndex="is_present" title="Отмечен" />
        <Table.Column dataIndex="role_id" title="ID роли" />
        <Table.Column
          title="-"
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id} />
              <DeleteButton
                hideText
                size="small"
                recordItemId={record.id}
                meta={{ parent: { resource: "events", id: eventId } }}
              />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
