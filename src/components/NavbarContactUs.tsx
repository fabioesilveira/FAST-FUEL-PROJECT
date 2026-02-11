import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/fast-fuel.png";

function NavbarContactUs() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  return (
    <AppBar position="fixed" sx={{ backgroundColor: "#fff3e0" }}>
      <Toolbar
        sx={{
          minHeight: 80,
          position: "relative",
          justifyContent: { xs: "center", md: "flex-start" },
          alignItems: "center",
          px: { xs: 2, md: 2 },
          pr: { xs: 2, md: 4 },
        }}
      >
        {/* ← BACK BUTTON (mobile only) */}
        {isMobile && (
          <IconButton
            onClick={() => navigate("/")}
            aria-label="Go back"
            sx={{
              position: "absolute",
              left: 20,
              width: 40,
              height: 40,
              bgcolor: "#1e5bb8",
              color: "#ffffff",
              "&:hover": {
                bgcolor: "#0d47a1",
              },
              "&:active": {
                transform: "scale(0.96)",
              },
            }}
          >
            <ArrowBackIcon sx={{ fontSize: 22 }} />
          </IconButton>
        )}

        {/* LOGO */}
        <Box
          component="a"
          href="/"
          sx={{
            display: "flex",
            alignItems: "center",
            ml: { xs: 0, md: -2.8 },
          }}
        >
          <Box
            component="img"
            src={Logo}
            alt="Fast Fuel Logo"
            sx={{
              height: { xs: 74, md: 76 },
              mt: { xs: 0.2, md: 0.2 },
              width: "auto",
              objectFit: "contain",
              transform: { xs: "scaleX(1.04)", md: "scaleX(1.07)" },
              transformOrigin: "left center",
            }}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default NavbarContactUs;
