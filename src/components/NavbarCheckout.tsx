import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useNavigate } from "react-router-dom";

import Logo from "../assets/fast-fuel.png";
import { useAppAlert } from "../hooks/useAppAlert";
import { useAppContext } from "../context/context";

export default function NavbarCheckout() {
    const navigate = useNavigate();
    const { order } = useAppContext(); 

    const { confirmAlert, AlertUI, ConfirmUI } = useAppAlert({
        vertical: "top",
        horizontal: "center",
    });

    function handleExitCheckout() {
       
        if (!order || order.length === 0) {
            navigate("/");
            return;
        }

        confirmAlert({
            title: "Almost there!",
            message:
                "You are so close to finishing your order. Are you sure you want to exit?",
            confirmText: "Yes, exit",
            cancelText: "No, stay",
            onConfirm: () => navigate("/"),
            onCancel: () => {},
            onDismiss: () => {},
        });
    }

    return (
        <>
            {AlertUI}
            {ConfirmUI}

            <AppBar position="fixed" sx={{ backgroundColor: "#fff3e0" }}>
                <Box sx={{ width: "100%" }}>
                    <Toolbar disableGutters sx={{ minHeight: 80, px: { xs: 1, md: 2 } }}>
                        <Box
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

                        <Box sx={{ flexGrow: 1 }} />

                        <Button
                            variant="contained"
                            onClick={handleExitCheckout}
                            startIcon={<ExitToAppIcon />}
                            sx={{
                                height: { xs: 40, md: 45 },
                                borderRadius: 2,
                                backgroundColor: "#e65100",
                                color: "#ffe0c7",
                                fontWeight: 800,
                                letterSpacing: "0.06em",
                                textTransform: "uppercase",
                                boxShadow: "0px 3px 14px rgba(0,0,0,0.22)",
                                "&:hover": { backgroundColor: "#b33f00" },
                                px: { xs: 1.7, md: 2.2 },
                                mr: 1,
                            }}
                        >
                            Exit Checkout
                        </Button>
                    </Toolbar>
                </Box>
            </AppBar>
        </>
    );
}
