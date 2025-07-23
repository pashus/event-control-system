import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Edit, useForm } from "@refinedev/antd";
import { Button, Form, Input, Space } from "antd";
import { useParams } from "react-router";

export const ActivityEdit = () => {
  const { eventId } = useParams();

  const { formProps, saveButtonProps, formLoading } = useForm({
    // onMutationSuccess: (data, variables) => {
    //   console.log("ОТПРАВИЛОСЬ: ", { data, variables });
    // },
    // onMutationError: (data, variables) => {
    //   console.log("НЕ ОТПРАВИЛОСЬ: ", { data, variables });
    // },
    successNotification: (data) => {
      return {
        message: `Активность ${data?.data.name} успешно отредактирована`,
        type: "success",
      };
    },
    errorNotification: () => {
      return {
        message: "Ошибка при редактировании активности",
        type: "error",
      };
    },
    meta: {
      parent: {
        resource: "events",
        id: eventId,
      },
    },
  });

  return (
    <Edit
      saveButtonProps={{ ...saveButtonProps }}
      isLoading={formLoading}
      headerButtons={() => <></>}
    >
      <Form {...formProps} layout="vertical">
        <Form.Item
          label={"Название"}
          name="name"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.List name="act_vars" initialValue={[]}>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space
                  key={key}
                  direction="horizontal"
                  style={{ display: "flex", marginBottom: 8 }}
                  align="baseline"
                >
                  <Form.Item
                    {...restField}
                    name={[name, 0]}
                    label="Название переменной"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 1]}
                    label="Тип"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="bool или int" />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}

              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Добавить переменную
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
    </Edit>
  );
};
