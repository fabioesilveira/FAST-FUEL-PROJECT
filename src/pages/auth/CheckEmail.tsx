import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import { api } from "../../api";
import { useAppAlert } from "../../hooks/useAppAlert";
import { useLocation, useNavigate } from "react-router-dom";

export default function CheckEmail() {
    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email || "";

    const { showAlert, AlertUI } = useAppAlert({
        vertical: "top",
        horizontal: "center",
    });

    const handleResend = async () => {
        if (!email) return;

        try {
            await api.post("/users/resend-verification", {
                email,
            });

            showAlert(
                "Verification email sent again. Please check your inbox.",
                "success"
            );
        } catch (error: any) {
            console.error("RESEND VERIFICATION ERROR:", error);

            showAlert(
                error.response?.data?.msg ||
                "Could not resend the verification email. Please try again.",
                "error"
            );
        }
    };

    return (
        <>
            {AlertUI}
            <Box
                sx={{
                    minHeight: "100dvh",
                    backgroundColor: "#fffaf5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    px: 2.5,
                }}
            >
                <Box
                    sx={{
                        width: "100%",
                        maxWidth: 470,
                        backgroundColor: "#ffffff",
                        borderRadius: 3,
                        border: "1px solid rgba(230,81,0,0.18)",
                        boxShadow: "0 10px 28px rgba(0,0,0,0.08)",
                        textAlign: "center",
                        px: {
                            xs: 3,
                            sm: 4,
                        },
                        py: {
                            xs: 4,
                            sm: 5,
                        },
                        transform: { xs: "translateY(-90px)", sm: "translateY(-70px)", md: "translateY(-70px)" },
                    }}
                >
                    <EmailOutlinedIcon
                        sx={{
                            fontSize: 68,
                            color: "#e65100",
                        }}
                    />

                    <Typography
                        sx={{
                            mt: 2,
                            color: "#0d47a1",
                            fontWeight: 900,
                            fontSize: {
                                xs: "1.45rem",
                                sm: "1.65rem",
                            },
                        }}
                    >
                        Check Your Email
                    </Typography>

                    <Typography
                        sx={{
                            mt: 1.8,
                            color: "rgba(20,20,20,0.68)",
                            fontSize: {
                                xs: "0.92rem",
                                sm: "0.98rem",
                            },
                            lineHeight: 1.7,
                        }}
                    >
                        We sent a verification link to your email address.
                        Please click the link to activate your Fast Fuel account
                        before signing in.
                    </Typography>

                    {email && (
                        <Typography
                            sx={{
                                mt: 2,
                                color: "#0d47a1",
                                fontWeight: 800,
                                fontSize: {
                                    xs: "0.88rem",
                                    sm: "0.94rem",
                                },
                                wordBreak: "break-word",
                            }}
                        >
                            {email}
                        </Typography>
                    )}

                    <Typography
                        sx={{
                            mt: 3,
                            color: "rgba(20,20,20,0.55)",
                            fontSize: "0.82rem",
                            lineHeight: 1.6,
                        }}
                    >
                        Didn't receive the email? Check your spam folder or request
                        another verification link.
                    </Typography>

                    <Button
                        variant="contained"
                        onClick={handleResend}
                        disabled={!email}
                        sx={{
                            mt: 2.5,
                            width: "100%",
                            maxWidth: 280,
                            backgroundColor: "#e65100",
                            color: "#ffffff",
                            fontWeight: 800,
                            textTransform: "none",
                            borderRadius: 2,
                            py: 1.15,

                            "&:hover": {
                                backgroundColor: "#b33f00",
                            },

                            "&.Mui-disabled": {
                                backgroundColor: "rgba(230,81,0,0.28)",
                                color: "rgba(255,255,255,0.75)",
                            },
                        }}
                    >
                        Resend Verification Email
                    </Button>

                    <Button
                        onClick={() => navigate("/sign-in")}
                        sx={{
                            mt: 1.5,
                            width: "100%",
                            maxWidth: 280,
                            color: "#0d47a1",
                            fontWeight: 800,
                            textTransform: "none",
                            borderRadius: 2,
                            py: 1.15,
                        }}
                    >
                        Back to Sign In
                    </Button>
                </Box>
            </Box>
        </>
    );
}