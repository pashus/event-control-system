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

import { CalendarOutlined, UserOutlined } from "@ant-design/icons";
import { authProvider } from "@/authProvider";
import { AppIcon } from "@/components/app-icon";
import { Header } from "@/components/header";
import { ColorModeContextProvider } from "@/contexts/color-mode";
import customDataProvider from "@/customDataProvider";
import { EventCreate, EventEdit, EventShow, EventsList } from "@/pages/events";
import {
  PlayerCreate,
  PlayerEdit,
  PlayerShow,
  PlayersList,
} from "@/pages/players";
import { UserCreate, UserEdit, UserShow, UsersList } from "@/pages/users";
import { Login } from "@/pages/login";
import { ruI18nProvider } from "@/ruI18nProvider";

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
                    meta: {
                      label: "Мероприятия",
                    },
                    icon: <CalendarOutlined />,
                  },
                  {
                    name: "users",
                    list: "/users",
                    create: "/users/create",
                    edit: "/users/edit/:id",
                    show: "/users/show/:id",
                    meta: {
                      label: "Пользователи",
                    },
                    icon: <UserOutlined />,
                  },
                  {
                    name: "players",
                    list: "/events/:id/players",
                    create: "/events/:id/players/create",
                    edit: "/events/:id/players/edit/:playerId",
                    show: "/events/:id/players/show/:playerId",
                    meta: {
                      canDelete: true,
                      parent: "events",
                      hide: true,
                    },
                  },
                ]}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  useNewQueryKeys: true,
                  projectId: "dUhZC0-eQiUVJ-Uf8gLR",
                  title: { text: "Event Control System", icon: <AppIcon /> },
                }}
              >
                <Routes>
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-inner"
                        fallback={<CatchAllNavigate to="/login" />}
                      >
                        <ThemedLayoutV2
                          Header={Header}
                          Sider={(props) => <ThemedSiderV2 {...props} fixed />}
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
                      <Route path=":id/players">
                        <Route index element={<PlayersList />} />
                        <Route path="create" element={<PlayerCreate />} />
                        <Route path="edit/:playerId" element={<PlayerEdit />} />
                        <Route path="show/:playerId" element={<PlayerShow />} />
                      </Route>

                      {/* Activities */}
                      {/* <Route path=":eventId/activities">
                        <Route index element={<ActivitiesList />} />
                        <Route path="create" element={<ActivityCreate />} />
                        <Route
                          path="edit/:activityId"
                          element={<ActivityEdit />}
                        />
                        <Route
                          path="show/:activityId"
                          element={<ActivityShow />}
                        />
                      </Route> */}

                      {/* Roles */}
                      {/* <Route path=":eventId/roles">
                        <Route index element={<RolesList />} />
                        <Route path="create" element={<RoleCreate />} />
                        <Route path="edit/:roleId" element={<RoleEdit />} />
                        <Route path="show/:roleId" element={<RoleShow />} />
                      </Route> */}
                    </Route>
                    <Route path="*" element={<ErrorComponent />} />
                  </Route>
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
                </Routes>

                <RefineKbar />
                <UnsavedChangesNotifier />
                <DocumentTitleHandler />
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
