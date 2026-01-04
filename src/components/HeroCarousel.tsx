import Carousel from "react-bootstrap/Carousel";
import Box from "@mui/material/Box";

type HeroCarouselProps = {
  children: React.ReactNode;
  aspectRatio?: string;
  radius?: number;
};

export default function HeroCarousel({
  children,
  aspectRatio = "16 / 9.5",
  radius = 18,
}: HeroCarouselProps) {
  return (
    <Box
      sx={{
        width: "100%",
        aspectRatio,
        bgcolor: "transparent",
        overflow: "hidden",

        // wrapper
        borderRadius: { xs: "0px !important", md: `${radius}px` },
        boxShadow: { xs: "none", md: "0 10px 28px rgba(230, 81, 0, 0.28)" },
        border: { xs: "none", md: "2px solid rgba(230, 81, 0, 0.25)" },

        // altura 100% em tudo
        "& .carousel, & .carousel-inner, & .carousel-item, & .carousel-item.active": {
          height: "100%",
        },

        // 🔥 remove radius de inner/item também (muito comum o CSS global bater aqui)
        "& .carousel-inner, & .carousel-item, & .carousel-item.active": {
          borderRadius: { xs: "0px !important", md: `${radius}px` },
          overflow: "hidden",
        },

        // 🔥 imagem SEMPRE quadrada no mobile
        "& .carousel-item img": {
          width: "100%",
          height: "100%",
          display: "block",
          objectFit: "cover",
          borderRadius: { xs: "0px !important", md: `${radius}px` },
        },
      }}
    >
      <Carousel
        indicators={false}
        controls={false}
        pause={false}
        touch
        fade
        style={{ height: "100%" }}
      >
        {children}
      </Carousel>
    </Box>
  );
}
