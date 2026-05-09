import { useState } from "react";
import {
    Backdrop,
    Button,
    Dialog,
    DialogContent,
    IconButton,
    Paper,
    Typography,
} from "@mui/material";
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import CloseIcon from "@mui/icons-material/Close";

type SignInDemoTipProps = {
    isMobile?: boolean;
};

export default function SignInDemoTip({
    isMobile = false,
}: SignInDemoTipProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                sx={{
                    position: "fixed",

                    right: isMobile ? 18 : 92,
                    bottom: isMobile
                        ? "calc(96px + env(safe-area-inset-bottom))"
                        : 168,

                    zIndex: 30,

                    minWidth: 0,
                    width: isMobile ? 54 : 56,
                    height: isMobile ? 54 : 56,

                    borderRadius: "50%",

                    bgcolor: "#fff3e0",
                    border: "2px solid #e65100",
                    color: "#e65100",

                    boxShadow: "0 6px 16px rgba(0,0,0,0.14)",

                    transition: "all .18s ease",

                    "&:hover": {
                        bgcolor: "#ffe0c7",
                        transform: "translateY(-1px)",
                    },
                }}
            >
                <LightbulbIcon
                    sx={{
                        fontSize: isMobile ? 27 : 29,
                    }}
                />
            </Button>

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                maxWidth="xs"
                fullWidth
                BackdropComponent={Backdrop}
                BackdropProps={{
                    sx: {
                        backgroundColor: "rgba(0,0,0,0.38)",
                        backdropFilter: "blur(3px)",
                    },
                }}
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        bgcolor: "#fffdf8",
                        overflow: "hidden",
                        boxShadow: "0 16px 44px rgba(0,0,0,0.22)",
                    },
                }}
            >
                <DialogContent
                    sx={{
                        p: 3,
                        position: "relative",
                    }}
                >
                    <IconButton
                        onClick={() => setOpen(false)}
                        sx={{
                            position: "absolute",
                            top: 11,
                            right: 11,
                            color: "#0d47a1",
                        }}
                    >
                        <CloseIcon />
                    </IconButton>

                    <Typography
                        sx={{
                            mt: 0.4,
                            fontSize: { xs: 22, sm: 24.5 },
                            fontWeight: 900,
                            color: "#0b4aa8",
                            lineHeight: 1.05,
                        }}
                    >
                        Demo Admin Credentials
                    </Typography>

                    <Typography
                        sx={{
                            mt: 1.4,
                            color: "rgba(0,0,0,0.72)",
                            lineHeight: 1.55,
                            fontSize: "0.94rem",
                        }}
                    >
                        Use the credentials below to access the Fast Fuel admin dashboard demo, test order management features, and view customer messages.
                    </Typography>

                    <Paper
                        elevation={0}
                        sx={{
                            mt: 2.3,
                            p: 2,
                            borderRadius: 2.2,
                            bgcolor: "#fff4e8",
                            border: "1px solid rgba(230,81,0,0.22)",
                        }}
                    >


                        <Typography
                            sx={{
                                fontSize: "0.8rem",
                                fontWeight: 800,
                                color: "rgba(0,0,0,0.72)",
                                textTransform: "uppercase",
                                letterSpacing: "0.04em",
                            }}
                        >
                            Email
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.4,
                                mb: 2,
                                fontFamily: "monospace",
                                color: "#0d47a1",
                                fontSize: "0.98rem",
                                fontWeight: 700,
                            }}
                        >
                            fast-fuel@admin.com
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: "0.8rem",
                                fontWeight: 800,
                                color: "rgba(0,0,0,0.72)",
                                textTransform: "uppercase",
                                letterSpacing: "0.04em",
                            }}
                        >
                            Password
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.4,
                                fontFamily: "monospace",
                                color: "#0d47a1",
                                fontSize: "0.98rem",
                                fontWeight: 700,
                            }}
                        >
                            FastFuel123!
                        </Typography>
                    </Paper>
                </DialogContent>
            </Dialog>
        </>
    );
}