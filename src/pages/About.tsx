import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Footer from "../components/layout/footer/Footer";
import NavbarAction from "../components/layout/navbar/NavbarAction";

export default function About() {
    return (
        <>
            <NavbarAction />

            <Box
                sx={{
                    minHeight: "100vh",
                    backgroundColor: "#fffaf5",
                    pt: {
                        xs: 15,
                        sm: 15,
                        md: 16,
                    },
                    pb: {
                        xs: 7,
                        sm: 8,
                        md: 12,
                    },
                }}
            >
                <Container
                    maxWidth="md"
                    sx={{
                        px: {
                            xs: 2.5,
                            sm: 3,
                        },
                    }}
                >
                    <Box
                        sx={{
                            maxWidth: 760,
                            mx: "auto",
                            textAlign: "center",
                        }}
                    >
                        <Typography
                            sx={{
                                color: "#0d47a1",
                                fontWeight: 900,
                                textTransform: "uppercase",
                                letterSpacing: "0.12em",
                                fontSize: {
                                    xs: "1.45rem",
                                    sm: "1.7rem",
                                    md: "2.2rem",
                                },

                                textShadow:
                                    "1px 1px 0 rgba(230, 81, 0, 0.18)"
                            }}
                        >
                            About Fast Fuel
                        </Typography>

                        <Typography
                            sx={{
                                mt: {
                                    xs: 2.5,
                                    md: 3,
                                },
                                color: "rgba(20,20,20,0.72)",
                                fontSize: {
                                    xs: "0.92rem",
                                    sm: "0.98rem",
                                    md: "1.05rem",
                                },
                                lineHeight: 1.8,
                            }}
                        >
                            Fast Fuel is a modern food ordering application designed
                            to make ordering quick, simple, and convenient across
                            mobile and desktop devices.
                        </Typography>

                        <Typography
                            sx={{
                                mt: {
                                    xs: 2,
                                    md: 2.2,
                                },
                                color: "rgba(20,20,20,0.72)",
                                fontSize: {
                                    xs: "0.92rem",
                                    sm: "0.98rem",
                                    md: "1.05rem",
                                },
                                lineHeight: 1.8,
                            }}
                        >
                            Built as a portfolio project, Fast Fuel brings together
                            responsive UI/UX, full-stack development, secure payments,
                            order tracking, transactional emails, and administrative
                            workflows in one complete ordering experience.
                        </Typography>

                        <Typography
                            sx={{
                                mt: {
                                    xs: 2.5,
                                    md: 2.5,
                                },
                                color: "rgba(20,20,20,0.58)",
                                fontSize: {
                                    xs: "0.78rem",
                                    sm: "0.82rem",
                                    md: "0.9rem",
                                },
                                lineHeight: 1.6,
                            }}
                        >
                            Fast Fuel is a non-commercial portfolio project created
                            for learning and demonstration purposes. The branding,
                            visual identity, interface, and promotional content were
                            created specifically for this project.
                        </Typography>

                        <Box
                            sx={{
                                mt: {
                                    xs: 4,
                                    md: 5,
                                },
                                width: {
                                    xs: 46,
                                    md: 56,
                                },
                                height: 4,
                                mx: "auto",
                                borderRadius: "999px",
                                backgroundColor: "#e65100",
                            }}
                        />

                        <Typography
                            sx={{
                                mt: {
                                    xs: 2.2,
                                    md: 3,
                                },
                                color: "#0d47a1",
                                fontWeight: 800,
                                fontSize: {
                                    xs: "0.92rem",
                                    sm: "1rem",
                                    md: "1.08rem",
                                },
                            }}
                        >
                            Fast ordering. Simple experience.
                        </Typography>
                    </Box>
                </Container>
            </Box>

            <Footer />
        </>
    );
}