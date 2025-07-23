import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Create, useForm } from "@refinedev/antd";
import { Button, Card, Form, Input, Space } from "antd";
import { useParams } from "react-router";

export const RoleCreate = () => {
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
        message: `Активность ${data?.data.name} успешно добавлена`,
        type: "success",
      };
    },
    errorNotification: () => {
      return {
        message: "Ошибка при добавлении активности",
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
    <Create saveButtonProps={saveButtonProps} isLoading={formLoading}>
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
        <Form.List name="activities_values" initialValue={[]}>
          {(fields, { add, remove }) => (
            <Card title="Активности" variant="outlined">
              {fields.map(({ key, name, ...restField }) => (
                <Card
                  key={key}
                  type="inner"
                  size="small"
                  title={`Активность ${name + 1}`}
                  style={{ marginBottom: 16 }}
                  extra={<MinusCircleOutlined onClick={() => remove(name)} />}
                >
                  <Form.Item
                    {...restField}
                    name={[name, "name"]}
                    label="Название активности"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.List name={[name, "act_vars"]} initialValue={[]}>
                    {(varFields, { add: addVar, remove: removeVar }) => (
                      <>
                        {varFields.map(
                          ({ key: vKey, name: vName, ...vRest }) => (
                            <Space
                              key={vKey}
                              style={{ display: "flex", marginBottom: 8 }}
                              align="baseline"
                            >
                              <Form.Item
                                {...vRest}
                                name={[vName, 0]}
                                label="Название переменной"
                                rules={[{ required: true }]}
                              >
                                <Input />
                              </Form.Item>
                              <Form.Item
                                {...vRest}
                                name={[vName, 1]}
                                label="Значение"
                                rules={[{ required: true }]}
                              >
                                <Input placeholder="true/false или число" />
                              </Form.Item>
                              <MinusCircleOutlined
                                onClick={() => removeVar(vName)}
                              />
                            </Space>
                          )
                        )}
                        <Form.Item>
                          <Button
                            type="dashed"
                            onClick={() => addVar()}
                            block
                            icon={<PlusOutlined />}
                          >
                            Добавить переменную
                          </Button>
                        </Form.Item>
                      </>
                    )}
                  </Form.List>
                </Card>
              ))}

              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Добавить активность
                </Button>
              </Form.Item>
            </Card>
          )}
        </Form.List>
      </Form>
    </Create>
  );
};
