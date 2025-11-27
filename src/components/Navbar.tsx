import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
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
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import Badge, { badgeClasses } from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import { useAppContext } from '../context/context';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NoAccountsIcon from '@mui/icons-material/NoAccounts';
import HistoryIcon from '@mui/icons-material/History';
import EmailIcon from '@mui/icons-material/Email';

const dropdownItems = [
  { label: 'Signin / Signup', icon: AccountCircleIcon, path: '/sign-in' },
  { label: 'My Orders', icon: HistoryIcon, path: '/history' },
  { label: 'Contact Us', icon: EmailIcon, path: '/contact' },
  { label: 'Delete Account', icon: NoAccountsIcon, path: '/sign-up' },
];


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

  display: 'flex',
  alignItems: 'center',
  cursor: 'text',

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
  pointerEvents: 'none',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: '#e65100',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    width: '100%',
  },
}));

// Blue badge only
const CartBadge = styled(Badge)`
  & .${badgeClasses.badge} {
    top: -12px;
    right: -6px;
    background-color: #1976d2;
    color: #fff;
  }
`;

type NavbarProps = {
  onSearch: (value: string) => void;
};

function Navbar({ onSearch }: NavbarProps) {
  const navigate = useNavigate();
  const { order } = useAppContext();

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [shown, setShown] = useState(false);   // 🔹 start closed
  const [badgeQuantity, setBadgeQuantity] = useState(0);

  // refs
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  // user logged in?
  useEffect(() => {
    if (localStorage.getItem('idUser')) {
      setShown(false);
    }
    setBadgeQuantity(order.length);
  }, []);

  useEffect(() => {
    const qtdTotal = order.reduce(
      (acc, element) => acc + element.quantidade,
      0
    );
    setBadgeQuantity(qtdTotal);
  }, [order]);

  // close dropdown if clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShown(false);
      }
    }

    if (shown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [shown]);

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
            <IconButton size="large" onClick={handleOpenNavMenu} color="inherit">
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
                <Link to="/signup" style={{ textDecoration: 'none', color: '#e65100' }}>
                  Signup
                </Link>
              </MenuItem>
              <MenuItem onClick={handleCloseNavMenu}>
                <Link to="/signin" style={{ textDecoration: 'none', color: '#e65100' }}>
                  Signin
                </Link>
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
          <Search onClick={() => searchInputRef.current?.focus()}>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              onChange={(event) => onSearch(event.target.value)}
              inputProps={{ 'aria-label': 'search' }}
              inputRef={searchInputRef}
            />
          </Search>

          {/* RIGHT SIDE – Cart + Manage + Dropdown */}
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              gap: 1.5,
              marginLeft: 'auto',
              paddingRight: 2,
              position: 'relative', // anchor for dropdown
            }}
          >
            {/* Cart */}
            <IconButton
              onClick={() => navigate('/checkout')}
              sx={{
                width: 70,
                height: 40,
                borderRadius: 2,
                backgroundColor: '#e65100',
                '&:hover': { backgroundColor: '#b33f00' },
                filter: 'drop-shadow(0px 0px 4px rgba(0,0,0,0.25))',
              }}
            >
              <ShoppingCartIcon
                sx={{
                  fontSize: 28,
                  color: '#ffe0c7',
                }}
              />
              <CartBadge
                badgeContent={badgeQuantity}
                overlap="circular"
                sx={{ pointerEvents: 'none' }}
              />
            </IconButton>

            {/* Manage Button */}
            <Button
              variant="contained"
              onClick={() => setShown((prev) => !prev)}
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                backgroundColor: '#e65100',
                '&:hover': { backgroundColor: '#b33f00' },
              }}
            >
              <ManageAccountsIcon sx={{ fontSize: 28, color: '#ffe0c7' }} />
            </Button>

            {shown && (
              <Box
                ref={menuRef}
                sx={{
                  position: 'absolute',
                  top: '115%',
                  right: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  backgroundColor: '#fff3e0',
                  padding: 1.2,
                  borderRadius: 2,
                  boxShadow: '0 6px 16px rgba(0,0,0,0.30)',
                  zIndex: 10,
                  width: 210,          // fixes text wrapping
                }}
              >
                {dropdownItems.map(({ label, icon: Icon, path }) => (
                  <Button
                    key={label}
                    component={Link}
                    to={path}
                    sx={{
                      color: '#e65100',
                      outline: '2px solid #e65100',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                      gap: 1.2,
                      width: '100%',
                      px: 1.5,              // ✅ use px instead of paddingX
                      textAlign: 'left',
                      textDecoration: 'none',
                      '&:focus': { outlineOffset: '2px' },
                    }}
                  >
                    <Box
                      sx={{
                        width: 24,
                        display: 'flex',
                        justifyContent: 'flex-start',
                      }}
                    >
                      <Icon sx={{ color: '#e65100' }} />
                    </Box>

                    {label}
                  </Button>
                ))}
              </Box>
            )}

          </Box>
        </Toolbar>
      </Box>
    </AppBar>
  );
}

export default Navbar;
