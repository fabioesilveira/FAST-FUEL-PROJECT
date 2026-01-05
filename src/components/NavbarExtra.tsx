import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Logo from "../assets/fast-fuel.png";

function NavbarExtra() {
    return (
        <AppBar position="fixed" sx={{ backgroundColor: "#fff3e0" }}>
            <Toolbar
                sx={{
                    minHeight: 80,
                    justifyContent: { xs: "center", md: "flex-start" },
                    alignItems: "center",
                    px: { xs: 2, md: 2 },
                    pr: { xs: 2, md: 4 },
                }}
            >
                <Box
                    component="a"
                    href="#"
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

export default NavbarExtra;
