import { useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    Button,
    Divider,
} from "@mui/material";

import LockRoundedIcon from "@mui/icons-material/LockRounded";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import GitHubIcon from "@mui/icons-material/GitHub";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

export default function HomeFooter() {
    const navigate = useNavigate();

    return (
        <Box
            component="footer"
            id="home-footer"
            sx={{
                width: "100%",
                bgcolor: "#e65100",
                color: "#fff",
                px: { md: 6 },
                py: 4,

            }}
        >
            <Box
                sx={{
                    maxWidth: 1200,
                    mx: "auto",
                    display: "grid",
                    gridTemplateColumns: "1.3fr 1fr 1fr",
                    gap: 5,
                    alignItems: "start",
                }}
            >
                <Box>
                    <Typography
                        sx={{
                            fontWeight: 900,
                            fontSize: "1.35rem",
                            mb: 0.8,
                        }}
                    >
                        FAST FUEL
                    </Typography>

                    <Typography
                        sx={{
                            color: "rgba(255,255,255,0.72)",
                            fontSize: "0.9rem",
                            lineHeight: 1.7,
                            maxWidth: 320,
                        }}
                    >
                        A full-stack food ordering app focused on responsive UI/UX,
                        fast checkout, order tracking, and a polished customer experience.
                    </Typography>
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                    }}
                >
                    <Typography
                        sx={{
                            fontWeight: 800,
                            mb: 1.2,
                            pt: 0.3,
                            fontSize: "0.86rem",
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                        }}
                    >
                        Explore
                    </Typography>

                    <Button
                        onClick={() => navigate("/about")}
                        startIcon={<InfoOutlinedIcon />}
                        sx={footerLinkSx}
                    >
                        About Fast Fuel
                    </Button>

                    <Button
                        component="a"
                        href="https://www.linkedin.com/in/fabio-silveira-694b35341/"
                        target="_blank"
                        rel="noopener noreferrer"
                        startIcon={<LinkedInIcon />}
                        sx={footerLinkSx}
                    >
                        LinkedIn
                    </Button>

                    <Button
                        component="a"
                        href="https://github.com/fabioesilveira"
                        target="_blank"
                        rel="noopener noreferrer"
                        startIcon={<GitHubIcon />}
                        sx={footerLinkSx}
                    >
                        GitHub
                    </Button>
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                    }}
                >
                    <Typography
                        sx={{
                            fontWeight: 800,
                            mb: 2,
                            fontSize: "0.86rem",
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            pl: 0.5
                        }}
                    >
                        Platform
                    </Typography>

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 1.2,
                            mb: 1.5,
                            pl: 0.2,
                        }}
                    >
                        <LockRoundedIcon
                            sx={{
                                color: "#ffe0c7",
                                mt: 0.15,
                                fontSize: 22,
                            }}
                        />

                        <Box>
                            <Typography
                                sx={{
                                    fontWeight: 800,
                                    fontSize: "0.88rem",
                                    lineHeight: 1.3,
                                }}
                            >
                                Secure payments
                            </Typography>

                            <Typography sx={smallTextSx}>
                                Powered by Stripe
                            </Typography>

                            <Typography sx={smallTextSx}>
                                Sandbox demo for portfolio
                            </Typography>
                        </Box>
                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 1.2,
                            pl: 0.2,
                        }}
                    >
                        <MailOutlineRoundedIcon
                            sx={{
                                color: "#ffe0c7",
                                mt: 0.15,
                                fontSize: 22,
                            }}
                        />

                        <Box>
                            <Typography
                                sx={{
                                    fontWeight: 800,
                                    fontSize: "0.88rem",
                                    lineHeight: 1.3,
                                }}
                            >
                                Order confirmations
                            </Typography>

                            <Typography sx={smallTextSx}>
                                Powered by Resend
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>

            <Divider
                sx={{
                    borderColor: "rgba(255,255,255,0.15)",
                    my: 3,
                    maxWidth: 1200,
                    mx: "auto",
                }}
            />

            <Box
                sx={{
                    maxWidth: 1200,
                    mx: "auto",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Typography
                    sx={{
                        fontSize: "0.8rem",
                        color: "rgba(255,255,255,0.65)",
                        textAlign: "center",
                    }}
                >
                    © {new Date().getFullYear()} Fast Fuel.
                </Typography>
            </Box>
        </Box>
    );
}

const footerLinkSx = {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    minWidth: 0,
    color: "rgba(255,255,255,0.78)",
    textTransform: "none",
    px: 0,
    py: 0.4,
    mb: 0.3,

    "& .MuiButton-startIcon": {
        marginLeft: 0,
        marginRight: 1,
    },

    "&:hover": {
        color: "#fff",
        bgcolor: "transparent",
    },
};

const smallTextSx = {
    fontSize: "0.76rem",
    color: "rgba(255,255,255,0.65)",
};