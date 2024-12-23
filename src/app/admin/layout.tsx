'use client'
import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Drawer,
    List,
    ListItemIcon,
    ListItemText,
    IconButton,
    Box,
    Divider,
    Menu,
    MenuItem,
    Container,
    useMediaQuery,
    ListItemButton,
    Paper,
} from '@mui/material';
import {
    Menu as MenuIcon,
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    ListAlt as ListAltIcon,
    AccountCircle as AccountCircleIcon,
    ExitToApp as ExitToAppIcon,
    VpnKey as VpnKeyIcon,
} from '@mui/icons-material';
import RecentRequests from './components/RecentRequests';
import { ThemeProvider, createTheme } from '@mui/material/styles';
//import Logo from './components/Logo';
import { usePathname, useRouter } from 'next/navigation';
import LogoutButton from './components/logoutButton';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from '../contexts/AuthContext';
/* const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
}); */
const drawerWidth = 240;

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const matches = useMediaQuery('(min-width: 600px)');
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleDrawerToggle = () => setOpen(!open);
    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);
    const router = useRouter();
    const navItems = [
        { label: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
        { label: 'Requests', icon: <ListAltIcon />, path: '/admin/requests' },
        { label: 'Users', icon: <PeopleIcon />, path: '/admin/users' },
    ];
    const handleNavigation = (path: string) => {
        router.push(path);
    };
    const pathname = usePathname()
    const { user } = useAuth();
    //const router = useRouter();
    //const pathname = window.location.pathname;
    /*   const toggleDrawer = (newOpen: boolean) => () => {
          setOpen(newOpen);
      }; */


    return (
        /*         <ProtectedRoute requiredRole="admin"></ProtectedRoute>
         */
        <ProtectedRoute>
            <Paper

                sx={{
                    bgcolor: '#e8eaf6',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh', // Full viewport height
                    width: '100vw', // Full viewport width
                    margin: 0,
                    padding: 0,
                    overflowY: 'scroll'
                }}
            // bgcolor="#e8eaf6"
            >
                {/* AppBar */}
                <AppBar color="inherit" position="fixed" sx={{
                    backgroundColor: '', zIndex: (theme) => theme.zIndex.drawer + 1
                }}>
                    <Toolbar>
                        <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
                            <MenuIcon />
                        </IconButton>
                        <Typography sx={{ flexGrow: 1 }} variant="h6" noWrap component="div">
                            <img src="/images/logo-trust.png" alt="Brand Logo" style={{ height: 50, marginRight: 10 }} />

                        </Typography>
                        {/*  <Logo src="../images/logo-trust.png" alt="Logo" />
                  <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        My Dashboard
                    </Typography>  */}

                        <IconButton color="info" sx={{ color: "" }} onClick={handleMenuOpen}>
                            <AccountCircleIcon />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                        >
                            <MenuItem>
                                <AccountCircleIcon fontSize="small" sx={{ mr: 1 }} />
                                Welcome {user?.name}
                            </MenuItem>
                            <Divider />
                            <MenuItem onClick={handleMenuClose}>
                                <VpnKeyIcon fontSize="small" sx={{ mr: 1 }} />
                                Change Password
                            </MenuItem>
                            <MenuItem onClick={handleMenuClose}>
                                <ExitToAppIcon fontSize="small" sx={{ mr: 1 }} />
                                <LogoutButton />
                            </MenuItem>
                        </Menu>


                    </Toolbar>
                </AppBar>


                {/* Drawer */}
                <Drawer
                    //onClick={matches ? toggleDrawer(false) : void}

                    //  onClose={(event) => { if (!matches) setOpen(false); }} // Inline condition
                    onClick={(event) => { if (!matches) setOpen(false); }} // // Only close on smaller screens

                    variant={matches ? 'permanent' : 'temporary'}

                    sx={{
                        width: open ? drawerWidth : 60,
                        flexShrink: 0,
                        [`& .MuiDrawer-paper`]: {
                            width: open ? drawerWidth : 60,
                            boxSizing: 'border-box',
                            overflowX: 'hidden', // Prevent horizontal scroll
                            transition: 'width 0.3s',
                        },
                    }}
                    // open={open}
                    open={open || matches} // Open on large screens or when the toggle button is clicked
                >
                    <Toolbar />
                    <Divider />

                    <Box sx={{ mt: 8 }} >

                        <List>
                            {navItems.map((item) => (
                                <ListItemButton

                                    key={item.label}
                                    onClick={() => handleNavigation(item.path)}
                                    selected={pathname.endsWith(item.path)} // Check if pathname starts with item path
                                    sx={{
                                        '&.Mui-selected': { backgroundColor: 'rgba(0,0,0,0.08)' },
                                    }}
                                >
                                    <ListItemIcon>{item.icon}</ListItemIcon>
                                    <ListItemText primary={item.label} />
                                </ListItemButton>
                            ))}
                        </List>

                    </Box>


                </Drawer>

                {/* Main Content */}
                {/*             <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', mt: 8 }}>
 */}                {/* <Box
                    sx={{
                        flexGrow: 1,
                        //boxShadow: 2,
                        overflowX: 'auto', // Horizontal scroll
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        //minWidth: '1200px', // Set a minimum width for horizontal scroll
                        // maxHeight: '100%', overflow: 'auto',
                        padding: 3,

                    }}
                > */}
                {/* Content that can scroll horizontally */}
                {/*                     <Typography variant="h4">Welcome to the Dashboard</Typography>
 */}




                {/*             <Container component="main" style={{ marginTop: '80px', marginBottom: '20px', padding: '16px', backgroundColor: '#f5f5f5' }}>
 */}
                <Container component="main" sx={{ paddin: 0, my: 10, width: '100%', maxWidth: { xs: 600, sm: 700, md: 1000, lg: 1400 } }} >

                    <Box sx={{ display: 'flex', flexDirection: 'column', margin: 0 }}>
                        {children}
                        {/*    <Card sx={{ maxWidth: 345 }}>
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Card 2
                            </Typography>
                            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                This is the second card.
                            </Typography>
                        </CardContent>
                    </Card> */}
                    </Box>
                    <Box bottom={0} width="100%" sx={{ mt: 4, backgroundColor: "", py: 2 }}>
                        {/* Footer */}
                        <Typography variant="body2" color="text.secondary" align="center">
                            {'Copyright © '}
                            {new Date().getFullYear()}
                            {' Trust Medical Transportation TMT'}
                        </Typography>
                    </Box>

                </Container>

            </Paper>
        </ProtectedRoute >
    );
};

export default Layout;
