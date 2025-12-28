import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import { styled, alpha } from "@mui/material/styles";
import Logo from "../assets/fast-fuel.png";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import Badge, { badgeClasses } from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import { useAppContext } from "../context/context";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NoAccountsIcon from "@mui/icons-material/NoAccounts";
import HistoryIcon from "@mui/icons-material/History";
import EmailIcon from "@mui/icons-material/Email";
import { useAppAlert } from "../hooks/useAppAlert";

type DropdownItem = {
  label: string;
  icon: any;
  path?: string;
  requiresAuth?: boolean;
  action?: () => void; // for Signout
};

const dropdownItems: DropdownItem[] = [
  { label: "Signin / Signup", icon: AccountCircleIcon, path: "/sign-in" },
  { label: "My Orders", icon: HistoryIcon, path: "/history" },
  { label: "Contact Us", icon: EmailIcon, path: "/contact-us" },
  {
    label: "Delete Account",
    icon: NoAccountsIcon,
    path: "/deleteaccount",
    requiresAuth: true,
  },
];

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: 10,

  backgroundColor: alpha("#e65100", 0.08),
  border: "2px solid rgba(230, 81, 0, 0.85)",

  transition: "all .18s ease",

  "&:hover": {
    backgroundColor: alpha("#e65100", 0.12),
    borderColor: "rgba(230, 81, 0, 0.85)",
  },

  "&:focus-within": {
    backgroundColor: alpha("#e65100", 0.10),
    borderColor: "#e65100",
    boxShadow: "0 0 0 4px rgba(230, 81, 0, 0.32)",
  },

  marginRight: theme.spacing(2),
  marginLeft: theme.spacing(2),
  width: "100%",
  maxWidth: 320,
  display: "flex",
  alignItems: "center",
  cursor: "text",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "#0d47a1",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1.1, 1, 1.1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    width: "100%",
    fontSize: "0.95rem",
    fontWeight: 600,
  },
  "& .MuiInputBase-input::placeholder": {
    color: "rgba(13, 71, 161, 0.75)",
    opacity: 1,
    fontWeight: 600,
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#0d47a1",
  pointerEvents: "none",
}));

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
  const [dropdownItemsChange, setDropDownChange] =
    useState<DropdownItem[]>(dropdownItems);
  const [badgeQuantity, setBadgeQuantity] = useState(0);

  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const { showAlert, AlertUI, confirmAlert, ConfirmUI } = useAppAlert({
    vertical: "top",
    horizontal: "center",
  });

  //  Signout action (now actually used)
 const handleClickSignout = () => {
  localStorage.clear();
  setShown(false);

  showAlert("Signed out successfully", "success");
  setDropDownChange(dropdownItems);

  setTimeout(() => {
    navigate("/sign-in");
  }, 2000);
};

  useEffect(() => {
    // if logged: swap menu
    if (localStorage.getItem("idUser")) {
      setShown(false);

      setDropDownChange([
        {
          label: "Signout",
          icon: AccountCircleIcon,
          action: handleClickSignout, // action instead of Link
        },
        {
          label: "My Orders",
          icon: HistoryIcon,
          path: "/history",
        },
        {
          label: "Contact Us",
          icon: EmailIcon,
          path: "/contact-us",
        },
        {
          label: "Delete Account",
          icon: NoAccountsIcon,
          path: "/deleteaccount",
          requiresAuth: true,
        },
      ]);
    } else {
      // if not logged: ensure default menu
      setDropDownChange(dropdownItems);
    }

    setBadgeQuantity(order.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order]);

  useEffect(() => {
    const qtdTotal = order.reduce((acc, element) => acc + element.quantidade, 0);
    setBadgeQuantity(qtdTotal);
  }, [order]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShown(false);
      }
    }

    if (shown) document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [shown]);

  return (
    <>
      {AlertUI}
      {ConfirmUI}

      <AppBar position="fixed" sx={{ backgroundColor: "#fff3e0" }}>
        <Box sx={{ width: "100%" }}>
          <Toolbar
            disableGutters
            sx={{
              minHeight: 80,
              px: { xs: 1, md: 2 },
              gap: { xs: 1, md: 2 },
            }}
          >
            {/* LOGO */}
            <Box
              component="a"
              href="#"
              sx={{
                display: "flex",
                alignItems: "center",
                ml: { xs: -1, md: -2 },
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
                  transform: { xs: "scaleX(1.04)", md: "scaleX(1.07)" },
                  transformOrigin: "left center",
                }}
              />
            </Box>

            {/* SEARCH */}
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                justifyContent: "flex-start",
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
                  inputProps={{ "aria-label": "search" }}
                  inputRef={searchInputRef}
                />
              </Search>
            </Box>

            {/* RIGHT SIDE */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 1, md: 1.5 },
                marginLeft: "auto",
                paddingRight: { xs: 1, md: 2 },
                position: "relative",
              }}
            >
              {/* Cart */}
              <IconButton
                onClick={() => {
                  const isLogged = Boolean(localStorage.getItem("idUser"));

                  if (isLogged) {
                    navigate("/checkout");
                    return;
                  }

                  confirmAlert({
                    title: "Checkout",
                    message: "You’re not signed in. Continue as guest or sign in?",
                    confirmText: "Continue as guest",
                    cancelText: "Sign in / Sign up",
                    onConfirm: () => navigate("/checkout?guest=1"),
                    onCancel: () => navigate("/sign-in"),
                    onDismiss: () => {
                    },
                  });

                }}
                sx={{
                  width: { xs: 50, md: 70 },
                  height: { xs: 34, md: 40 },
                  borderRadius: 2,
                  backgroundColor: "#e65100",
                  "&:hover": { backgroundColor: "#b33f00" },
                  boxShadow: "0px 3px 14px rgba(0,0,0,0.25)",
                }}
              >
                <ShoppingCartIcon
                  sx={{
                    fontSize: { xs: 24, md: 28 },
                    color: "#ffe0c7",
                  }}
                />

                <CartBadge
                  badgeContent={badgeQuantity}
                  overlap="circular"
                  sx={{ pointerEvents: "none" }}
                />
              </IconButton>

              {/* Manage Button */}
              <Button
                variant="contained"
                onClick={() => setShown((prev) => !prev)}
                sx={{
                  width: { xs: 50, md: 68 },
                  height: { xs: 34, md: 40 },
                  minWidth: "unset",
                  borderRadius: 2,
                  backgroundColor: "#e65100",
                  "&:hover": { backgroundColor: "#b33f00" },
                  padding: 0,
                }}
              >
                <ManageAccountsIcon
                  sx={{
                    fontSize: { xs: 27, md: 32 },
                    color: "#ffe0c7",
                  }}
                />
              </Button>

              {/* Dropdown */}
              {shown && (
                <Box
                  ref={menuRef}
                  sx={{
                    position: "absolute",
                    top: "115%",
                    right: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    backgroundColor: "#fff3e0",
                    padding: 1.2,
                    borderRadius: 2,
                    boxShadow: "0 6px 16px rgba(0,0,0,0.30)",
                    zIndex: 10,
                    width: 210,
                  }}
                >
                  {dropdownItemsChange.map((item) => {
                    const { label, icon: Icon, path, requiresAuth } = item as any;
                    const action = (item as any).action as undefined | (() => void);
                    const isAction = Boolean(action);

                    const commonSx = {
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      gap: 1.2,
                      width: "100%",
                      px: 1.5,
                      py: 0.8,
                      borderRadius: 1.5,
                      textTransform: "none",
                      border: "2px solid #0d47a1",
                      color: "#0d47a1",
                      fontWeight: 600,
                      bgcolor: "rgba(230, 81, 0, 0.14)",
                      boxShadow: "0 2px 6px rgba(13, 71, 161, 0.18)",
                      "&:hover": {
                        bgcolor: "rgba(230, 81, 0, 0.22)",
                        boxShadow: "0 4px 10px rgba(13, 71, 161, 0.28)",
                      },
                      "&:active": {
                        bgcolor: "rgba(230, 81, 0, 0.28)",
                        transform: "translateY(1px)",
                      },
                    } as const;

                    // ACTION (Signout)
                    if (isAction) {
                      return (
                        <Button
                          key={label}
                          onClick={() => {
                            action?.();
                            setShown(false);
                          }}
                          sx={commonSx}
                        >
                          <Box sx={{ width: 24, display: "flex" }}>
                            <Icon sx={{ color: "#e85f10" }} />
                          </Box>
                          {label}
                        </Button>
                      );
                    }

                    return (
                      <Button
                        key={label}
                        component={Link}
                        to={path}
                        onClick={(e) => {
                          const isLogged = Boolean(localStorage.getItem("idUser"));

                          if (requiresAuth && !isLogged) {
                            e.preventDefault();
                            showAlert("Please sign in to delete your account", "warning");
                            setShown(false);
                            return;
                          }

                          setShown(false);
                        }}
                        sx={commonSx}
                      >
                        <Box sx={{ width: 24, display: "flex" }}>
                          <Icon sx={{ color: "#e85f10" }} />
                        </Box>
                        {label}
                      </Button>
                    );
                  })}
                </Box>
              )}
            </Box>
          </Toolbar>
        </Box>
      </AppBar>
    </>
  );

}

export default Navbar;
