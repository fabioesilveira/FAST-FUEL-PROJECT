import * as React from 'react';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

// Icons
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import LocalDrinkIcon from '@mui/icons-material/LocalDrink';
import CookieIcon from '@mui/icons-material/Cookie';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

type CategoryDrawerProps = {
  onNavigate: (category: string) => void;
};

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})<{ open: boolean }>(({ theme, open }) => ({
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open
    ? {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme),
      }
    : {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme),
      }),
}));

export default function CategoryDrawer({ onNavigate }: CategoryDrawerProps) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false); // 🔹 começa fechado

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  const categories = [
    { label: 'SANDWICHES', icon: LunchDiningIcon },
    { label: 'SIDES',      icon: FastfoodIcon },
    { label: 'BEVERAGES',  icon: LocalDrinkIcon },
    { label: 'DESSERTS',   icon: CookieIcon },
  ];

  return (
    <Drawer
      variant="permanent"
      open={open}
      PaperProps={{
        sx: {
          position: 'fixed',              // fica sempre na lateral
          top: '50%',                     // centro vertical
          left: 0,
          transform: 'translateY(-50%)',
          height: 'auto',
          backgroundColor: '#fff3e0',
          borderRadius: '0 13px 13px 0',
          boxShadow: "0 4px 12px rgba(230, 81, 0, 0.25), 0 8px 20px rgba(230, 81, 0, 0.18)",
        },
      }}
    >
      <DrawerHeader>
        <IconButton onClick={handleToggle}>
          {open ? (
            <ChevronLeftIcon sx={{ color: '#e65100' }} />
          ) : (
            <ChevronRightIcon sx={{ color: '#e65100' }} />
          )}
        </IconButton>
      </DrawerHeader>

      <Divider sx={{ backgroundColor: '#e65100' }} />

      <List>
        {categories.map(({ label, icon: IconComp }) => (
          <ListItem key={label} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              onClick={() => onNavigate(label)}
              sx={[
                { minHeight: 59, px: 2.5 },
                open ? { justifyContent: 'initial' } : { justifyContent: 'center' },
              ]}
            >
              <ListItemIcon
                sx={[
                  {
                    minWidth: 0,
                    justifyContent: 'center',
                    color: '#e65100',
                  },
                  open ? { mr: 2 } : { mr: 'auto' },
                ]}
              >
                <IconComp />
              </ListItemIcon>

              <ListItemText
                primary={label}
                sx={[
                  {
                    '& .MuiTypography-root': {
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      color: '#e65100',
                    },
                  },
                  open ? { opacity: 1 } : { opacity: 0 },
                ]}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
