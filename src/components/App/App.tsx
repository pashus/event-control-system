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
import { EventRegistrationPage } from "../EventsPlayers/EventPlayersRegistration";
import { EventActivitiesList, ActivityShow } from "../EventActivities/EventActivities";
import { EventRolesList, RoleShow } from "../EventRoles/EventRoles";

const customRussianMessages = {
  ...russianMessages,
  "Создать мероприятие": "Создать мероприятие",
  "Добавить пользователя": "Добавить пользователя",
  "Ошибка авторизации": "Ошибка авторизации",
  "Ошибка при отметке": "Ошибка при отметке",
  "Участник успешно добавлен": "Участник успешно добавлен",
  "Пожалуйста, авторизуйтесь для продолжения работы":
    "Пожалуйста, авторизуйтесь для продолжения работы",
  "Участник отмечен": "Участник отмечен",
  "Участник не найден!": "Участник не найден!",
  "Ошибка при получении QR-кода": "Ошибка при получении QR-кода",
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
          path="/events/:id/activities"
          element={
            <RequireAuth>
              <EventActivitiesList />
            </RequireAuth>      
        }
        />
        <Route 
          path="/events/:id/activities/:activity_id/show"
          element={
            <RequireAuth>
              <ActivityShow/>
            </RequireAuth>      
        }
        />
        <Route 
          path="/events/:id/roles"
          element={
            <RequireAuth>
              <EventRolesList />
            </RequireAuth>      
        }
        />
        <Route 
          path="/events/:id/roles/:role_id/show"
          element={
            <RequireAuth>
              <RoleShow />
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
        <Route
          path="/events/:id/registration"
          element={<EventRegistrationPage />}
        ></Route>
      </CustomRoutes>
    </Admin>
  );
}

export default App;
