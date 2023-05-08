import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import MenuIcon from "@mui/icons-material/Menu";
import { Box, Button, IconButton, Toolbar } from "@mui/material";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";
import MiniDrawer from "./Drawer";

export function Header({
  toggle,
  theme,
  handleDrawerToggle,
}: {
  toggle: () => void;
  theme: string;
  handleDrawerToggle?: () => void;
}) {
  const { status } = useSession()
  const handleSignIn = async () => await signIn('keycloak')
  const handleSignOut = async () => await signOut()
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box>
      <Toolbar>
        {status == 'authenticated' && (
          <IconButton 
            onClick={handleDrawerOpen} 
            edge="start" 
            color="inherit" 
            aria-label="menu" 
            sx={{ mr: 2 }}>
            <MenuIcon
              sx={{
                marginRight: 5,
                ...(open && { display: 'none' }),
              }}
             />
          </IconButton>
        )}
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { sm: "none" } }}
        >
          <MenuIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton sx={{ ml: 1 }} onClick={toggle} color="inherit">
          {theme === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>

        {status == 'unauthenticated' && (
          <Button onClick={handleSignIn} color="inherit">Login</Button>
        )}

        {status == 'authenticated' && (
          <Button onClick={handleSignOut} color="inherit">Logout</Button>
        )}

      </Toolbar>
      {
        status == 'authenticated' && (
          <MiniDrawer open={open} handleDrawerClose={handleDrawerClose} />
        )
      }
    </Box>
  );
}
