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
    CheckboxGroupInput
} from 'react-admin';
import { baseFormUrl } from '../../api/data-provider';

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
                <NumberField source="id" label="ID"  />
                <TextField source="name" label="Название мероприятия"  />
                <DateField source="date" label="Дата" />
                <TextField source="location" label="Место проведения" />
                <TextField source="startTime" label="Время начала" />
                <TextField source="entryType" label="Тип входа" />
                <FunctionField
                    label="Регистрация"
                    render={record => {
                        const url = `${baseFormUrl}?eventId=${record.id}`
                        return (
                            <a 
                                href={url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                onClick={e => e.stopPropagation()}
                            >
                                Перейти
                            </a>
                        )
                    }}
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
                <TextInput  
                    source="startTime" 
                    label="Время начала" 
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
                <TextInput  
                    source="startTime" 
                    label="Время начала" 
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
