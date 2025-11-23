import * as React from 'react';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MenuIcon from '@mui/icons-material/Menu';

// Icons for your categories
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
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar, // same height as your AppBar
}));

type CategoryDrawerProps = {
  onNavigate: (category: string) => void;   // we'll call your navigate function
};

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})<{ open: boolean }>(({ theme, open }) => ({
  width: drawerWidth,
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
  const [open, setOpen] = React.useState(true);   // ✅ start visible

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
      variant="permanent"          // ✅ keep it in the layout
      open={open}
      PaperProps={{
        sx: {
          position: 'fixed',    // ✅ not fixed on the viewport
          height: 'auto',          // ✅ only as tall as its content
          mt: 18,                   // ✅ small space under the navbar
          pb: 2,                   // ✅ a bit of padding at bottom
          backgroundColor: '#fff4e1;', 
          boxShadow: "0 -3px 10px rgba(0,0,0,0.25)",  // ⭐ Soft neutral shadow above footer
        },
      }}
    >
      <DrawerHeader>
        <IconButton onClick={handleToggle}>
          {open
            ? (theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />)
            : <MenuIcon />
          }
        </IconButton>
      </DrawerHeader>

      <Divider />

      <List>
        {categories.map(({ label, icon: IconComp }) => (
          <ListItem key={label} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              onClick={() => onNavigate(label)}
              sx={[
                {
                  minHeight: 59,
                  px: 2.5,
                },
                open
                  ? { justifyContent: 'initial' }
                  : { justifyContent: 'center' },
              ]}
            >
              <ListItemIcon
                sx={[
                  {
                    minWidth: 0,
                    justifyContent: 'center',
                    color: '#e65100', // your brand color
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
