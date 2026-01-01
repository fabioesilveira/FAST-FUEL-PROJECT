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

        // fundo laranja claro
        backgroundColor: "#ffe0c7",

        borderTop: "1px solid rgba(13, 71, 161, 0.18)",
        borderBottom: "1px solid rgba(13, 71, 161, 0.18)",
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
                height: { xs: 52, sm: 60, md: 70 },
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                px: { xs: 1.5, sm: 2.5, md: 4 },
                textAlign: "center",

                // fade sutil nas laterais
                backgroundImage: `
                  linear-gradient(
                    to right,
                    rgba(255,224,199,1) 0%,
                    rgba(255,224,199,0.75) 15%,
                    rgba(255,224,199,0.75) 85%,
                    rgba(255,224,199,1) 100%
                  )
                `,
              }}
            >
              <Typography
                sx={{
                  fontFamily: "Faster One",
                  fontSize: { xs: "18px", sm: "22px", md: "26px" },
                  fontWeight: 400,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#0d47a1",

                  // 🔥 exatamente o mesmo shadow do Checkout
                  textShadow: "1px 1px 0 rgba(230, 81, 0, 0.25)",
                  lineHeight: 1.05,
                }}
              >
                {b.title}
              </Typography>

              {b.subtitle && (
                <Typography
                  sx={{
                    mt: 0.4,
                    fontSize: { xs: "11px", sm: "12px", md: "13px" },
                    fontWeight: 800,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                  color: "#0d47a1",
                    textShadow: "1px 1px 0 rgba(230, 81, 0, 0.18)",
                    lineHeight: 1.1,
                  }}
                >
                  {b.subtitle}
                </Typography>
              )}
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
    subtitle: "Any sandwich + any side + any beverage • $2 off at total",
  },
  {
    title: "Have your order ready?",
    subtitle: "Try Fast Thru mode for a quick checkout",
  },
  {
    title: "Treat yourself",
    subtitle: "Try our delicious desserts today",
  },
];
