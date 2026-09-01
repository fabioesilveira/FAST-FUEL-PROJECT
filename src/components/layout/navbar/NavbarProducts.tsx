import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Logo from "../../../assets/fast-fuel.png";
import { Link, useNavigate } from "react-router-dom";
import {
  useEffect,
  useRef,
  useState,
} from "react";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MenuIcon from "@mui/icons-material/Menu";
import StarIcon from "@mui/icons-material/Star";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import NoAccountsIcon from "@mui/icons-material/NoAccounts";
import HistoryIcon from "@mui/icons-material/History";
import EmailIcon from "@mui/icons-material/Email";

import Badge, {
  badgeClasses,
} from "@mui/material/Badge";

import { useAppContext } from "../../../context/context";
import { useAppAlert } from "../../../hooks/useAppAlert";
import { clearAuthStorage } from "../../../api";

type DropdownItem = {
  label: string;
  icon: any;
  path?: string;
  action?: () => void;
};

const guestDropdownItems: DropdownItem[] = [
  {
    label: "Sign In / Sign Up",
    icon: AccountCircleIcon,
    path: "/sign-in",
  },
  {
    label: "My Orders",
    icon: HistoryIcon,
    path: "/orders",
  },
  {
    label: "Reviews",
    icon: StarIcon,
    path: "/reviews",
  },
  {
    label: "Contact Us",
    icon: EmailIcon,
    path: "/contact-us",
  },
  {
    label: "About",
    icon: InfoOutlinedIcon,
    path: "/about",
  },
];

const iconSizes: Record<string, number> = {
  "Sign In / Sign Up": 22.5,
  "Sign Out": 25,
  "My Orders": 25,
  Reviews: 25.5,
  "Contact Us": 21.5,
  About: 23.5,
  "Delete Account": 23,
};

const CartBadge = styled(Badge)`
  & .${badgeClasses.badge} {
    top: -12px;
    right: -6px;
    background-color: #1e5bb8;
    color: #fff;
  }
`;

function NavbarProducts() {
  const navigate = useNavigate();

  const { order } =
    useAppContext();

  const [badgeQuantity, setBadgeQuantity] =
    useState(0);

  const [shown, setShown] =
    useState(false);

  const [
    dropdownItemsChange,
    setDropDownChange,
  ] = useState<DropdownItem[]>(
    guestDropdownItems
  );

  const menuRef =
    useRef<HTMLDivElement | null>(null);

  const {
    showAlert,
    AlertUI,
    confirmAlert,
    ConfirmUI,
  } = useAppAlert({
    vertical: "top",
    horizontal: "center",
  });

  const handleClickSignout = () => {
    clearAuthStorage();

    setShown(false);

    showAlert(
      "Signed out successfully",
      "success"
    );

    setDropDownChange(
      guestDropdownItems
    );

    setTimeout(() => {
      navigate("/sign-in");
    }, 2000);
  };

  useEffect(() => {
    if (
      localStorage.getItem("idUser")
    ) {
      setDropDownChange([
        {
          label: "Sign Out",
          icon: AccountCircleIcon,
          action: handleClickSignout,
        },
        {
          label: "My Orders",
          icon: HistoryIcon,
          path: "/orders",
        },
        {
          label: "Reviews",
          icon: StarIcon,
          path: "/reviews",
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
        },
        {
          label: "About",
          icon: InfoOutlinedIcon,
          path: "/about",
        },
      ]);
    } else {
      setDropDownChange(
        guestDropdownItems
      );
    }
  }, []);

  useEffect(() => {
    const qtdTotal =
      order.reduce(
        (acc, element) =>
          acc +
          (element.quantidade ?? 0),
        0
      );

    setBadgeQuantity(
      qtdTotal
    );
  }, [order]);

  useEffect(() => {
    function handlePointerDownOutside(
      event: PointerEvent
    ) {
      const target =
        event.target as Node;

      if (
        menuRef.current &&
        !menuRef.current.contains(
          target
        )
      ) {
        setShown(false);
      }
    }

    document.addEventListener(
      "pointerdown",
      handlePointerDownOutside,
      true
    );

    return () =>
      document.removeEventListener(
        "pointerdown",
        handlePointerDownOutside,
        true
      );
  }, []);

  useEffect(() => {
    function handleKeyDown(
      event: KeyboardEvent
    ) {
      if (
        event.key === "Escape"
      ) {
        setShown(false);
      }
    }

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () =>
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
  }, []);

  return (
    <>
      {AlertUI}
      {ConfirmUI}

      <AppBar
        position="fixed"
        sx={{
          bgcolor: "#fff3e0",

          zIndex: (t) =>
            t.zIndex.appBar,

          transform:
            "translateZ(0)",

          willChange:
            "transform",

          backfaceVisibility:
            "hidden",
        }}
      >
        <Box
          sx={{
            width: "100%",
          }}
        >
          <Toolbar
            disableGutters
            sx={{
              height: 78,
              minHeight:
                "78px !important",

              px: {
                xs: 1,
                md: 2,
              },

              gap: {
                xs: 1,
                md: 1.5,
              },
            }}
          >
            {/* MENU */}
            <Box
              ref={menuRef}
              sx={{
                position:
                  "relative",

                display:
                  "flex",

                alignItems:
                  "center",

                ml: {
                  xs: 0.6,
                  md: 0,
                },

                order: {
                  xs: 1,
                  md: 2,
                },
              }}
            >
              <Button
                variant="contained"
                onPointerUp={(e) =>
                  (
                    e.currentTarget as HTMLButtonElement
                  ).blur()
                }
                onClick={() =>
                  setShown(
                    (prev) =>
                      !prev
                  )
                }
                aria-label="Open menu"
                sx={{
                  width: {
                    xs: 54,
                    md: 60,
                  },

                  height: {
                    xs: 40,
                    md: 42,
                  },

                  minWidth:
                    "unset",

                  borderRadius:
                    2,

                  backgroundColor:
                    "#e65100",

                  padding: 0,

                  "@media (hover: hover) and (pointer: fine)":
                  {
                    "&:hover":
                    {
                      backgroundColor:
                        "#b33f00",
                    },
                  },

                  "@media (hover: none) and (pointer: coarse)":
                  {
                    "&:focus, &:focus-visible, &.Mui-focusVisible":
                    {
                      backgroundColor:
                        "#e65100",

                      boxShadow:
                        "none",
                    },
                  },
                }}
              >
                <MenuIcon
                  sx={{
                    fontSize:
                    {
                      xs: 28,
                      md: 31,
                    },

                    color:
                      "#ffe0c7",
                  }}
                />
              </Button>

              {/* MENU DROPDOWN */}
              {shown && (
                <Box
                  sx={{
                    position:
                      "absolute",

                    top:
                      "calc(100% + 12px)",

                    left: 0,

                    display:
                      "flex",

                    flexDirection:
                      "column",

                    gap: 1,

                    backgroundColor:
                      "#fff3e0",

                    padding: 1.2,

                    borderRadius:
                      2,

                    boxShadow:
                      "0 6px 16px rgba(0,0,0,0.30)",

                    zIndex:
                      9999,

                    width:
                      210,
                  }}
                >
                  {dropdownItemsChange.map(
                    (item) => {
                      const {
                        label,
                        icon: Icon,
                        path,
                        action,
                      } = item;

                      const commonSx =
                        {
                          display:
                            "flex",

                          alignItems:
                            "center",

                          justifyContent:
                            "flex-start",

                          gap: 1.2,

                          height:
                            41,

                          width:
                            "100%",

                          px: 1.5,

                          py: 0.8,

                          borderRadius:
                            1.5,

                          textTransform:
                            "none",

                          border:
                            "2px solid #0d47a1",

                          color:
                            "#0d47a1",

                          fontWeight:
                            600,

                          bgcolor:
                            "rgba(230, 81, 0, 0.14)",

                          boxShadow:
                            "0 2px 6px rgba(13, 71, 161, 0.18)",

                          "@media (hover: hover) and (pointer: fine)":
                          {
                            "&:hover":
                            {
                              bgcolor:
                                "rgba(230, 81, 0, 0.22)",

                              boxShadow:
                                "0 4px 10px rgba(13, 71, 161, 0.28)",
                            },
                          },

                          "&:active":
                          {
                            bgcolor:
                              "rgba(230, 81, 0, 0.28)",

                            transform:
                              "translateY(1px)",
                          },
                        } as const;

                      if (
                        action
                      ) {
                        return (
                          <Button
                            key={
                              label
                            }
                            onClick={() => {
                              action();

                              setShown(
                                false
                              );
                            }}
                            sx={
                              commonSx
                            }
                          >
                            <Box
                              sx={{
                                width:
                                  24,

                                display:
                                  "flex",
                              }}
                            >
                              <Icon
                                sx={{
                                  color:
                                    "#e85f10",

                                  fontSize:
                                    iconSizes[
                                    label
                                    ] ??
                                    24,
                                }}
                              />
                            </Box>

                            {
                              label
                            }
                          </Button>
                        );
                      }

                      if (!path) {
                        return null;
                      }

                      return (
                        <Button
                          key={
                            label
                          }
                          component={
                            Link
                          }
                          to={
                            path
                          }
                          onClick={() =>
                            setShown(
                              false
                            )
                          }
                          sx={
                            commonSx
                          }
                        >
                          <Box
                            sx={{
                              width:
                                24,

                              display:
                                "flex",
                            }}
                          >
                            <Icon
                              sx={{
                                color:
                                  "#e85f10",

                                fontSize:
                                  iconSizes[
                                  label
                                  ] ??
                                  24,
                              }}
                            />
                          </Box>

                          {
                            label
                          }
                        </Button>
                      );
                    }
                  )}
                </Box>
              )}
            </Box>

            {/* LOGO */}
            <Box
              component="a"
              href="#"
              onClick={(e) => {
                e.preventDefault();

                navigate("/");
              }}
              sx={{
                display:
                  "flex",

                alignItems:
                  "center",

                ml: {
                  xs: -0.8,
                  md: -2.3,
                },

                order: {
                  xs: 2,
                  md: 1,
                },
              }}
            >
              <Box
                component="img"
                src={Logo}
                alt="Fast Fuel Logo"
                sx={{
                  height: {
                    xs: 70,
                    md: 76,
                  },

                  mt: {
                    xs: -0.3,
                    sm: 0,
                    md: 0,
                  },

                  width:
                    "auto",

                  objectFit:
                    "contain",

                  transform:
                  {
                    xs: "scaleX(1.04)",
                    md: "scaleX(1.07)",
                  },

                  transformOrigin:
                    "left center",
                }}
              />
            </Box>

            {/* SPACER */}
            <Box
              sx={{
                flexGrow: 1,
                order: 3,
              }}
            />

            {/* CART */}
            <Box
              sx={{
                display:
                  "flex",

                alignItems:
                  "center",

                marginLeft:
                  "auto",

                order: 4,

                mr: {
                  xs: 0.8,
                  sm: 0.8,
                  md: 0.2,
                },
              }}
            >
              <Button
                variant="contained"
                aria-label="Open cart"
                onClick={() => {
                  const isLogged =
                    Boolean(
                      localStorage.getItem(
                        "idUser"
                      )
                    );

                  const cartHasItems =
                    badgeQuantity >
                    0;

                  if (
                    !cartHasItems
                  ) {
                    navigate(
                      "/checkout"
                    );

                    return;
                  }

                  if (
                    isLogged
                  ) {
                    navigate(
                      "/checkout"
                    );

                    return;
                  }

                  confirmAlert({
                    title:
                      "Checkout",

                    message:
                      "You’re not signed in. Continue as guest or sign in?",

                    confirmText:
                      "Continue as guest",

                    cancelText:
                      "Sign in / Sign up",

                    onConfirm:
                      () =>
                        navigate(
                          "/checkout?guest=1"
                        ),

                    onCancel:
                      () =>
                        navigate(
                          "/sign-in"
                        ),

                    onDismiss:
                      () => { },
                  });
                }}
                sx={{
                  width: {
                    xs: 60,
                    md: 71,
                  },

                  height: {
                    xs: 40,
                    md: 42,
                  },

                  minWidth:
                    "unset",

                  borderRadius:
                    2,

                  backgroundColor:
                    "#e65100",

                  padding: 0,

                  "@media (hover: hover) and (pointer: fine)":
                  {
                    "&:hover":
                    {
                      backgroundColor:
                        "#b33f00",
                    },
                  },

                  "@media (hover: none) and (pointer: coarse)":
                  {
                    "&:focus, &:focus-visible, &.Mui-focusVisible":
                    {
                      backgroundColor:
                        "#e65100",

                      boxShadow:
                        "none",
                    },
                  },
                }}
              >
                <ShoppingCartIcon
                  sx={{
                    fontSize:
                    {
                      xs: 27.5,
                      md: 30.5,
                    },

                    color:
                      "#ffe0c7",
                  }}
                />

                <CartBadge
                  badgeContent={
                    badgeQuantity
                  }
                  overlap="circular"
                  sx={{
                    pointerEvents:
                      "none",
                  }}
                />
              </Button>
            </Box>
          </Toolbar>
        </Box>
      </AppBar>
    </>
  );
}

export default NavbarProducts;