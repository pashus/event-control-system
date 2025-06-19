import { Layout, LayoutProps } from "react-admin";
import MySidebar from "../MySidebar/MySidebar";
import MyMenu from "../MyMenu/MyMenu";
import { useLocation } from "react-router";

const EmptyAppBar = () => null;
const EmptySidebar = () => null;

export function MyLayout(props: LayoutProps) {
  const location = useLocation();
  const hideLayout = /^\/events\/[^/]+\/registration$/.test(location.pathname);
  return (
    <Layout
      {...props}
      menu={MyMenu}
      appBar={hideLayout ? EmptyAppBar : undefined}
      sidebar={hideLayout ? EmptySidebar : MySidebar}
    />
  );
}
