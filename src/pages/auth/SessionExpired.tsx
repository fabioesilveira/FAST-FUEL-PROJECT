import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

export default function SessionExpired() {
    useDocumentTitle("FastFuel • Session Expired");

    const navigate = useNavigate();

    const buttonSx = {
        flex: 1,
        height: 42,
        borderRadius: "8px",
        fontWeight: 800,
        textTransform: "uppercase",
        letterSpacing: "0.04em",
        fontSize: "0.80rem",
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                px: 2,
                pt: { xs: "180px", sm: "200px" },
                bgcolor: "#ffffff",
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    width: "100%",
                    maxWidth: 440,
                    p: { xs: 3, sm: 4 },
                    textAlign: "center",
                    borderRadius: 3,
                    border: "1px solid rgba(13,71,161,0.18)",
                    boxShadow:
                        "0 4px 12px rgba(13,71,161,0.12), 0 10px 24px rgba(13,71,161,0.08)",
                }}
            >
                <Typography
                    sx={{
                        color: "#0d47a1",
                        fontWeight: 900,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        fontSize: { xs: "1.15rem", sm: "1.3rem" },
                        mb: 1.2,
                    }}
                >
                    Session Expired
                </Typography>

                <Typography
                    sx={{
                        color: "text.secondary",
                        fontSize: "0.95rem",
                        lineHeight: 1.55,
                        mb: 3,
                    }}
                >
                    Your session has expired. You can sign in again to pick up where you left off, or return home.
                </Typography>

                <Stack direction="row" spacing={1.2}>
                    <Button
                        variant="outlined"
                        onClick={() => navigate("/")}
                        sx={{
                            ...buttonSx,
                            border: "1.5px solid #0d47a1",
                            color: "#0d47a1",
                            "&:hover": {
                                borderColor: "#0d47a1",
                                backgroundColor: "rgba(13,71,161,0.05)",
                            },
                        }}
                    >
                        Go Home
                    </Button>

                    <Button
                        variant="contained"
                        onClick={() => navigate("/sign-in")}
                        sx={{
                            ...buttonSx,
                            bgcolor: "#1e5bb8",
                            color: "#fff",
                            "&:hover": {
                                bgcolor: "#174a96",
                            },
                        }}
                    >
                        Sign In
                    </Button>
                </Stack>
            </Paper>
        </Box>
    );
}