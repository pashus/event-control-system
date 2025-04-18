import {
    required,
    useRecordContext,
    List,
    Datagrid,
    TextField,
    DateField,
    Edit,
    SimpleForm,
    TextInput,
    DateInput,
    Create,
    SelectInput,
    FunctionField,
    TimeInput,
    TopToolbar,
    ExportButton,
    CreateButton
} from 'react-admin';

function EventListActions(): React.ReactElement {
    return (
        <TopToolbar>
            <CreateButton label='Создать мероприятие'/>
            <ExportButton />
        </TopToolbar>
    );
}

function EventEditTitle() {
    const record = useRecordContext<{ name?: string }>();
    return <span>Мероприятие {record?.name ?? ''}</span>;
};

export function EventList() {
    return (
        <List actions={<EventListActions />} title="Мероприятия">
            <Datagrid
                sx={{
                    '& .MuiTableCell-root': {
                        paddingTop: '16px',
                        paddingBottom: '16px',
                    },
                }}
            >
                <TextField source='name' label="Название мероприятия"  />
                <DateField source='date' label="Дата" />
                <TextField source="location" label="Место проведения" />
                <TextField source="startTime" label="Время начала" />
                <TextField source="entryType" label="Тип входа" />
                <FunctionField
                    label="Регистрация"
                    render={record => (
                        <a 
                            href={record.registrationLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                        >
                            Перейти
                        </a>
                    )}
                />
            </Datagrid>
        </List>
    )
}

export function EventEdit() {
    return (
        <Edit title={<EventEditTitle />}>
            <SimpleForm>
                <TextInput
                    source="name" 
                    label="Название мероприятия" 
                    validate={required()} 
                />
                <DateInput 
                    source="date" 
                    label="Дата" 
                    validate={required()}
                />
                <TextInput 
                    source="location" 
                    label="Место проведения" 
                    validate={required()}
                />
                <TimeInput 
                    source="startTime" 
                    label="Время начала" 
                    validate={required()}
                />
                <SelectInput
                    source="entryType"
                    label="Тип входа"
                    choices={[
                        { id: 'qr', name: 'QR' },
                        { id: 'nfc', name: 'NFC' },
                    ]}
                    validate={required()}
                />
                <TextInput source="registrationLink" label="Ссылка на регистрацию" />
            </SimpleForm>
        </Edit>
    )
}
    
export function EventCreate() {
    return (
        <Create redirect="list" title="Создать мероприятие">
            <SimpleForm>
                <TextInput
                    source="name" 
                    label="Название мероприятия" 
                    validate={required()} 
                />
                <DateInput 
                    source="date" 
                    label="Дата" 
                    validate={required()}
                />
                <TextInput 
                    source="location" 
                    label="Место проведения" 
                    validate={required()}
                />
                <TimeInput 
                    source="startTime" 
                    label="Время начала" 
                    validate={required()}
                />
                <SelectInput
                    source="entryType"
                    label="Тип входа"
                    choices={[
                        { id: 'qr', name: 'QR' },
                        { id: 'nfc', name: 'NFC' },
                    ]}
                    validate={required()}
                />
                <TextInput source="registrationLink" label="Ссылка на регистрацию" />
            </SimpleForm>
        </Create>
    )
}
