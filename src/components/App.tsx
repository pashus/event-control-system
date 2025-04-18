import russianMessages from 'ra-language-russian';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import { Admin, Resource } from "react-admin";
import { EventList, EventEdit, EventCreate } from './Events/Event'
import { dataProvider } from "../api/data-provider";
import { EventNote } from '@mui/icons-material';

const i18nProvider = polyglotI18nProvider(() => russianMessages, 'ru');

function App() {
    return (
        <Admin
            i18nProvider={i18nProvider}
            dataProvider={dataProvider}
        >
            <Resource
                name='events' 
                list={EventList} 
                edit={EventEdit} 
                create={EventCreate}
                icon={EventNote} 
            />
        </Admin>
    )
}

export default App