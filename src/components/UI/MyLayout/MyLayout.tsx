import { Layout, LayoutProps } from "react-admin";
import MySidebar from "../MySidebar/MySidebar";
import MyMenu from "../MyMenu/MyMenu";

export function MyLayout(props: LayoutProps) {
  return <Layout {...props} sidebar={MySidebar} menu={MyMenu} />;
}
