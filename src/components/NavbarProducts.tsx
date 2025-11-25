import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import AdbIcon from '@mui/icons-material/Adb';
import Logo from '../assets/fast-fuel.png';


function NavbarProducts() {
    return (
        <AppBar position="fixed" sx={{ backgroundColor: '#fff3e0' }}>
            <Box sx={{ width: '100%' }}>
                <Toolbar disableGutters sx={{ minHeight: 80 }}>
                    {/* LOGO */}
                    <Box
                        component="a"
                        href="#"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            alignItems: 'center',
                        }}
                    >
                        <Box
                            component="img"
                            src={Logo}
                            alt="Fast Fuel Logo"
                            sx={{ height: 70, width: 75 }}
                        />
                    </Box>

                    {/* Mobile Menu Icon */}


                    {/* Mobile Text LOGO */}
                    <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1, color: '#e65100' }} />
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="#"
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: '#e65100',
                            outline: '2px solid #e65100',
                            textDecoration: 'none',
                        }}
                    >
                        LOGO
                    </Typography>

                </Toolbar>

            </Box>
        </AppBar>
    );
}

export default NavbarProducts;
