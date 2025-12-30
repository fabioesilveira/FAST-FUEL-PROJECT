import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Logo from "../assets/fast-fuel.png";

function NavbarProducts() {
    return (
        <AppBar position="fixed" sx={{ backgroundColor: "#fff3e0" }}>
            <Toolbar
                disableGutters
                sx={{
                    minHeight: 80,
                    pl: { xs: 2, md: 0 },   // desktop colado na margem
                    pr: { xs: 2, md: 4 },   // espaço só do lado direito no desktop
                    display: "flex",
                    alignItems: "center",
                    justifyContent: { xs: "center", md: "flex-start" },
                }}
            >
                <Box
                    component="a"
                    href="#"
                    sx={{
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <Box
                        component="img"
                        src={Logo}
                        alt="Fast Fuel Logo"
                        sx={{
                            height: { xs: 68, md: 70 },
                            mt: { xs: 0, sm: 0.2, md: 0.2 },
                            width: "auto",
                            objectFit: "contain",
                            transform: { xs: "scaleX(1.04)", md: "scaleX(1.07)" }, // estica no desktop
                            transformOrigin: "left center", // estica puxando da esquerda
                        }}
                    />
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default NavbarProducts;
