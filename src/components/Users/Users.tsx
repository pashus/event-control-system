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
    NumberField
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
                sx={{
                    '& .MuiTableCell-root': {
                        paddingTop: '16px',
                        paddingBottom: '16px',
                    },
                }}
            >
                <NumberField source="id" label="ID" />
                <TextField source="fullName" label="Полное имя" />
                <TextField source="studyGroup" label="Учебная группа" />
                <EmailField source="email" label="Email-почта" />
                <TextField source="role" label="Роли" />
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
                <TextField source="role" label="Роли" />
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
                <SelectInput
                    source="role"
                    label="Роли"
                    choices={[
                        { id: 'admin', name: 'Admin' },
                        { id: 'user', name: 'User' },
                    ]}
                />
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
                <SelectInput
                    source="role"
                    label="Роли"
                    choices={[
                        { id: 'admin', name: 'Admin' },
                        { id: 'user', name: 'User' },
                    ]}
                />
            </SimpleForm>
        </Create>
    )
}


