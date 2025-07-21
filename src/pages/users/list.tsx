import { useResource, type BaseRecord } from "@refinedev/core";
import { useNavigate } from "react-router";
import { DeleteButton, EditButton, List, useTable } from "@refinedev/antd";
import { Space, Table } from "antd";

export const UsersList = () => {
  const navigate = useNavigate();
  const { resource } = useResource();

  const { tableProps } = useTable({
    syncWithLocation: true,
  });

  return (
    <List>
      <Table
        {...tableProps}
        rowKey="id"
        onRow={(record) => ({
          onClick: (event) => {
            /**
             * Тут скорее всего надо будет изменять
             */
            if ((event.target as HTMLElement).closest(".ant-btn")) {
              return;
            }
            navigate(`/${resource?.name}/show/${record.id}`);
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
          title={"Actions"}
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
