import {
  useDataProvider,
  Create,
  SimpleForm,
  TextInput,
  required,
  DateTimeInput,
  RadioButtonGroupInput,
  ArrayInput,
  SimpleFormIterator,
} from "react-admin";
import { useNavigate } from "react-router";

export function EventCreate() {
  const navigate = useNavigate();
  const dataProvider = useDataProvider();

  const handleSave = async (inputData: any) => {
    try {
      const payload = {
        event_info: {
          name: inputData.name,
          description: inputData.description,
          start_time: inputData.start_time,
          end_time: inputData.end_time,
          location: inputData.location,
        },
        settings: {
          has_player_balance: inputData.has_player_balance,
          activities: inputData.activities.map((act: any) => ({
            name: act.name,
            act_vars: act.act_vars.map((v: any) => [v.key, v.type]),
          })),
          roles: inputData.roles.map((role: any) => ({
            name: role.name,
            activities_values: role.activities_values.map((av: any) => ({
              name: av.name,
              act_vars: av.act_vars.map((v: any) => [
                v.key,
                JSON.parse(v.value),
              ]),
            })),
          })),
        },
        reg_form: {},
      };

      const { data } = await dataProvider.postNewEvent(payload);

      navigate(-1);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Create title="Создать мероприятие">
      <SimpleForm onSubmit={handleSave}>
        <TextInput
          source="name"
          label="Название мероприятия"
          validate={required()}
        />
        <TextInput
          source="description"
          label="Описание"
          validate={required()}
        />
        <DateTimeInput
          source="start_time"
          label="Время начала"
          validate={required()}
          parse={(value) => (value ? new Date(value).toISOString() : null)}
        />
        <DateTimeInput
          source="end_time"
          label="Время окончания"
          validate={required()}
          parse={(value) => (value ? new Date(value).toISOString() : null)}
        />
        <TextInput
          source="location"
          label="Место проведения"
          validate={required()}
        />
        <RadioButtonGroupInput
          label="Выберите, будет ли у пользователя баланс"
          source="has_player_balance"
          choices={[
            { id: true, name: "Да" },
            { id: false, name: "Нет" },
          ]}
        />
        <ArrayInput source="activities" label="Активности">
          <SimpleFormIterator>
            <TextInput source="name" label="Название активности" />
            <ArrayInput source="act_vars" label="Переменные активности">
              <SimpleFormIterator>
                <TextInput source="key" label="Название переменной" />
                <TextInput source="type" label="Тип (bool или int)" />
              </SimpleFormIterator>
            </ArrayInput>
          </SimpleFormIterator>
        </ArrayInput>

        <ArrayInput source="roles" label="Роли">
          <SimpleFormIterator>
            <TextInput source="name" label="Название роли" />
            <ArrayInput source="activities_values" label="Значения активностей">
              <SimpleFormIterator>
                <TextInput source="name" label="Название активности" />
                <ArrayInput source="act_vars" label="Значения переменных">
                  <SimpleFormIterator>
                    <TextInput source="key" label="Название переменной" />
                    <TextInput
                      source="value"
                      label="Значение (true/false или число)"
                    />
                  </SimpleFormIterator>
                </ArrayInput>
              </SimpleFormIterator>
            </ArrayInput>
          </SimpleFormIterator>
        </ArrayInput>
      </SimpleForm>
    </Create>
  );
}
