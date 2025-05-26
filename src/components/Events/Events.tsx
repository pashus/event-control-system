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
    FunctionField,
    TopToolbar,
    ExportButton,
    CreateButton,
    NumberField,
    CheckboxGroupInput,
    Show,
    SimpleShowLayout,
    TimeInput
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
                size='medium'
            >
                <NumberField source="id" label="ID"  />
                <TextField source="name" label="Название мероприятия"  />
                <TextField source='description' label="Описание" />
                <TextField source="startTime" label="Время начала" />
                <TextField source="entryType" label="Тип входа" />
                <TextField source="location" label="Место проведения" />
            </Datagrid>
        </List>
    )
}

export function EventShow() {
    return (
        <Show title={<EventEditTitle />}>
            <SimpleShowLayout>
            <TextField source="name" label="Название мероприятия"  />
                <DateField source="date" label="Дата" />
                <TextField source="location" label="Место проведения" />
                <TextField source="startTime" label="Время начала" />
                <TextField source="entryType" label="Тип входа" />
            </SimpleShowLayout>
        </Show>
    );
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
                <TextInput
                    source="description" 
                    label="Описание" 
                    validate={required()} 
                />
                <TimeInput  
                    source="startTime" 
                    label="Время начала" 
                    validate={required()}
                />
                <TimeInput  
                    source="endTime" 
                    label="Время конца" 
                    validate={required()}
                />
                <TextInput 
                    source="location" 
                    label="Место проведения" 
                    validate={required()}
                />
                <CheckboxGroupInput
                    source="entryType"
                    label="Тип входа"
                    choices={[
                        { id: 'qr', name: 'QR' },
                        { id: 'nfc', name: 'NFC' },
                    ]}
                    validate={required()}
                />
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
                <TextInput
                    source="description" 
                    label="Описание" 
                    validate={required()} 
                />
                <TimeInput
                    source="startTime" 
                    label="Время начала" 
                    validate={required()}
                />
                <TimeInput
                    source="endTime" 
                    label="Время конца" 
                    validate={required()}
                />
                <TextInput 
                    source="location" 
                    label="Место проведения" 
                    validate={required()}
                />
                <CheckboxGroupInput
                    source="entryType"
                    label="Тип входа"
                    choices={[
                        { id: 'qr', name: 'QR' },
                        { id: 'nfc', name: 'NFC' },
                    ]}
                    validate={required()}
                />
            </SimpleForm>
        </Create>
    )
}
