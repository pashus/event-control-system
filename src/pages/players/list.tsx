import { useResource, type BaseRecord } from "@refinedev/core";
import { useNavigate, useParams } from "react-router";
import { DeleteButton, EditButton, List, useTable } from "@refinedev/antd";
import { Space, Table } from "antd";

export const PlayersList = () => {
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
        <Table.Column dataIndex="first_name" title={"Имя"} />
        <Table.Column dataIndex="last_name" title={"Фамилия"} />
        <Table.Column dataIndex="group_name" title={"Номер группы"} />
        <Table.Column dataIndex="is_present" title={"Отмечен"} />
        <Table.Column dataIndex="role_id" title={"ID роли"} />
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
