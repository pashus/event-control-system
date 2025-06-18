import russianMessages from "ra-language-russian";
import polyglotI18nProvider from "ra-i18n-polyglot";
import { Admin, CustomRoutes, Resource } from "react-admin";
import { EventList, EventEdit, EventCreate, EventShow } from "../Events/Events";
import { UserList, UserEdit, UserCreate, UserShow } from "../Users/Users";
import { dataProvider } from "../../api/data-provider";
import { MyLayout } from "../../UI/MyLayout/MyLayout";
import authProvider from "../../api/auth-provider";
import { Route } from "react-router";
import { EventPlayersList, PlayerShow } from "../EventsPlayers/EventsPlayers";
import QRScanner from "../QRScanner/QRScanner";
import RequireAuth from "../RequireAuth/RequireAuth";

const customRussianMessages = {
  ...russianMessages,
  "Создать мероприятие": "Создать мероприятие",
  "Добавить пользователя": "Добавить пользователя",
  "Ошибка авторизации": "Ошибка авторизации",
  "Ошибка при добавлении участника": "Ошибка при добавлении участника",
};
const i18nProvider = polyglotI18nProvider(() => customRussianMessages, "ru");

function App() {
  return (
    <Admin
      i18nProvider={i18nProvider}
      layout={MyLayout}
      dataProvider={dataProvider}
      authProvider={authProvider}
    >
      <Resource
        name="events"
        list={EventList}
        show={EventShow}
        edit={EventEdit}
        create={EventCreate}
      />
      <Resource
        name="users"
        list={UserList}
        show={UserShow}
        edit={UserEdit}
        create={UserCreate}
      />
      <CustomRoutes>
        <Route
          path="/events/:id/players"
          element={
            <RequireAuth>
              <EventPlayersList />
            </RequireAuth>
          }
        />
        <Route
          path="/events/:id/players/:player_id/show"
          element={
            <RequireAuth>
              <PlayerShow />
            </RequireAuth>
          }
        />
        <Route
          path="/qr-scanner"
          element={
            <RequireAuth>
              <QRScanner />
            </RequireAuth>
          }
        />
      </CustomRoutes>
    </Admin>
  );
}

export default App;
