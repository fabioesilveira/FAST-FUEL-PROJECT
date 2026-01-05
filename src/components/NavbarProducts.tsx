import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Logo from "../assets/fast-fuel.png";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import HomeIcon from "@mui/icons-material/Home";
import Badge, { badgeClasses } from "@mui/material/Badge";
import { useAppContext } from "../context/context";

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
  const { order } = useAppContext();
  const [badgeQuantity, setBadgeQuantity] = useState(0);

  useEffect(() => {
    const qtdTotal = order.reduce((acc, element) => acc + element.quantidade, 0);
    setBadgeQuantity(qtdTotal);
  }, [order]);

  return (
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
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
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

          {/* Spacer */}
          <Box sx={{ flexGrow: 1 }} />

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
            {/* HOME */}
            <Button
              variant="contained"
              onClick={() => navigate("/")}
              sx={{
                width: { xs: 58, md: 71 },
                height: { xs: 42, md: 42 },
                minWidth: "unset",
                borderRadius: 2,
                backgroundColor: "#e65100",
                "&:hover": { backgroundColor: "#b33f00" },
                padding: 0,
              }}
            >
              <HomeIcon
                sx={{
                  fontSize: { xs: 30, md: 34.5 },
                  color: "#ffe0c7",
                }}
              />
            </Button>

            {/* CART */}
            <Button
              variant="contained"
              onClick={() => navigate("/checkout")}
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
                sx={{
                  fontSize: { xs: 28, md: 31 },
                  color: "#ffe0c7",
                }}
              />

              <CartBadge
                badgeContent={badgeQuantity}
                overlap="circular"
                sx={{ pointerEvents: "none" }}
              />
            </Button>
          </Box>
        </Toolbar>
      </Box>
    </AppBar>
  );
}

export default NavbarProducts;
