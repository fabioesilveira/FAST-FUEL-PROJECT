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
  height?: number;
  gap?: number;
  radius?: number;
  shadow?: string;
  animationMs?: number;
};

export default function MobileStackCarousel({
  slides,
  interval = 3800,
  height = 450,
  gap = 16,
  radius = 0,
  shadow = "0 10px 26px rgba(0,0,0,0.16)",
  animationMs = 720,
}: Props) {
  const theme = useTheme();

  const isXs = useMediaQuery(theme.breakpoints.down("xs"));
 
  const effectiveHeight = isXs ? Math.min(height, 260) : height;

  const safeSlides = useMemo(() => slides.filter(Boolean), [slides]);
  const count = safeSlides.length;

  const step = effectiveHeight + gap;
  const frameHeight = effectiveHeight * 2 + gap;
  const easing = "cubic-bezier(0.22, 1, 0.36, 1)";

  const [idx, setIdx] = useState(0);
  const [offset, setOffset] = useState<number>(() =>
    count >= 2 ? -step : 0
  );
  const [enableTransition, setEnableTransition] = useState(false);

  const timerRef = useRef<number | null>(null);
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    setIdx(0);
    setEnableTransition(false);
    setOffset(count >= 2 ? -step : 0);
    isAnimatingRef.current = false;
  }, [count, step]);

  const prev =
    count > 1
      ? safeSlides[(idx - 1 + count) % count]
      : safeSlides[idx % count];

  const top = count > 0 ? safeSlides[idx % count] : undefined;

  const next =
    count > 1 ? safeSlides[(idx + 1) % count] : top;

  const tick = () => {
    if (count < 2) return;
    if (isAnimatingRef.current) return;

    isAnimatingRef.current = true;
    setEnableTransition(true);
    setOffset(0);
  };

  const handleTransitionEnd = () => {
    if (!isAnimatingRef.current) return;

    setIdx((prevIdx) => (prevIdx - 1 + count) % count);
    setEnableTransition(false);

    requestAnimationFrame(() => {
      setOffset(-step);
      requestAnimationFrame(() => {
        isAnimatingRef.current = false;
      });
    });
  };

  useEffect(() => {
    if (count < 2) return;

    timerRef.current = window.setInterval(tick, interval);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [interval, count]);

  if (!top) return null;

  return (
    <Box sx={{ width: "100%", maxWidth: 520, mx: "auto" }}>
      <Box
        sx={{
          position: "relative",
          height: frameHeight,
          overflow: "hidden",
          borderRadius: `${radius}px`,
        }}
      >
        <Box
          onTransitionEnd={handleTransitionEnd}
          sx={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            transform: `translateY(${offset}px)`,
            transition: enableTransition
              ? `transform ${animationMs}ms ${easing}`
              : "none",
            willChange: "transform",
          }}
        >
          <SlideCard slide={prev} height={effectiveHeight} radius={radius} shadow={shadow} />
          <Box sx={{ height: gap }} />
          <SlideCard slide={top} height={effectiveHeight} radius={radius} shadow={shadow} />
          <Box sx={{ height: gap }} />
          <SlideCard slide={next!} height={effectiveHeight} radius={radius} shadow={shadow} />
        </Box>
      </Box>
    </Box>
  );
}

function SlideCard({
  slide,
  height,
  radius,
  shadow,
}: {
  slide: Slide;
  height: number;
  radius: number;
  shadow: string;
}) {
  return (
    <Box
      sx={{
        height,
        borderRadius: `${radius}px`,
        overflow: "hidden",
        boxShadow: shadow,
        bgcolor: slide.bg ?? "transparent",
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
