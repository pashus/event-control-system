import { type BaseRecord } from "@refinedev/core";
import { useLocation, useNavigate, useParams } from "react-router";
import { DeleteButton, EditButton, List, useTable } from "@refinedev/antd";
import { Space, Table } from "antd";

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
