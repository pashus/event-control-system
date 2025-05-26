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
    TopToolbar,
    ExportButton,
    CreateButton,
    NumberField,
    Show,
    SimpleShowLayout,
    Button,
    Link,
    DateTimeInput,
    DateField,
} from 'react-admin';
import { useParams } from 'react-router';

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
                <NumberField source="id" label="ID" />
                <TextField source="name" label="Название мероприятия" />
                <TextField source="description" label="Описание" />
                <DateField source="start_time" label="Время начала" showTime />
                <DateField source="end_time" label="Время окончания" showTime />
                <TextField source="location" label="Место проведения" />
            </Datagrid>
        </List>
    )
}

export function EventShow() {
    const record = useRecordContext();
    const params = useParams();
    const eventId = params.id;

    if (!eventId) return <div>Мероприятие не найдено</div>;

    return (
        <Show>
            <SimpleShowLayout>
                <TextField source="name" label="Название" />
                <TextField source="description" label="Описание" />
                <DateField source="start_time" label="Начало" showTime />
                <DateField source="end_time" label="Окончание" showTime />
                <TextField source="location" label="Место" />
                
                <Button
                    component={Link}
                    to={`/events/${eventId}/players`}
                    label="Участники"
                    sx={{ marginTop: 2 }}
                />
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
                <DateTimeInput  
                    source="start_time" 
                    label="Время начала" 
                    validate={required()}
                    parse={value => value ? new Date(value).toISOString() : null}
                />
                <DateTimeInput  
                    source="end_time" 
                    label="Время окончания" 
                    validate={required()}
                    parse={value => value ? new Date(value).toISOString() : null}
                />
                <TextInput 
                    source="location" 
                    label="Место проведения" 
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
                <DateTimeInput  
                    source="start_time" 
                    label="Время начала" 
                    validate={required()}
                    parse={value => value ? new Date(value).toISOString() : null}
                />
                <DateTimeInput  
                    source="end_time" 
                    label="Время окончания" 
                    validate={required()}
                    parse={value => value ? new Date(value).toISOString() : null}
                />
                <TextInput 
                    source="location" 
                    label="Место проведения" 
                    validate={required()}
                />
            </SimpleForm>
        </Create>
    )
}
