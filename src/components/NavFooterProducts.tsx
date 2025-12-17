import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

// Ícones
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HistoryIcon from "@mui/icons-material/History";
import EmailIcon from "@mui/icons-material/Email";
import NoAccountsIcon from "@mui/icons-material/NoAccounts";

export default function NavFooterProducts() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  if (!isMobile) return null;

  const items = [
    { label: "Signin / Signup", Icon: AccountCircleIcon, path: "/sign-in", disabled: false },
    { label: "My Orders", Icon: HistoryIcon, path: "/history", disabled: false },
    { label: "Contact Us", Icon: EmailIcon, path: "/contact-us", disabled: false },
    { label: "Delete Account", Icon: NoAccountsIcon, path: "/deleteaccount", disabled: true },
  ] as const;

  return (
    <Paper
      elevation={0}
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        width: "100%",
        height: 75,
        zIndex: 1300,
        backgroundColor: "#fff3e0",
        boxShadow: "0px -3px 10px rgba(0,0,0,0.25)",
        borderRadius: 0,
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
        {items.map(({ label, Icon, path, disabled }) => (
          <Tooltip key={label} title={label} placement="top" arrow>
            <span>
              {/* span necessário pro Tooltip funcionar com disabled */}
              <IconButton
                disabled={disabled}
                onClick={() => !disabled && navigate(path)}
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: "14px",
                  color: "#e65100",
                  opacity: disabled ? 0.45 : 1,
                  transition: "transform 0.2s ease",
                  "&:hover": {
                    transform: disabled ? "none" : "translateY(-2px)",
                  },
                }}
              >
                <Icon sx={{ fontSize: 28 }} />
              </IconButton>
            </span>
          </Tooltip>
        ))}
      </Box>
    </Paper>
  );
}
