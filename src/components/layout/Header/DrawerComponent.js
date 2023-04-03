import Drawer from "@mui/material/Drawer";
import {
  List,
  ListItemIcon,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useState } from "react";

import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

const PAGES = ["Home", "Products", "Contact", "Search"];
const DrawerComponent = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Drawer open={open}>
        <List>
          {PAGES.map((page, index) => {
            return (
              <ListItemButton onClick={() => setOpen((prev) => !prev)}>
                <ListItemIcon>
                  <ListItemText>{page}</ListItemText>
                </ListItemIcon>
              </ListItemButton>
            );
          })}
        </List>
      </Drawer>
      <IconButton
        sx={{ color: "white", marginLeft: "auto" }}
        onClick={() => setOpen((prev) => !prev)}
      >
        <MenuIcon />
      </IconButton>
    </>
  );
};

export default DrawerComponent;
