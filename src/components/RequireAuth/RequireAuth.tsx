import { useEffect } from "react";
import { useCheckAuth, useNotify, useRedirect } from "react-admin";

const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const checkAuth = useCheckAuth();
  const redirect = useRedirect();
  const notify = useNotify();

  useEffect(() => {
    checkAuth({}, false).catch(() => {
      notify("Пожалуйста, авторизуйтесь для продолжения работы", {
        type: "error",
      });
      redirect("/login");
    });
  }, [checkAuth, redirect, notify]);

  return <>{children}</>;
};

export default RequireAuth;
