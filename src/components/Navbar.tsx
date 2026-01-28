import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";
import Logo from "../assets/fast-fuel.png";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import Badge, { badgeClasses } from "@mui/material/Badge";
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
  action?: () => void;
};


const dropdownItems: DropdownItem[] = [
  { label: "Signin / Signup", icon: AccountCircleIcon, path: "/sign-in" },
  { label: "My Orders", icon: HistoryIcon, path: "/orders" },
  { label: "Contact Us", icon: EmailIcon, path: "/contact-us" },
  {
    label: "Delete Account",
    icon: NoAccountsIcon,
    path: "/deleteaccount",
    requiresAuth: true,
  },
];

const IconHit = styled("button")(() => ({
  border: 0,
  background: "transparent",
  padding: 0,
  cursor: "pointer",
  borderRadius: 12,
  lineHeight: 0,
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
  onSearchOverlayChange?: (open: boolean) => void;
};

function Navbar({ onSearch, onSearchOverlayChange }: NavbarProps) {
  const navigate = useNavigate();
  const { order } = useAppContext();

  const [shown, setShown] = useState(false);
  const [dropdownItemsChange, setDropDownChange] =
    useState<DropdownItem[]>(dropdownItems);
  const [badgeQuantity, setBadgeQuantity] = useState(0);

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const floatingSearchRef = useRef<HTMLDivElement | null>(null);
  const floatingInputRef = useRef<HTMLInputElement | null>(null);

  const menuRef = useRef<HTMLDivElement | null>(null);

  const searchAreaRef = useRef<HTMLDivElement | null>(null);

  const { showAlert, AlertUI, confirmAlert, ConfirmUI } = useAppAlert({
    vertical: "top",
    horizontal: "center",
  });



  const openSearch = () => {
    setSearchFocused(false);
    setSearchOpen(true);
    onSearchOverlayChange?.(true);

    requestAnimationFrame(() => {
      floatingInputRef.current?.focus();
    });
  };


  const closeSearchOnly = () => {
    setSearchOpen(false);
    setSearchFocused(false);
    onSearchOverlayChange?.(false);
  };


  const closeSearchAndClear = () => {
    setSearchOpen(false);
    setSearchFocused(false);
    onSearchOverlayChange?.(false);
    onSearch("");
  };

  const handleClickSignout = () => {
    localStorage.removeItem("idUser");
    localStorage.removeItem("userName");
    localStorage.removeItem("userType");
    localStorage.removeItem("emailUser");
    localStorage.removeItem("authUser");

    setShown(false);

    showAlert("Signed out successfully", "success");
    setDropDownChange(dropdownItems);

    setTimeout(() => {
      navigate("/sign-in");
    }, 2000);
  };

  useEffect(() => {
    if (localStorage.getItem("idUser")) {
      setShown(false);

      setDropDownChange([
        { label: "Signout", icon: AccountCircleIcon, action: handleClickSignout },
        { label: "My Orders", icon: HistoryIcon, path: "/orders" },
        { label: "Contact Us", icon: EmailIcon, path: "/contact-us" },
        {
          label: "Delete Account",
          icon: NoAccountsIcon,
          path: "/deleteaccount",
          requiresAuth: true,
        },
      ]);
    } else {
      setDropDownChange(dropdownItems);
    }

    setBadgeQuantity(order.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order]);

  useEffect(() => {
    const qtdTotal = order.reduce(
      (acc, element) => acc + (element.quantidade ?? 0),
      0
    );
    setBadgeQuantity(qtdTotal);
  }, [order]);

  // fecha dropdown/search em clique fora (SEM limpar search)
  useEffect(() => {
    function handlePointerDownOutside(event: PointerEvent) {
      const target = event.target as Node;

      if (menuRef.current && !menuRef.current.contains(target)) {
        setShown(false);
      }

      if (
        searchOpen &&
        searchAreaRef.current &&
        !searchAreaRef.current.contains(target)
      ) {
        closeSearchOnly();
      }
    }

    document.addEventListener("pointerdown", handlePointerDownOutside, true);
    return () =>
      document.removeEventListener("pointerdown", handlePointerDownOutside, true);
  }, [searchOpen]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (searchOpen) closeSearchOnly(); // ESC só fecha overlay
        if (shown) setShown(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [searchOpen, shown]);

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
                ml: { xs: -1.5, md: -2.8 },
              }}
            >
              <Box
                component="img"
                src={Logo}
                alt="Fast Fuel Logo"
                sx={{
                  height: { xs: 72, md: 76 },
                  mt: { xs: 0, sm: 0.2, md: 0.2 },
                  width: "auto",
                  objectFit: "contain",
                  transform: { xs: "scaleX(1.04)", md: "scaleX(1.07)" },
                  transformOrigin: "left center",
                }}
              />
            </Box>

            {/* SEARCH (icon + dropdown under it) */}
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                position: "relative",
              }}
            >
              <Box
                ref={searchAreaRef}
                sx={{
                  position: "relative",
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                <IconHit
                  onClick={(e) => {
                    e.stopPropagation();
                    if (searchOpen) closeSearchOnly();
                    else openSearch();
                  }}
                  aria-label="Open search"
                >
                  <Box
                    sx={{
                      width: 54,
                      height: 54,
                      borderRadius: 2.2,
                      display: "grid",
                      placeItems: "center",
                      transition: "background-color .15s ease, transform .08s ease",
                      color: "#1e5bb8",

                      "@media (hover: hover) and (pointer: fine)": {
                        "&:hover": { bgcolor: "rgba(30, 91, 184, 0.14)" },
                      },

                      "&:active": {
                        bgcolor: "rgba(30, 91, 184, 0.20)",
                        transform: "scale(0.98)",
                      },
                    }}
                  >
                    <SearchIcon sx={{ fontSize: 32 }} />
                  </Box>
                </IconHit>

                {searchOpen && (
                  <Box
                    ref={floatingSearchRef}
                    sx={{
                      position: "absolute",
                      top: "calc(100% + 10px)",
                      left: 0,
                      zIndex: 2000,
                      width: 310,
                      maxWidth: "78vw",
                      pt: 2.5,
                      pb: 2.5,
                      pr: 2.5,
                      pl: 4.6,
                      bgcolor: "#fffefe",
                      borderRadius: 3,
                      boxShadow: "0 14px 30px rgba(0,0,0,0.12)",
                      border: "1px solid rgba(13, 71, 161, 0.18)",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Box
                      sx={{
                        height: 48,
                        borderRadius: 2.4,
                        border: "2px solid rgba(13, 71, 161, 0.22)",
                        display: "flex",
                        alignItems: "center",
                        px: 1.6,
                        transition:
                          "border-color .15s ease, box-shadow .15s ease",
                        ...(searchFocused
                          ? {
                            borderColor: "#e65100",
                            boxShadow:
                              "0 0 0 5px rgba(230, 81, 0, 0.35)",
                          }
                          : {}),
                      }}
                    >
                      <InputBase
                        placeholder="Search"
                        inputRef={floatingInputRef}
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setSearchFocused(false)}
                        onChange={(e) => onSearch(e.target.value)}
                        sx={{
                          flex: 1,
                          color: "#0d47a1",
                          fontWeight: 650,
                          fontSize: "1rem",
                          "& .MuiInputBase-input": { padding: "6px 0" },
                          "& .MuiInputBase-input::placeholder": {
                            color: "rgba(13, 71, 161, 0.35)",
                            opacity: 1,
                            fontWeight: 600,
                          },
                        }}
                      />

                      <Button
                        onClick={closeSearchAndClear}
                        sx={{
                          minWidth: 40,
                          width: 40,
                          height: 40,
                          borderRadius: 2,
                          color: "#1e5bb8",
                          "&:hover": { bgcolor: "rgba(30, 91, 184, 0.10)" },
                        }}
                        aria-label="Close search"
                      >
                        <CloseIcon fontSize="small" />
                      </Button>
                    </Box>
                  </Box>
                )}
              </Box>
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
              <Button
                variant="contained"
                onClick={() => setShown((prev) => !prev)}
                sx={{
                  width: { xs: 60, md: 71 },
                  height: { xs: 42, md: 42 },
                  minWidth: "unset",
                  borderRadius: 2,
                  backgroundColor: "#e65100",
                  "&:hover": { backgroundColor: "#b33f00" },
                  padding: 0,
                }}
              >
                <ManageAccountsIcon
                  sx={{ fontSize: { xs: 31, md: 34.5 }, color: "#ffe0c7" }}
                />
              </Button>

              <Button
                variant="contained"
                onClick={() => {
                  const isLogged = Boolean(localStorage.getItem("idUser"));
                  const cartHasItems = badgeQuantity > 0;

                  if (!cartHasItems) {
                    navigate("/checkout");
                    return;
                  }

                  if (isLogged) {
                    navigate("/checkout");
                    return;
                  }

                  confirmAlert({
                    title: "Checkout",
                    message:
                      "You’re not signed in. Continue as guest or sign in?",
                    confirmText: "Continue as guest",
                    cancelText: "Sign in / Sign up",
                    onConfirm: () => navigate("/checkout?guest=1"),
                    onCancel: () => navigate("/sign-in"),
                    onDismiss: () => { },
                  });
                }}
                sx={{
                  width: { xs: 60, md: 73 },
                  height: { xs: 42, md: 42 },
                  minWidth: "unset",
                  borderRadius: 2,
                  backgroundColor: "#e65100",
                  "&:hover": { backgroundColor: "#b33f00" },
                  padding: 0,
                }}
              >
                <ShoppingCartIcon
                  sx={{ fontSize: { xs: 28, md: 31 }, color: "#ffe0c7" }}
                />
                <CartBadge
                  badgeContent={badgeQuantity}
                  overlap="circular"
                  sx={{ pointerEvents: "none", }}
                />
              </Button>

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
