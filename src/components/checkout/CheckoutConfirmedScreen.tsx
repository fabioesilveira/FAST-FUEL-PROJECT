import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import HistoryIcon from "@mui/icons-material/History";
import HomeIcon from "@mui/icons-material/Home";

type CheckoutConfirmedScreenProps = {
    fullName: string;
    addressLine: string;
    orderCode: string;
    isLogged: boolean;
    mobile?: boolean;
    onGoHome: () => void;
    onGoOrders: () => void;
};

export default function CheckoutConfirmedScreen({
    fullName,
    addressLine,
    orderCode,
    isLogged,
    mobile = false,
    onGoHome,
    onGoOrders,
}: CheckoutConfirmedScreenProps) {
    const firstName = (fullName || "there").trim().split(" ")[0];

    if (mobile) {
        return (
            <Box
                sx={{
                    minHeight: "100dvh",
                    display: "flex",
                    justifyContent: "center",
                    px: 0,
                    pt: "calc(102px + env(safe-area-inset-top))",
                    pb: "calc(22px + env(safe-area-inset-bottom))",
                    bgcolor: "#fff",
                }}
            >
                <Box
                    sx={{
                        width: "100%",
                        maxWidth: 460,
                        px: { xs: 2.4, sm: 3 },
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    <Box
                        sx={{
                            width: "100%",
                            minHeight: "calc(100dvh - 130px - env(safe-area-inset-bottom))",
                            bgcolor: "#fff",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            textAlign: "center",
                            px: 2.6,
                            pt: 3.4,
                            pb: 3,
                        }}
                    >

                        <Typography
                            sx={{
                                color: "#0d47a1",
                                fontWeight: 900,
                                textTransform: "uppercase",
                                letterSpacing: "0.11em",
                                fontSize: "clamp(1.2rem, 5.2vw, 1.55rem)",
                                textShadow: "1px 1px 0 rgba(230, 81, 0, 0.18)",
                            }}
                        >
                            Order confirmed
                        </Typography>

                        <Typography
                            sx={{
                                mt: 1.6,
                                color: "text.secondary",
                                fontSize: "clamp(0.9rem, 3.6vw, 0.98rem)",
                                lineHeight: 1.68,
                                maxWidth: 310,
                            }}
                        >
                            Hi <b>{firstName}</b>. Your order has been confirmed and is waiting for the
                            store to accept and start preparing it.
                        </Typography>

                        <Typography
                            sx={{
                                mt: 1.2,
                                color: "text.secondary",
                                fontSize: "clamp(0.88rem, 3.4vw, 0.95rem)",
                                lineHeight: 1.68,
                                maxWidth: 315,
                            }}
                        >
                            It will be delivered to: <b>{addressLine || "the address you entered"}</b>.
                            <br />
                            Average wait time: <b>30 minutes</b>.
                        </Typography>

                        <Box
                            sx={{
                                mt: 1.9,
                                p: 1.6,
                                borderRadius: 2,
                                border: "1px solid rgba(13, 71, 161, 0.20)",
                                bgcolor: "rgba(255,255,255,0.96)",
                                width: "100%",
                            }}
                        >
                            <Typography
                                sx={{
                                    fontWeight: 900,
                                    color: "#0d47a1",
                                    mb: 0.7,
                                    fontSize: "0.94rem",
                                }}
                            >
                                Your Order Number
                            </Typography>

                            <Typography
                                sx={{
                                    fontWeight: 900,
                                    color: "#e65100",
                                    letterSpacing: "0.14em",
                                    fontSize: "1.08rem",
                                }}
                            >
                                {orderCode || "-"}
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 1,
                                    fontSize: "0.79rem",
                                    color: "text.secondary",
                                    lineHeight: 1.6,
                                }}
                            >
                                Please save your <b>Order Number</b> to check status on the Orders page.
                                {isLogged ? (
                                    <> Since you’re logged in, it’s saved in your account too.</>
                                ) : (
                                    <> As a guest, you’ll need it (and your email) to track your order.</>
                                )}
                            </Typography>
                        </Box>

                        <Stack spacing={1.1} sx={{ mt: 1.5, width: "100%" }}>
                            <Button
                                variant="outlined"
                                startIcon={<HomeIcon />}
                                onClick={onGoHome}
                                sx={{
                                    height: 38,
                                    width: "100%",
                                    borderRadius: 2,
                                    textTransform: "uppercase",
                                    border: "2px solid #0d47a1",
                                    color: "#0d47a1",
                                    letterSpacing: "0.09em",
                                    fontWeight: 900,
                                    fontSize: "0.82rem",
                                    "&:hover": {
                                        borderColor: "#123b7a",
                                        color: "#123b7a",
                                    },
                                }}
                            >
                                Home
                            </Button>

                            <Button
                                variant="contained"
                                startIcon={<HistoryIcon />}
                                onClick={onGoOrders}
                                sx={{
                                    height: 38,
                                    width: "100%",
                                    borderRadius: 2,
                                    backgroundColor: "#e65100",
                                    color: "#ffe0c7",
                                    fontWeight: 900,
                                    fontSize: "0.82rem",
                                    letterSpacing: "0.08em",
                                    textTransform: "uppercase",
                                    "&:hover": { backgroundColor: "#b33f00" },
                                }}
                            >
                                Orders
                            </Button>
                        </Stack>

                        <Box sx={{ flex: 1 }} />

                        <Typography
                            sx={{
                                mt: 3,
                                fontSize: "0.72rem",
                                letterSpacing: "0.12em",
                                textTransform: "uppercase",
                                fontWeight: 800,
                                color: "rgba(230, 81, 0, 0.78)",
                            }}
                        >
                            © FastFuel
                        </Typography>
                    </Box>
                </Box>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                flex: 1,
                px: { xs: 2.5, sm: 5 },
                pt: { xs: 3.5, sm: 6, md: 6 },
                pb: { xs: 3.5, sm: 6 },
                maxWidth: 500,
                mx: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 2,
                textAlign: "center",
                alignItems: "center",
                justifyContent: "flex-start",
            }}
        >
            <Typography
                sx={{
                    color: "#0d47a1",
                    fontWeight: 900,
                    textTransform: "uppercase",
                    letterSpacing: "0.14em",
                    fontSize: "clamp(1.62rem, 4.8vw, 1.90rem)",
                    textShadow: "1px 1px 0 rgba(230, 81, 0, 0.20)",
                }}
            >
                Order confirmed
            </Typography>

            <Typography
                sx={{
                    maxWidth: 520,
                    color: "text.secondary",
                    fontSize: "clamp(0.90rem, 3.1vw, 0.98rem)",
                    lineHeight: 1.7,
                }}
            >
                Hi <b>{firstName}</b>. Your order has been confirmed and is waiting for the
                store to accept and start preparing it.
            </Typography>

            <Typography
                sx={{
                    maxWidth: 520,
                    color: "text.secondary",
                    fontSize: "clamp(0.86rem, 3.0vw, 0.92rem)",
                    lineHeight: 1.7,
                }}
            >
                It will be delivered to: <b>{addressLine || "the address you entered"}</b>.
                <br />
                Average wait time: <b>30 minutes</b>.
            </Typography>

            <Box
                sx={{
                    mt: 1,
                    p: { xs: 1.25, sm: 1.6 },
                    borderRadius: 2,
                    border: "1px solid rgba(13, 71, 161, 0.22)",
                    bgcolor: "rgba(255,255,255,0.75)",
                    width: "100%",
                }}
            >
                <Typography
                    sx={{
                        fontWeight: 900,
                        color: "#0d47a1",
                        mb: 0.6,
                        fontSize: "clamp(0.92rem, 3.2vw, 1.0rem)",
                    }}
                >
                    Your Order Number
                </Typography>

                <Typography
                    sx={{
                        fontWeight: 900,
                        color: "#e65100",
                        letterSpacing: "0.14em",
                        fontSize: "clamp(1.0rem, 4.1vw, 1.1rem)",
                    }}
                >
                    {orderCode || "-"}
                </Typography>

                <Typography
                    sx={{
                        mt: 1,
                        fontSize: "clamp(0.78rem, 2.7vw, 0.82rem)",
                        color: "text.secondary",
                        lineHeight: 1.6,
                    }}
                >
                    Please save your <b>Order Number</b> to check status on the Orders page.
                    {isLogged ? (
                        <> Since you’re logged in, it’s saved in your account too.</>
                    ) : (
                        <> As a guest, you’ll need it (and your email) to track your order.</>
                    )}
                </Typography>
            </Box>

            <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.2}
                sx={{
                    mt: 1.2,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Button
                    variant="outlined"
                    startIcon={<HomeIcon />}
                    onClick={onGoHome}
                    sx={{
                        height: { xs: 35, md: 45 },
                        width: { xs: "100%", sm: 160 },
                        maxWidth: { xs: 320, sm: "none" },
                        borderRadius: 2,
                        textTransform: "uppercase",
                        border: "2px solid #0d47a1",
                        color: "#0d47a1",
                        letterSpacing: "0.12em",
                        fontWeight: 900,
                        px: { xs: 1.7, md: 2.2 },
                        "&:hover": { borderColor: "#123b7a", color: "#123b7a" },
                        whiteSpace: "nowrap",
                    }}
                >
                    Home
                </Button>

                <Button
                    variant="contained"
                    startIcon={<HistoryIcon />}
                    onClick={onGoOrders}
                    sx={{
                        height: { xs: 35, md: 45 },
                        width: { xs: "100%", sm: 160 },
                        maxWidth: { xs: 320, sm: "none" },
                        borderRadius: 2,
                        backgroundColor: "#e65100",
                        color: "#ffe0c7",
                        fontWeight: 800,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        "&:hover": { backgroundColor: "#b33f00" },
                        px: { xs: 1.7, md: 2.2 },
                        whiteSpace: "nowrap",
                    }}
                >
                    Orders
                </Button>
            </Stack>
        </Box>
    );
}