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
                    flexDirection: "column",
                    px: 2,
                    pt: "96px",
                    pb: "calc(24px + env(safe-area-inset-bottom))",
                    bgcolor: "#fff",
                    position: "relative",
                    "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        bottom: 0,
                        left: "50%",
                        transform: "translateX(-50%)",
                        zIndex: 0,
                        width: "min(98vw, 720px)",
                        backgroundImage: `
              linear-gradient(90deg,
                  rgba(255,255,255,1) 0%,
                  rgba(255,255,255,0.0) 18%,
                  rgba(255,255,255,0.0) 82%,
                  rgba(255,255,255,1) 100%
              ),
              repeating-linear-gradient(135deg,
                  rgba(13,71,161,0.018) 0px,
                  rgba(13,71,161,0.018) 10px,
                  rgba(230,81,0,0.014) 10px,
                  rgba(230,81,0,0.014) 20px
              )
            `,
                        backgroundRepeat: "no-repeat, repeat",
                        backgroundSize: "100% 100%, auto",
                    },
                }}
            >
                <Box
                    sx={{
                        position: "relative",
                        zIndex: 1,
                        width: "100%",
                        maxWidth: 520,
                        mx: "auto",
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        textAlign: "center",
                    }}
                >
                    <Typography
                        sx={{
                            color: "#0d47a1",
                            fontWeight: 900,
                            textTransform: "uppercase",
                            letterSpacing: "0.14em",
                            fontSize: "clamp(1.45rem, 6vw, 1.85rem)",
                            textShadow: "1px 1px 0 rgba(230, 81, 0, 0.20)",
                        }}
                    >
                        Order confirmed
                    </Typography>

                    <Typography
                        sx={{
                            color: "text.secondary",
                            fontSize: "clamp(0.92rem, 3.8vw, 1rem)",
                            lineHeight: 1.7,
                        }}
                    >
                        Hi <b>{firstName}</b>. Your order has been confirmed and is waiting for the
                        store to accept and start preparing it.
                    </Typography>

                    <Typography
                        sx={{
                            color: "text.secondary",
                            fontSize: "clamp(0.88rem, 3.6vw, 0.95rem)",
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
                            p: 1.6,
                            borderRadius: 2.2,
                            border: "1px solid rgba(13, 71, 161, 0.22)",
                            bgcolor: "rgba(255,255,255,0.82)",
                        }}
                    >
                        <Typography
                            sx={{
                                fontWeight: 900,
                                color: "#0d47a1",
                                mb: 0.7,
                                fontSize: "0.98rem",
                            }}
                        >
                            Your Order Number
                        </Typography>

                        <Typography
                            sx={{
                                fontWeight: 900,
                                color: "#e65100",
                                letterSpacing: "0.14em",
                                fontSize: "1.12rem",
                            }}
                        >
                            {orderCode || "-"}
                        </Typography>

                        <Typography
                            sx={{
                                mt: 1.1,
                                fontSize: "0.80rem",
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

                    <Stack spacing={1.2} sx={{ mt: 1.2 }}>
                        <Button
                            variant="outlined"
                            startIcon={<HomeIcon />}
                            onClick={onGoHome}
                            sx={{
                                height: 46,
                                width: "100%",
                                borderRadius: 2,
                                textTransform: "uppercase",
                                border: "2px solid #0d47a1",
                                color: "#0d47a1",
                                letterSpacing: "0.12em",
                                fontWeight: 900,
                                "&:hover": { borderColor: "#123b7a", color: "#123b7a" },
                            }}
                        >
                            Home
                        </Button>

                        <Button
                            variant="contained"
                            startIcon={<HistoryIcon />}
                            onClick={onGoOrders}
                            sx={{
                                height: 46,
                                width: "100%",
                                borderRadius: 2,
                                backgroundColor: "#e65100",
                                color: "#ffe0c7",
                                fontWeight: 900,
                                letterSpacing: "0.08em",
                                textTransform: "uppercase",
                                "&:hover": { backgroundColor: "#b33f00" },
                            }}
                        >
                            Orders
                        </Button>
                    </Stack>
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