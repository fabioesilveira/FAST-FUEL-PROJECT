import * as React from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import type { SvgIconComponent } from "@mui/icons-material";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HistoryIcon from "@mui/icons-material/History";
import EmailIcon from "@mui/icons-material/Email";
import NoAccountsIcon from "@mui/icons-material/NoAccounts";

import { useAppAlert } from "../hooks/useAppAlert";

type Item = {
  label: string;
  Icon: SvgIconComponent;
  path: string;
  requiresAuth?: boolean;
};

const BLUE = "#0d47a1";
const ORANGE = "#e85f10"; // seu laranja
const ORANGE_SOFT = "rgba(230, 81, 0, 0.18)";
const ORANGE_SOFT_ACTIVE = "rgba(230, 81, 0, 0.24)";

const items: Item[] = [
  { label: "Signin / Signup", Icon: AccountCircleIcon, path: "/sign-in" },
  { label: "My Orders", Icon: HistoryIcon, path: "/history" },
  { label: "Contact Us", Icon: EmailIcon, path: "/contact-us" },
  {
    label: "Delete Account",
    Icon: NoAccountsIcon,
    path: "/deleteaccount",
    requiresAuth: true,
  },
];

export default function NavFooterProducts() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const { showAlert, AlertUI } = useAppAlert({
    vertical: "top",
    horizontal: "center",
  });

  if (!isMobile) return null;

  const handleClick = (item: Item) => {
    const isLogged = Boolean(localStorage.getItem("idUser"));

    if (item.requiresAuth && !isLogged) {
      showAlert("Please sign in to delete your account", "warning");
      return;
    }

    navigate(item.path);
  };

  return (
    <>
      {AlertUI}

      <Paper
        elevation={0}
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: 78,
          zIndex: 1300,
          backgroundColor: "#fff3e0",
          borderTop: "2px solid rgba(13, 71, 161, 0.25)",
          boxShadow: "0 -6px 18px rgba(13,71,161,.18)",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            alignItems: "center",
            justifyItems: "center",
            px: 1,
          }}
        >
          {items.map((item) => (
            <Tooltip key={item.label} title={item.label} placement="top" arrow>
              <IconButton
                onClick={() => handleClick(item)}
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 2,
                  border: "2px solid transparent",
                  color: ORANGE,
                  backgroundColor: "transparent",
                  transition:
                    "transform 0.18s ease, background-color 0.18s ease, border-color 0.18s ease",
                  "&:hover": {
                    backgroundColor: ORANGE_SOFT,
                    borderColor: BLUE,
                    transform: "translateY(-2px)",
                  },
                  "&:active": {
                    transform: "translateY(0)",
                    backgroundColor: ORANGE_SOFT_ACTIVE,
                  },
                }}
              >
                <item.Icon sx={{ fontSize: 26, color: ORANGE }} />
              </IconButton>
            </Tooltip>
          ))}
        </Box>
      </Paper>
    </>
  );
}
