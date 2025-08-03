import { useMany, BaseRecord, useDeleteMany } from "@refinedev/core";
import { useLocation, useNavigate, useParams } from "react-router";
import {
  CreateButton,
  DeleteButton,
  EditButton,
  List,
  useTable,
} from "@refinedev/antd";
import { Space, Table, Button } from "antd";
import { CheckCircleTwoTone, CloseCircleTwoTone } from "@ant-design/icons";
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

  const roleIds =
    tableProps.dataSource?.map((item) => item.role_id).filter(Boolean) ?? [];

  const { data: rolesData } = useMany({
    resource: "roles",
    ids: roleIds,
    meta: {
      parent: {
        resource: "events",
        id: eventId,
      },
    },
    queryOptions: {
      enabled: roleIds.length > 0,
    },
  });

  const rolesMap = rolesData?.data.reduce((acc: any, role: any) => {
    if (role.id != null) {
      acc[role.id] = role.name;
    }
    return acc;
  }, {} as Record<number, string>);

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
        <Table.Column dataIndex="first_name" title={"Имя"} />
        <Table.Column dataIndex="last_name" title={"Фамилия"} />
        <Table.Column dataIndex="group_name" title={"Номер группы"} />
        <Table.Column
          dataIndex="is_present"
          title={"Отмечен"}
          render={(value: boolean) =>
            value ? (
              <CheckCircleTwoTone twoToneColor="#52c41a" />
            ) : (
              <CloseCircleTwoTone twoToneColor="#ff4d4f" />
            )
          }
        />
        <Table.Column
          dataIndex="role_id"
          title={"Роль"}
          render={(_, record: BaseRecord) => rolesMap?.[record.role_id] ?? "-"}
        />
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
