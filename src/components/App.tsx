import russianMessages from 'ra-language-russian';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import { Admin, Resource } from "react-admin";
import { EventList, EventEdit, EventCreate, EventShow } from './Events/Events'
import { UserList, UserEdit, UserCreate, UserShow } from './Users/Users'
import { dataProvider } from "../api/data-provider";
import { MyLayout } from './UI/MyLayout/MyLayout';
import authProvider from '../api/auth-provider';
import { PlayerList, PlayerShow, PlayerCreate, PlayerEdit } from './Players/Players';
import { Route } from 'react-router';
import EventPlayersList from './Events/EventPlayersList';
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
                show={EventShow}
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
            <Resource
                name="events/:id/players"
                list={PlayerList}
                create={PlayerCreate}
                edit={PlayerEdit}
                show={PlayerShow}
                options={{ label: 'Участники' }}
            />

        </Admin>
    )
}

export default App