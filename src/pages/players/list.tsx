import { useMany, type BaseRecord } from "@refinedev/core";
import { useLocation, useNavigate, useParams } from "react-router";
import { DeleteButton, EditButton, List, useTable } from "@refinedev/antd";
import { Space, Table } from "antd";
import { CheckCircleTwoTone, CloseCircleTwoTone } from "@ant-design/icons";

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

  const { data: rolesData, isLoading: isRolesLoading } = useMany({
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
        loading={isRolesLoading}
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
