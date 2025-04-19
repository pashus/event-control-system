import russianMessages from 'ra-language-russian';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import { Admin, Resource } from "react-admin";
import { EventList, EventEdit, EventCreate } from './Events/Events'
import { UserList, UserEdit, UserCreate, UserShow } from './Users/Users'
import { dataProvider } from "../api/data-provider";
import { MyLayout } from './UI/MyLayout/MyLayout';
import authProvider from '../api/auth-provider';

const i18nProvider = polyglotI18nProvider(() => russianMessages, 'ru');

function App() {
    return (
        <Admin
            i18nProvider={i18nProvider}
            layout={MyLayout}
            dataProvider={dataProvider}
            authProvider={authProvider}
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
                show={UserShow} 
                edit={UserEdit} 
                create={UserCreate}
            />
        </Admin>
    )
}

export default App