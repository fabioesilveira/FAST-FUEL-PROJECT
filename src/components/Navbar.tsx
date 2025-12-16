import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import Logo from '../assets/fast-fuel.png';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
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
  { label: 'Signin / Signup', icon: AccountCircleIcon, path: '/sign-in', click: () => { }, disabled: false },
  { label: 'My Orders', icon: HistoryIcon, path: '/history', click: () => { }, disabled: false },
  { label: 'Contact Us', icon: EmailIcon, path: '/contact-us', click: () => { }, disabled: false },
  { label: 'Delete Account', icon: NoAccountsIcon, path: '/deleteaccount', click: () => { }, disabled: true },
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
    fontSize: '0.9rem',
  },
}));

// Blue badge only
const CartBadge = styled(Badge)`
  & .${badgeClasses.badge} {
    top: -12px;
    right: -6px;
    background-color: #1e5bb8;
    color: #fff;
  }
`;

type NavbarProps = {
  onSearch: (value: string) => void;
};

function Navbar({ onSearch }: NavbarProps) {
  const navigate = useNavigate();
  const { order } = useAppContext();

  const [shown, setShown] = useState(false);
  const [dropdownItemsChange, setDropDownChange] = useState(dropdownItems);
  const [badgeQuantity, setBadgeQuantity] = useState(0);

  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const handleClickSignout = () => {
    localStorage.clear();
  };

  // user logged in?
  useEffect(() => {
    if (localStorage.getItem('idUser')) {
      setShown(false);
      setDropDownChange([
        { label: 'Signout', icon: AccountCircleIcon, path: '/sign-in', click: handleClickSignout, disabled: false },
        { label: 'My Orders', icon: HistoryIcon, path: '/history', click: () => { }, disabled: false },
        { label: 'Contact Us', icon: EmailIcon, path: '/contact', click: () => { }, disabled: false },
        { label: 'Delete Account', icon: NoAccountsIcon, path: '/deleteaccount', click: () => { }, disabled: false },
      ]);
    }
    setBadgeQuantity(order.length);
  }, []);

  useEffect(() => {
    const qtdTotal = order.reduce((acc, element) => acc + element.quantidade, 0);
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

  return (
    <AppBar position="fixed" sx={{ backgroundColor: '#fff3e0' }}>
      <Box sx={{ width: '100%' }}>
        <Toolbar
          disableGutters
          sx={{
            minHeight: 80,
            px: { xs: 1, md: 2 },
            gap: { xs: 1, md: 2 },
          }}
        >
          {/* LOGO – sempre visível, só menor no mobile */}
          <Box
            component="a"
            href="#"
            sx={{
              display: "flex",
              alignItems: "center",
              ml: { xs: -1, md: -2 }, // puxa pra esquerda
            }}
          >
            <Box
              component="img"
              src={Logo}
              alt="Fast Fuel Logo"
              sx={{
                height: { xs: 62, md: 70 },
                width: "auto",
                objectFit: "contain",
                transform: { xs: "scaleX(1.04)", md: "scaleX(1.07)" }, // estica no desktop
                transformOrigin: "left center",  // estica puxando da esquerda
              }}
            />
          </Box>

          {/* SEARCH – continua no meio, só menor no mobile */}
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              justifyContent: 'flex-start',
            }}
            onClick={() => searchInputRef.current?.focus()}
          >
            <Search>
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
          </Box>

          {/* RIGHT SIDE – sempre visível, só reduzido no mobile */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 1, md: 1.5 },
              marginLeft: 'auto',
              paddingRight: { xs: 1, md: 2 },
              position: 'relative',
            }}
          >
            {/* Cart */}
            <IconButton
              onClick={() => navigate('/checkout')}
              sx={{
                width: { xs: 50, md: 70 },
                height: { xs: 34, md: 40 },
                borderRadius: 2,
                backgroundColor: '#e65100',
                '&:hover': { backgroundColor: '#b33f00' },
                boxShadow: '0px 3px 14px rgba(0,0,0,0.25)'
                
              }}
            >
              <ShoppingCartIcon
                sx={{
                  fontSize: { xs: 24, md: 28 },
                  color: '#ffe0c7',
                }}
              />
              <CartBadge
                badgeContent={badgeQuantity}
                overlap="circular"
                sx={{ pointerEvents: 'none' }}
              />
            </IconButton>

            {/* Manage Button (abre dropdown) */}
            <Button
              variant="contained"
              onClick={() => setShown((prev) => !prev)}
              sx={{
                width: { xs: 50, md: 68 },
                height: { xs: 34, md: 40 },
                minWidth: 'unset',
                borderRadius: 2,
                backgroundColor: '#e65100',
                '&:hover': { backgroundColor: '#b33f00' },
                padding: 0,
              }}
            >
              <ManageAccountsIcon
                sx={{
                  fontSize: { xs: 27, md: 32 },
                  color: '#ffe0c7',
                }}
              />
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
                  width: 210,
                }}
              >
                {dropdownItemsChange.map(({ label, icon: Icon, path, click, disabled }) => (
                  <Button
                    key={label}
                    component={Link}
                    to={path}
                    onClick={click}
                    disabled={disabled}
                    sx={{
                      color: '#e65100',
                      outline: '2px solid #e65100',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                      gap: 1.2,
                      width: '100%',
                      px: 1.5,
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
