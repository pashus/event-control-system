import { Sidebar, useSidebarState } from "react-admin";
import { Backdrop } from "@mui/material";

function MySidebar(props: any) {
  const [open, setOpen] = useSidebarState();

  return (
    <>
      <Sidebar {...props} />
      <Backdrop
        open={open}
        sx={{
          zIndex: 1199,
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          position: "fixed",
          top: 0,
          left: 240,
          width: `calc(100% - 240px)`,
          height: "100%",
        }}
        onClick={() => setOpen(false)}
      />
    </>
  );
}

export default MySidebar;
