import polyglotI18nProvider from "ra-i18n-polyglot";
import russianMessages from "ra-language-russian";
import { Admin, CustomRoutes, Resource } from "react-admin";
import { Route } from "react-router";
import authProvider from "../../api/auth-provider";
import { dataProvider } from "../../api/data-provider";
import { MyLayout } from "../../UI/MyLayout/MyLayout";
import { ActivityShow } from "../EventActivities/ActivityShow";
import { ActivitiesList } from "../EventActivities/ActivitiesList";
import { PlayerShow } from "../Players/PlayerShow";
import { PlayersList } from "../Players/PlayersList";
import { PlayersRegistrationPage } from "../Players/PlayersRegistrationPage";
import QRScanner from "../QRScanner/QRScanner";
import RequireAuth from "../RequireAuth/RequireAuth";
import { EventCreate } from "../Events/EventCreate";
import { EventEdit } from "../Events/EventEdit";
import { EventList } from "../Events/EventList";
import { EventShow } from "../Events/EventShow";
import { RoleShow } from "../Roles/RoleShow";
import { RolesList } from "../Roles/RolesList";
import { UserCreate } from "../Users/UserCreate";
import { UserEdit } from "../Users/UserEdit";
import { UserList } from "../Users/UserList";
import { UserShow } from "../Users/UserShow";

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
  "Регистрация прошла успешно!": "Регистрация прошла успешно!",
  "Ошибка при регистрации": "Ошибка при регистрации",
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
              <PlayersList />
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
              <ActivitiesList />
            </RequireAuth>
          }
        />
        <Route
          path="/events/:id/activities/:activity_id/show"
          element={
            <RequireAuth>
              <ActivityShow />
            </RequireAuth>
          }
        />
        <Route
          path="/events/:id/roles"
          element={
            <RequireAuth>
              <RolesList />
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
          element={<PlayersRegistrationPage />}
        />
      </CustomRoutes>
    </Admin>
  );
}

export default App;
