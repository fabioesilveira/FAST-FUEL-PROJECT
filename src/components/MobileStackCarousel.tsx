import { useEffect, useMemo, useRef, useState } from "react";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

type Slide = {
  id: string;
  src: string;
  alt?: string;
  bg?: string;
  fit?: "cover" | "contain";
};

type Props = {
  slides: Slide[];
  interval?: number;
  height?: number;          // height base (desktop)
  radius?: number;
  shadow?: string;
  animationMs?: number;
};

export default function MobileCarouselSingle({
  slides,
  interval = 3800,
  height = 450,
  radius = 0,
  shadow = "0 10px 26px rgba(0,0,0,0.16)",
  animationMs = 520,
}: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // - mobile: usa clamp pra não ficar gigante nem pequeno
  // - desktop: mantém height prop
  const effectiveHeight = isMobile
    ? "clamp(300px, 48svh, 480px)"
    : `${height}px`;

  const safeSlides = useMemo(() => slides.filter(Boolean), [slides]);
  const count = safeSlides.length;

  const [idx, setIdx] = useState(0);
  const [enableTransition, setEnableTransition] = useState(true);

  const timerRef = useRef<number | null>(null);

  // swipe
  const startX = useRef<number | null>(null);
  const deltaX = useRef(0);

  const goNext = () => {
    if (count < 2) return;
    setIdx((i) => (i + 1) % count);
  };

  const goPrev = () => {
    if (count < 2) return;
    setIdx((i) => (i - 1 + count) % count);
  };

  useEffect(() => {
    setIdx(0);
    setEnableTransition(false);
    requestAnimationFrame(() => setEnableTransition(true));
  }, [count]);

  useEffect(() => {
    if (count < 2) return;
    timerRef.current = window.setInterval(goNext, interval);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [interval, count]);

  if (count === 0) return null;

  // Para efeito “slide”, a gente renderiza uma “track” com 3 slides:
  // prev | current | next  e mantem o current centralizado
  const prev = safeSlides[(idx - 1 + count) % count];
  const current = safeSlides[idx % count];
  const next = safeSlides[(idx + 1) % count];

  const handleTouchStart = (e: React.TouchEvent) => {
    if (count < 2) return;
    startX.current = e.touches[0].clientX;
    deltaX.current = 0;
    // pausa autoplay durante swipe
    if (timerRef.current) window.clearInterval(timerRef.current);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startX.current == null) return;
    deltaX.current = e.touches[0].clientX - startX.current;
  };

  const handleTouchEnd = () => {
    if (startX.current == null) return;
    const dx = deltaX.current;
    startX.current = null;

    // threshold
    if (dx > 40) goPrev();
    else if (dx < -40) goNext();

    // retoma autoplay
    if (count >= 2) {
      timerRef.current = window.setInterval(goNext, interval);
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 520, mx: "auto" }}>
      <Box
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        sx={{
          position: "relative",
          height: effectiveHeight,
          overflow: "hidden",
          borderRadius: `${radius}px`,
        }}
      >
        <Box
          sx={{
            height: "100%",
            display: "flex",
            width: "300%",
            transform: "translateX(-33.3333%)", // mantém o current no meio
          }}
        >
          <Track
            prev={prev}
            current={current}
            next={next}
            radius={radius}
            shadow={shadow}
            animationMs={animationMs}
            enableTransition={enableTransition}
            // quando idx muda, “simulamos” o slide com translate interno:
            key={current.id}
          />
        </Box>

        {/* dots (opcional) */}
        <Box
          sx={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 10,
            display: "flex",
            gap: 0.8,
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          {safeSlides.map((s, i) => (
            <Box
              key={s.id}
              sx={{
                width: i === idx ? 18 : 8,
                height: 8,
                borderRadius: 999,
                bgcolor: i === idx ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.55)",
                transition: "all 220ms ease",
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}

function Track({
  prev,
  current,
  next,
  radius,
  shadow,
}: {
  prev: Slide;
  current: Slide;
  next: Slide;
  radius: number;
  shadow: string;
  animationMs: number;
  enableTransition: boolean;
}) {

  return (
    <>
      <SlideCard slide={prev} radius={radius} shadow={shadow} />
      <SlideCard slide={current} radius={radius} shadow={shadow} />
      <SlideCard slide={next} radius={radius} shadow={shadow} />

      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
        }}
      />

      <style>{`
        /* opcional: nada aqui */
      `}</style>
    </>
  );
}

function SlideCard({
  slide,
  radius,
  shadow,
}: {
  slide: Slide;
  radius: number;
  shadow: string;
}) {
  return (
    <Box
      sx={{
        width: "33.3333%",
        height: "100%",
        borderRadius: `${radius}px`,
        overflow: "hidden",
        boxShadow: shadow,
        bgcolor: slide.bg ?? "transparent",
        flexShrink: 0,
      }}
    >
      <Box
        component="img"
        src={slide.src}
        alt={slide.alt ?? ""}
        sx={{
          width: "100%",
          height: "100%",
          objectFit: slide.fit ?? "cover",
          display: "block",
        }}
      />
    </Box>
  );
}
