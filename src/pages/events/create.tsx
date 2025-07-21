import { ICreateEventValues } from "@/types";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Create, useForm } from "@refinedev/antd";
import { Button, Card, DatePicker, Form, Input, Radio, Space } from "antd";

export const EventCreate = () => {
  const { formProps, saveButtonProps, onFinish, formLoading } =
    useForm<ICreateEventValues>({
      // onMutationSuccess: (data, variables) => {
      //   console.log("ОТПРАВИЛОСЬ: ", { data, variables });
      // },
      // onMutationError: (data, variables) => {
      //   console.log("НЕ ОТПРАВИЛОСЬ: ", { data, variables });
      // },
      successNotification: (data) => {
        return {
          message: `Мероприятие ${data?.data.name} успешно создано`,
          type: "success",
        };
      },
      errorNotification: () => {
        return {
          message: "Ошибка при создании мероприятия",
          type: "error",
        };
      },
    });

  const handleOnFinish = (values: ICreateEventValues) => {
    /**
     * Тут ставится пустой массив если поля незаполнены
     */

    const activities = (values.activities || []).map((activity) => ({
      ...activity,
      act_vars: activity.act_vars ?? [],
    }));

    const roles = (values.roles || []).map((role) => ({
      ...role,
      activities_values: (role.activities_values || []).map((activity) => ({
        ...activity,
        act_vars: activity.act_vars ?? [],
      })),
    }));

    onFinish({
      event_info: {
        name: values.name,
        description: values.description,
        start_time: values.start_time,
        end_time: values.end_time,
        location: values.location,
      },
      settings: {
        has_player_balance: values.has_player_balance || false,
        activities,
        roles,
      },
      reg_form: {},
    });
  };

  //надо потом дотипизировать
  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form
        {...formProps}
        layout="vertical"
        onFinish={handleOnFinish}
        isLoading={formLoading}
      >
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
        <Form.Item
          label={"Описание"}
          name="description"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input.TextArea autoSize={{ minRows: 4 }} />
        </Form.Item>
        <Form.Item
          label={"Время начала"}
          name="start_time"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <DatePicker showTime />
        </Form.Item>
        <Form.Item
          label={"Время окончания"}
          name="end_time"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <DatePicker showTime />
        </Form.Item>
        <Form.Item
          label={"Место проведения"}
          name="location"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={"Выберите, будет ли у пользователя баланс"}
          name="has_player_balance"
          // initialValue={false}
        >
          <Radio.Group
            options={[
              { value: true, label: "Да" },
              { value: false, label: "Нет" },
            ]}
          />
        </Form.Item>
        <Form.List initialValue={[]} name="activities">
          {(fields, { add, remove }) => (
            <Card
              title="Активности"
              bordered={true}
              style={{ marginBottom: 24 }}
            >
              {fields.map(({ key, name, ...restField }) => (
                <Card
                  key={key}
                  type="inner"
                  size="small"
                  title={`Активность ${name + 1}`}
                  style={{ marginBottom: 12 }}
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

                  <Form.List name={[name, "act_vars"]}>
                    {(varFields, { add: addVar, remove: removeVar }) => (
                      <>
                        {varFields.map(
                          ({ key: varKey, name: varName, ...varRest }) => (
                            <Space
                              key={varKey}
                              direction="horizontal"
                              style={{ display: "flex", marginBottom: 8 }}
                              align="baseline"
                            >
                              <Form.Item
                                {...varRest}
                                name={[varName, 0]}
                                label="Название переменной"
                                rules={[{ required: true }]}
                              >
                                <Input />
                              </Form.Item>
                              <Form.Item
                                {...varRest}
                                name={[varName, 1]}
                                label="Тип"
                                rules={[{ required: true }]}
                              >
                                <Input placeholder="bool или int" />
                              </Form.Item>
                              <MinusCircleOutlined
                                onClick={() => removeVar(varName)}
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
        <Form.List initialValue={[]} name="roles">
          {(fields, { add, remove }) => (
            <Card title="Роли" bordered={true}>
              {fields.map(({ key, name, ...restField }) => (
                <Card
                  key={key}
                  type="inner"
                  size="small"
                  title={`Роль ${name + 1}`}
                  style={{ marginBottom: 16 }}
                  extra={<MinusCircleOutlined onClick={() => remove(name)} />}
                >
                  <Form.Item
                    {...restField}
                    name={[name, "name"]}
                    label="Название роли"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.List name={[name, "activities_values"]}>
                    {(
                      activityFields,
                      { add: addActivity, remove: removeActivity }
                    ) => (
                      <>
                        {activityFields.map(
                          ({ key: aKey, name: aName, ...aRest }) => (
                            <Card
                              key={aKey}
                              type="inner"
                              size="small"
                              title={`Активность ${aName + 1}`}
                              style={{ marginBottom: 12 }}
                              extra={
                                <MinusCircleOutlined
                                  onClick={() => removeActivity(aName)}
                                />
                              }
                            >
                              <Form.Item
                                {...aRest}
                                name={[aName, "name"]}
                                label="Название активности"
                                rules={[{ required: true }]}
                              >
                                <Input />
                              </Form.Item>

                              <Form.List name={[aName, "act_vars"]}>
                                {(
                                  varFields,
                                  { add: addVar, remove: removeVar }
                                ) => (
                                  <>
                                    {varFields.map(
                                      ({
                                        key: vKey,
                                        name: vName,
                                        ...vRest
                                      }) => (
                                        <Space
                                          key={vKey}
                                          style={{
                                            display: "flex",
                                            marginBottom: 8,
                                          }}
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
                          )
                        )}
                        <Form.Item>
                          <Button
                            type="dashed"
                            onClick={() => addActivity()}
                            block
                            icon={<PlusOutlined />}
                          >
                            Добавить активность
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
                  Добавить роль
                </Button>
              </Form.Item>
            </Card>
          )}
        </Form.List>
      </Form>
    </Create>
  );
};
