import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useNavigate } from "react-router-dom";

import { useAppAlert } from "../hooks/useAppAlert";
import { useAppContext } from "../context/context";

type CheckoutTitleBarProps = {
    title: string;
};

export default function CheckoutTitleBar({
    title,
}: CheckoutTitleBarProps) {
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

            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    bgcolor: "rgba(255, 250, 242, 0.92)",
                    color: "#0d47a1",
                    backdropFilter: "blur(10px)",
                    borderBottom: "1px solid rgba(13, 71, 161, 0.08)",
                    boxShadow: "0 2px 8px rgba(13, 71, 161, 0.06)",
                }}
            >
                <Toolbar
                    disableGutters
                    sx={{
                        minHeight: {
                            xs: 64,
                            sm: 68,
                            md: 72,
                        },
                        px: {
                            xs: 2,
                            sm: 2.5,
                            md: 3,
                        },
                    }}
                >
                    <Typography
                        component="h1"
                        sx={{
                            color: "#0d47a1",
                            fontWeight: 900,
                            letterSpacing: "0.11em",
                            textTransform: "uppercase",
                            fontSize: {
                                xs: "1.05rem",
                                md: "1.2rem",
                            },
                        }}
                    >
                        {title}
                    </Typography>

                    <Box sx={{ flexGrow: 1 }} />

                    <Button
                        variant="contained"
                        onClick={handleExitCheckout}
                        onPointerUp={(event) =>
                            (
                                event.currentTarget as HTMLButtonElement
                            ).blur()
                        }
                        startIcon={<ExitToAppIcon />}
                        sx={{
                            minWidth: "unset",
                            height: {
                                xs: 38,
                                sm: 40,
                                md: 42,
                            },
                            px: {
                                xs: 1.4,
                                sm: 1.7,
                                md: 2,
                            },

                            borderRadius: 2,
                            bgcolor: "#e65100",
                            color: "#ffe0c7",

                            fontWeight: 800,
                            fontSize: {
                                xs: "0.72rem",
                                md: "0.82rem",
                            },
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",

                            WebkitTapHighlightColor: "transparent",

                            "& .MuiButton-startIcon": {
                                mr: {
                                    xs: "3px",
                                    md: "5px",
                                },

                                "& svg": {
                                    fontSize: {
                                        xs: 18,
                                        md: 20,
                                    },
                                },
                            },

                            "@media (hover: hover) and (pointer: fine)": {
                                "&:hover": {
                                    bgcolor: "#b33f00",
                                },
                            },

                            "@media (hover: none) and (pointer: coarse)": {
                                "&:focus, &:focus-visible, &.Mui-focusVisible":
                                {
                                    bgcolor: "#e65100",
                                },
                            },
                        }}
                    >
                        Exit
                    </Button>
                </Toolbar>
            </AppBar>
        </>
    );
}