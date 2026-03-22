import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useNavigate } from "react-router-dom";

import Logo from "../assets/fast-fuel.png";
import { useAppAlert } from "../hooks/useAppAlert";
import { useAppContext } from "../context/context";

export default function NavbarAction() {
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
            onCancel: () => { },
            onDismiss: () => { },
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
                            onPointerUp={(e) => (e.currentTarget as HTMLButtonElement).blur()}
                            onClick={handleExitCheckout}
                            startIcon={<ExitToAppIcon />}
                            sx={{
                                height: { xs: 40, sm: 40, md: 45 },

                                borderRadius: 2,
                                backgroundColor: "#e65100",
                                color: "#ffe0c7",

                                fontWeight: 800,
                                letterSpacing: { xs: "0.05em", md: "0.06em" },
                                textTransform: "uppercase",

                                px: { xs: 1.6, sm: 1.6, md: 2.2 },
                                fontSize: { xs: "0.72rem", sm: "0.74rem", md: "0.84rem" },

                                mr: { xs: 0.8, sm: 0.8, md: 0.8 },

                                minWidth: "unset",
                                flexShrink: 0,

                                WebkitTapHighlightColor: "transparent",

                                // ICON menor no mobile
                                "& .MuiButton-startIcon": {
                                    marginRight: { xs: "3px", sm: "3px", md: "4px" },
                                    "& svg": {
                                        fontSize: { xs: 17, sm: 18, md: 20 },
                                    },
                                },

                                // hover só desktop
                                "@media (hover: hover) and (pointer: fine)": {
                                    "&:hover": { backgroundColor: "#b33f00" },
                                },

                                // mobile fix (não ficar “clicado”)
                                "@media (hover: none) and (pointer: coarse)": {
                                    "&:focus, &:focus-visible, &.Mui-focusVisible": {
                                        backgroundColor: "#e65100",
                                    },
                                },
                            }}
                        >
                            Exit
                        </Button>

                    </Toolbar>
                </Box>
            </AppBar>
        </>
    );
}
