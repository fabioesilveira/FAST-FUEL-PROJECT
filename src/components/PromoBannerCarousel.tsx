import Carousel from "react-bootstrap/Carousel";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

type BannerItem = {
    title: string;
    subtitle?: string;
};

type PromoBannerCarouselProps = {
    items?: BannerItem[];
    interval?: number;
};

export default function PromoBannerCarousel({
    items = defaultItems,
    interval = 4200,
}: PromoBannerCarouselProps) {
    return (
        <Box
            sx={{
                width: "100%",
                overflow: "hidden",

                background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
                borderRight: "1px solid rgba(13, 71, 161, 0.18)",
                borderLeft: "1px solid rgba(13, 71, 161, 0.18)",
                borderTop: "1px solid rgba(13, 71, 161, 0.18)",
                borderBottom: "1px solid rgba(13, 71, 161, 0.18)",
                borderRadius: { xs: 0, md: "8px" },
                mt: { xs: 0.8, md: 0.5 }, // 👈 distância do Navbar
                mb: -0.5
            }}
        >
            <Carousel
                controls={false}
                indicators={false}
                interval={interval}
                pause={false}
                touch
                fade
            >
                {items.map((b, idx) => (
                    <Carousel.Item key={idx}>
                        <Box
                            sx={{
                                minHeight: { xs: 85, md: 87 },
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                textAlign: "center",
                                px: { xs: 2, md: 4 },
                            }}
                        >
                            <Box
                                sx={{
                                    maxWidth: 1200,
                                    width: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Typography
                                    className="racing-sans-one-regular"
                                    sx={{
                                        width: "88%",
                                        mx: "auto",
                                        fontSize: { xs: "1.3rem", sm: "1.9rem", md: "2.5rem" },
                                        lineHeight: 0.7,
                                        letterSpacing: "0.08em",
                                        textTransform: "uppercase",
                                        color: "#0d47a1",
                                        textShadow: `
                      1px 1px 0 #ffe0c7,
                      2px 2px 0 rgba(230, 81, 0, 0.35)
                    `,
                                    }}
                                >
                                    {b.title}
                                </Typography>

                                {b.subtitle && (
                                    <Typography
                                        sx={{
                                            mt: 0.8,
                                            fontSize: { xs: "0.8rem", sm: "0.95rem", md: "1.05rem" },
                                            fontWeight: 800,
                                            letterSpacing: "0.12em",
                                            textTransform: "uppercase",
                                            color: "rgba(13, 71, 161, 0.85)",
                                        }}
                                    >
                                        {b.subtitle}
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    </Carousel.Item>
                ))}
            </Carousel>
        </Box>
    );
}

const defaultItems: BannerItem[] = [
    { title: "Fuel Up Fast. Taste That Lasts." },
    {
        title: "Combo Promo",
        subtitle: "Any sandwich + any side + any beverage • $2 off applied at total",
    },
    {
        title: "Have your order ready?",
        subtitle: "Try Fast Thru mode for a quick checkout",
    },
    {
        title: "Treat yourself today",
        subtitle: "Try our delicious desserts",
    },
];
