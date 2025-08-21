
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import Logo from '../assets/fast-fuel.png';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha('#e65100', 0.15),
  '&:hover': {
    backgroundColor: alpha('#e65100', 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: theme.spacing(2),
  width: '100%',
  maxWidth: 300,
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#e65100',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: '#e65100',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    width: '100%',
  },
}));

type NavbarProps = {
  onSearch: (value: string) => void;
};

function Navbar({ onSearch }: NavbarProps) {

  const navigate = useNavigate();

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [shown, setShown] = useState(true);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  useEffect(() => {
    if (localStorage.getItem("idUser")) {
      setShown(false)
    }
  }, [])

  const handleNavigate = (category: string) => {
    navigate(`/${category.toLowerCase()}`);
  };


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
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon sx={{ color: '#e65100' }} />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              <MenuItem onClick={handleCloseNavMenu}>
                <Link to="/signup" style={{ textDecoration: 'none', color: '#e65100' }}>Signup</Link>
              </MenuItem>
              <MenuItem onClick={handleCloseNavMenu}>
                <Link to="/signin" style={{ textDecoration: 'none', color: '#e65100' }}>Signin</Link>
              </MenuItem>
            </Menu>
          </Box>

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

          {/* SEARCH BAR */}
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              onChange={(event) => onSearch(event.target.value)}
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>

          <Box sx={{ display: 'flex', gap: 1 }}>
            {['SANDWICHES', 'SIDES', 'BEVERAGES', 'DESSERTS'].map((category) => (
              <Button
                key={category}
                onClick={() => handleNavigate(category)}
                sx={{
                  color: '#e65100',
                  fontWeight: 500,
                  textTransform: 'none',
                }}
              >
                {category}
              </Button>
            ))}
          </Box>

          {/* Right Static Buttons */}
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              gap: 1,
              marginLeft: 'auto',
              paddingRight: 2, // or use marginRight: 2
            }}
          >

            <Button
              variant="contained"
              sx={{ width: 40, height: 40, borderRadius: 2, backgroundColor: '#e65100' }}
            >
              <ShoppingCartIcon sx={{ fontSize: 28, color: '#ffe0c7' }} />
            </Button>

            <Button
              variant="contained"
              sx={{ width: 40, height: 40, borderRadius: 2, backgroundColor: '#e65100' }}
            >
              <ManageAccountsIcon sx={{ fontSize: 28, color: '#ffe0c7' }} />
            </Button>

            {shown ? <>
              <Button
                sx={{
                  color: '#e65100',
                  outline: '2px solid #e65100',
                  '&:focus': {
                    outlineOffset: '2px',
                  },
                }}
              >
                <Link to="/sign-in" style={{ textDecoration: 'none', color: '#e65100' }}>
                  Signin
                </Link>
              </Button>

              <Button
                sx={{
                  color: '#e65100',
                  outline: '2px solid #e65100',
                  '&:focus': {
                    outlineOffset: '2px',
                  },
                }}
              >
                <Link to="/sign-up" style={{ textDecoration: 'none', color: '#e65100' }}>
                  Signup
                </Link>
              </Button>
            </> : null}
          </Box>
        </Toolbar>
      </Box>
    </AppBar>
  );
}

export default Navbar;
