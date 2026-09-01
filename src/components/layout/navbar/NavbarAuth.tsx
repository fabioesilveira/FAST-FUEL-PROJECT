import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Logo from "../../../assets/fast-fuel.png";

function NavbarAuth() {
    return (
        <AppBar
            position="fixed"
            sx={{
                backgroundColor: "#fff3e0",
            }}
        >
            <Toolbar
                disableGutters
                sx={{
                    height: 78,
                    minHeight: "78px !important",

                    px: {
                        xs: 1,
                        md: 2,
                    },

                    justifyContent: {
                        xs: "center",
                        md: "flex-start",
                    },

                    alignItems: "center",
                }}
            >
                <Box
                    component="a"
                    href="#"
                    sx={{
                        display: "flex",
                        alignItems: "center",

                        ml: {
                            xs: 0,
                            md: -2.3,
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
                                md: 0,
                            },

                            width: "auto",

                            objectFit: "contain",

                            transform: {
                                xs: "scaleX(1.04)",
                                md: "scaleX(1.07)",
                            },

                            transformOrigin:
                                "left center",
                        }}
                    />
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default NavbarAuth;