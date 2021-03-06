import MenuIcon from "@mui/icons-material/Menu";
import { AppBar as MuiAppBar, Avatar, Box, Button, Container, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography } from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import { AppName, RouteUrls } from "../../utility/config";

type PageInfo = {
  name: string;
  url: string;
};

const pagesLeft: PageInfo[] = [{ name: "Accueil", url: RouteUrls.Index }];
const pagesRight: PageInfo[] = [];

const pagesLeftLogin: PageInfo[] = [
  { name: "Accueil", url: RouteUrls.Index },
  { name: "Créer un quiz", url: RouteUrls.NewQuiz },
  { name: "Rejoindre un quiz", url: RouteUrls.JoinQuiz },
];

export default function AppBar() {
  const router = useRouter();
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const { data: session, status } = useSession();

  const settings = [
    {
      name: "Logout",
      callback: () => {
        signOut();
      },
    },
  ];

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleClickNavItem = (url: string) => {
    router.push(url);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = (callback?: () => void) => {
    setAnchorElUser(null);

    if (callback) callback();
  };

  return (
    <MuiAppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Normal screen */}
          <Typography variant="h6" noWrap component="div" sx={{ mr: 2, display: { xs: "none", md: "flex" } }}>
            {AppName}
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {(session ? pagesLeftLogin : pagesLeftLogin).map((page) => (
                <MenuItem key={page.name} onClick={() => handleClickNavItem(page.url)}>
                  <Typography textAlign="center">{page.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          {/* Small Screen screen */}
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            {AppName}
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {(session ? pagesLeftLogin : pagesLeftLogin).map((page) => (
              <Button key={page.name} onClick={() => handleClickNavItem(page.url)} sx={{ my: 2, color: "white", display: "block" }}>
                {page.name}
              </Button>
            ))}
          </Box>
          {/* Small Screen screen End */}

          {session ? (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt={session.user.name} src={session.user.image ?? "/static/images/avatar/2.jpg"} />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={() => handleCloseUserMenu()}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting.name} onClick={() => handleCloseUserMenu(setting.callback)}>
                    <Typography textAlign="center">{setting.name}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          ) : (
            <>
              {pagesRight.map((page) => (
                <Button key={page.name} onClick={() => handleClickNavItem(page.url)} sx={{ my: 2, color: "white", display: "block" }}>
                  <Typography textAlign="center" fontSize="default">
                    {page.name}
                  </Typography>
                </Button>
              ))}
            </>
          )}
        </Toolbar>
      </Container>
    </MuiAppBar>
  );
}
