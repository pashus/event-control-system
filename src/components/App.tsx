import russianMessages from 'ra-language-russian';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import { Admin, Resource } from "react-admin";
import { EventList, EventEdit, EventCreate } from './Events/Events'
import { UserList, UserEdit, UserCreate } from './Users/Users'
import { dataProvider } from "../api/data-provider";
import { MyLayout } from './UI/MyLayout/MyLayout';

const i18nProvider = polyglotI18nProvider(() => russianMessages, 'ru');

function App() {
    return (
        <Admin
            i18nProvider={i18nProvider}
            dataProvider={dataProvider}
            layout={MyLayout}
        >
            <Resource
                name='events' 
                list={EventList} 
                edit={EventEdit} 
                create={EventCreate}
            />
            <Resource
                name='users'
                list={UserList} 
                edit={UserEdit} 
                create={UserCreate}
            />
        </Admin>
    )
}

export default App