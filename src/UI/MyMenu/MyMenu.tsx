import { Menu, MenuItemLink } from "react-admin";
import PeopleIcon from "@mui/icons-material/People";
import EventIcon from "@mui/icons-material/Event";
import QrCodeIcon from "@mui/icons-material/QrCode";

export const MyMenu = () => (
  <Menu>
    <MenuItemLink
      to="/events"
      primaryText="Мероприятия"
      leftIcon={<EventIcon />}
      sx={{ py: 2 }}
    />
    <MenuItemLink
      to="/users"
      primaryText="Пользователи"
      leftIcon={<PeopleIcon />}
      sx={{ py: 2 }}
    />
    <MenuItemLink
      to="/qr-scanner"
      primaryText="QR-Сканер"
      leftIcon={<QrCodeIcon />}
      sx={{ py: 2 }}
    />
  </Menu>
);

export default MyMenu;
