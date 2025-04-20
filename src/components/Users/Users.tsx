import {
    required,
    useRecordContext,
    List,
    Datagrid,
    TextField,
    Edit,
    SimpleForm,
    TextInput,
    Create,
    SelectInput,
    TopToolbar,
    CreateButton,
    ExportButton,
    Show,
    SimpleShowLayout,
    EmailField,
    NumberField,
    ArrayField,
    FunctionField,
    ReferenceField,
    ArrayInput,
    SimpleFormIterator,
    CheckboxGroupInput,
    ReferenceInput
} from 'react-admin';
import UserImportButton from './UserImportButton';
import { QRCodeField } from '../QRCodeField/QRCodeField';

function UserListActions() {
    return (
        <TopToolbar>
            <CreateButton label='Добавить пользователя' />
            <UserImportButton />
            <ExportButton />
        </TopToolbar>
    );
}

function UserShowEditTitle() {
    const record = useRecordContext<{ fullName?: string }>();
    return <span>Пользователь {record?.fullName ?? ''}</span>;
};

export function UserList() {
    return (
        <List actions={<UserListActions />} title="Пользователи" perPage={50}>
            <Datagrid
                size='medium'
            >
                <NumberField source="id" label="ID" />
                <TextField source="fullName" label="Полное имя" />
                <TextField source="studyGroup" label="Учебная группа" />
                <EmailField source="email" label="Email-почта" />
                <QRCodeField source="id" label="QR" />
            </Datagrid>
        </List>
    )
}

export function UserShow() {
    return (
        <Show title={<UserShowEditTitle />}>
            <SimpleShowLayout>
                <TextField source="fullName" label="ФИО" />
                <TextField source="studyGroup" label="Группа" />
                <EmailField source="email" label="Email" />
                <ArrayField source="roles" label="Роли на мероприятиях">
                    <Datagrid bulkActionButtons={false} rowClick={false}>
                        <ReferenceField source="eventId" reference="events" label="Мероприятие">
                            <TextField source="name" />
                        </ReferenceField>
                        <FunctionField
                            source="roles"
                            label="Роли"
                            render={record => record.roles.join(', ')}
                        />
                    </Datagrid>
                </ArrayField>
                <QRCodeField source="id" label="QR‑код для входа" />
            </SimpleShowLayout>
        </Show>
    );
}

export function UserEdit() {
    return (
        <Edit title={<UserShowEditTitle />}>
            <SimpleForm>
                <TextInput
                    source="fullName"
                    label="Полное имя"
                    validate={required()}
                />
                <TextInput
                    source="studyGroup"
                    label="Учебная группа"
                    validate={required()}
                />
                <TextInput
                    source="email"
                    label="Email-почта"
                    validate={required()}
                />
                <ArrayInput source="roles" label="Роли пользователя">
                    <SimpleFormIterator>
                        <ReferenceInput
                            source="eventId"
                            reference="events"
                            label="Мероприятие"
                        >
                            <SelectInput validate={required()} label="Выберите мероприятие" optionText="name" />
                        </ReferenceInput>
                        <CheckboxGroupInput
                            source="roles"
                            label="Роли"
                            choices={[
                                { id: 'участник', name: 'Участник' },
                                { id: 'организатор', name: 'Организатор' },
                                { id: 'куратор', name: 'Куратор' },
                            ]}
                            validate={required()}
                        />
                    </SimpleFormIterator>
                </ArrayInput>
            </SimpleForm>
        </Edit>
    )
}

export function UserCreate() {
    return (
        <Create redirect="list" title="Добавить пользователя">
            <SimpleForm>
                <TextInput
                    source="fullName"
                    label="Полное имя"
                    validate={required()}
                />
                <TextInput
                    source="studyGroup"
                    label="Учебная группа"
                    validate={required()}
                />
                <TextInput
                    source="email"
                    label="Email-почта"
                    validate={required()}
                />
                <ArrayInput source="roles" label="Роли пользователя">
                    <SimpleFormIterator>
                        <ReferenceInput
                            source="eventId"
                            reference="events"
                            label="Мероприятие"
                        >
                            <SelectInput validate={required()} label="Выберите мероприятие" optionText="name" />
                        </ReferenceInput>
                        <CheckboxGroupInput
                            source="roles"
                            label="Роли"
                            choices={[
                                { id: 'участник', name: 'Участник' },
                                { id: 'организатор', name: 'Организатор' },
                                { id: 'куратор', name: 'Куратор' },
                            ]}
                            validate={required()}
                        />
                    </SimpleFormIterator>
                </ArrayInput>
            </SimpleForm>
        </Create>
    )
}


