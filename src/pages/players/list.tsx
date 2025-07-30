import { type BaseRecord } from "@refinedev/core";
import { useLocation, useNavigate, useParams } from "react-router";
import {
  CreateButton,
  DeleteButton,
  EditButton,
  List,
  useTable,
} from "@refinedev/antd";
import { Space, Table } from "antd";
import { ExcelImport } from "@/components/Exel Import/exelImport";

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

  return (
    <List
      headerButtons={
        <>
          <CreateButton />
          <ExcelImport eventId={eventId!} />
        </>
      }
    >
      <Table
        rowSelection={{
          type: "checkbox",
        }}
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
