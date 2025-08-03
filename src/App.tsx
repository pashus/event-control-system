import { Authenticated, Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import {
  ErrorComponent,
  ThemedLayoutV2,
  ThemedSiderV2,
  useNotificationProvider,
} from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";

import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";

import { App as AntdApp } from "antd";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";

import {
  CalendarOutlined,
  QrcodeOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { authProvider } from "@/providers/authProvider";
import { AppIcon } from "@/components/app-icon";
import { Header } from "@/components/header";
import { ColorModeContextProvider } from "@/contexts/color-mode";
import customDataProvider from "@/providers/customDataProvider";

import { EventCreate, EventEdit, EventShow, EventsList } from "@/pages/events";
import {
  PlayerCreate,
  PlayerEdit,
  PlayerShow,
  PlayersList,
} from "@/pages/players";
import { UserCreate, UserEdit, UserShow, UsersList } from "@/pages/users";
import { Login } from "@/pages/login";
import { RegistrationForm } from "@/pages/registration";
import { ruI18nProvider } from "@/providers/ruI18nProvider";
import {
  ActivitiesList,
  ActivityCreate,
  ActivityEdit,
  ActivityShow,
} from "@/pages/activities";
import { RolesList, RoleCreate, RoleEdit, RoleShow } from "@/pages/roles";
import { QrScanner } from "@/pages/qr-scanner";
import { VolunteerActivityPage } from "./pages/volunteer-activity/volunteer-activity";

const customTitleHandler = () => {
  return "Система контроля мероприятия";
};

const CustomRegistrationHeader = () => {
  return <div />;
};

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <AntdApp>
            <DevtoolsProvider>
              <Refine
                i18nProvider={ruI18nProvider}
                dataProvider={customDataProvider}
                notificationProvider={useNotificationProvider}
                authProvider={authProvider}
                routerProvider={routerBindings}
                resources={[
                  {
                    name: "events",
                    list: "/events",
                    create: "/events/create",
                    edit: "/events/edit/:id",
                    show: "/events/show/:id",
                    meta: { canDelete: true, label: "Мероприятия" },
                    icon: <CalendarOutlined />,
                  },
                  {
                    name: "users",
                    list: "/users",
                    create: "/users/create",
                    edit: "/users/edit/:id",
                    show: "/users/show/:id",
                    meta: { canDelete: true, label: "Пользователи" },
                    icon: <UserOutlined />,
                  },
                  {
                    name: "qr-scanner",
                    list: "/qr-scanner",
                    meta: { canDelete: true, label: "QR-сканнер" },
                    icon: <QrcodeOutlined />,
                  },
                  {
                    name: "players",
                    list: "/events/:eventId/players",
                    create: "/events/:eventId/players/create",
                    edit: "/events/:eventId/players/edit/:id",
                    show: "/events/:eventId/players/show/:id",
                    meta: { canDelete: true, parent: "events", hide: true },
                  },
                  {
                    name: "activities",
                    list: "/events/:eventId/activities",
                    create: "/events/:eventId/activities/create",
                    edit: "/events/:eventId/activities/edit/:id",
                    show: "/events/:eventId/activities/show/:id",
                    meta: { canDelete: true, parent: "events", hide: true },
                  },
                  {
                    name: "roles",
                    list: "/events/:eventId/roles",
                    create: "/events/:eventId/roles/create",
                    edit: "/events/:eventId/roles/edit/:id",
                    show: "/events/:eventId/roles/show/:id",
                    meta: { canDelete: true, parent: "events", hide: true },
                  },
                  {
                    name: "volunteer-activity",
                    meta: { canDelete: true, parent: "events", hide: true },
                  },
                ]}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  useNewQueryKeys: true,
                  projectId: "dUhZC0-eQiUVJ-Uf8gLR",
                  title: {
                    text: "Система контроля мероприятий",
                    icon: <AppIcon />,
                  },
                }}
              >
                <Routes>
                  {/* Приватные маршруты (требуют токена) */}
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-inner"
                        fallback={<CatchAllNavigate to="/login" />}
                      >
                        <ThemedLayoutV2
                          Header={Header}
                          Sider={(props) => (
                            <ThemedSiderV2
                              {...props}
                              fixed
                              // render={({ items, logout }) => (
                              //   <div
                              //     style={{
                              //       display: "flex",
                              //       flexDirection: "column",
                              //       height: "100%",
                              //     }}
                              //   >
                              //     <div style={{ flexGrow: 1 }}>{items}</div>
                              //     <div>{logout}</div>
                              //   </div>
                              // )}
                            />
                          )}
                        >
                          <Outlet />
                        </ThemedLayoutV2>
                      </Authenticated>
                    }
                  >
                    <Route
                      index
                      element={<NavigateToResource resource="events" />}
                    />

                    {/* Users */}
                    <Route path="/users">
                      <Route index element={<UsersList />} />
                      <Route path="create" element={<UserCreate />} />
                      <Route path="edit/:id" element={<UserEdit />} />
                      <Route path="show/:id" element={<UserShow />} />
                    </Route>

                    {/* Events */}
                    <Route path="/events">
                      <Route index element={<EventsList />} />
                      <Route path="create" element={<EventCreate />} />
                      <Route path="edit/:id" element={<EventEdit />} />
                      <Route path="show/:id" element={<EventShow />} />

                      {/* Players */}
                      <Route path=":eventId/players">
                        <Route index element={<PlayersList />} />
                        <Route path="create" element={<PlayerCreate />} />
                        <Route path="edit/:id" element={<PlayerEdit />} />
                        <Route path="show/:id" element={<PlayerShow />} />
                      </Route>

                      {/* Activities */}
                      <Route path=":eventId/activities">
                        <Route index element={<ActivitiesList />} />
                        <Route path="create" element={<ActivityCreate />} />
                        <Route path="edit/:id" element={<ActivityEdit />} />
                        <Route path="show/:id" element={<ActivityShow />} />
                      </Route>

                      {/* Roles */}
                      <Route path=":eventId/roles">
                        <Route index element={<RolesList />} />
                        <Route path="create" element={<RoleCreate />} />
                        <Route path="edit/:id" element={<RoleEdit />} />
                        <Route path="show/:id" element={<RoleShow />} />
                      </Route>

                      <Route path=":eventId/volunteer-activity">
                        <Route index element={<VolunteerActivityPage />} />
                      </Route>
                    </Route>

                    <Route path="/qr-scanner" element={<QrScanner />} />
                    <Route path="*" element={<ErrorComponent />} />
                  </Route>

                  {/* Публичные маршруты */}
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-outer"
                        fallback={<Outlet />}
                      >
                        <NavigateToResource />
                      </Authenticated>
                    }
                  >
                    <Route path="/login" element={<Login />} />
                  </Route>
                  <Route
                    path="/events/:eventId/registration-form"
                    element={
                      <ThemedLayoutV2
                        Header={CustomRegistrationHeader}
                        Sider={() => null}
                      >
                        <RegistrationForm />
                      </ThemedLayoutV2>
                    }
                  />
                </Routes>

                <RefineKbar />
                <UnsavedChangesNotifier />
                <DocumentTitleHandler handler={customTitleHandler} />
              </Refine>
              <DevtoolsPanel />
            </DevtoolsProvider>
          </AntdApp>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
