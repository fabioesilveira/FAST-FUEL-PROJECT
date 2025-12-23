import React, { useEffect, useMemo, useRef, useState } from "react";
import Box from "@mui/material/Box";

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
  height = 230,
  gap = 16,
  radius = 16,
  shadow = "0 10px 26px rgba(0,0,0,0.16)",
  animationMs = 720,
}: Props) {
  const safeSlides = useMemo(() => slides.filter(Boolean), [slides]);
  const count = safeSlides.length;

  const [idx, setIdx] = useState(0);
  const [animating, setAnimating] = useState(false);

  const timerRef = useRef<number | null>(null);
  const animRef = useRef<number | null>(null);

  // se slides mudar, reseta o índice
  useEffect(() => {
    setIdx(0);
  }, [count]);

  const step = height + gap;
  const frameHeight = height * 2 + gap;

  // iOS-like smooth
  const easing = "cubic-bezier(0.22, 1, 0.36, 1)";

  // Sempre 3 items para o loop:
  // [A(top), B(bottom), C(nextBottom)]
  const top = count > 0 ? safeSlides[idx % count] : undefined;
  const bottom = count > 1 ? safeSlides[(idx + 1) % count] : top;
  const nextBottom = count > 2 ? safeSlides[(idx + 2) % count] : bottom;

  const tick = () => {
    if (count < 2) return;

    setAnimating(true);

    animRef.current = window.setTimeout(() => {
      setIdx((prev) => (prev + 1) % count);
      setAnimating(false);
    }, animationMs);
  };

  useEffect(() => {
    if (count < 2) return;

    timerRef.current = window.setInterval(tick, interval);

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      if (animRef.current) window.clearTimeout(animRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interval, count, animationMs]);

  if (!top) return null;

  return (
    <Box sx={{ width: "100%", maxWidth: 520, mx: "auto" }}>
      {/* FRAME fixo */}
      <Box
        sx={{
          position: "relative",
          height: frameHeight,
          overflow: "hidden",
          borderRadius: `${radius}px`,
        }}
      >
        {/* CONTENT: só ele se move, pra baixo, 1 passo */}
        <Box
          sx={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,

            // hamster pra tras: desce 1 card
            transform: animating ? `translateY(-${step}px)` : "translateY(0px)",
            transition: animating ? `transform ${animationMs}ms ${easing}` : "none",
            willChange: "transform",
          }}
        >
          {/* TOP (vai descer e virar bottom) */}
          <SlideCard slide={top} height={height} radius={radius} shadow={shadow} />
          <Box sx={{ height: gap }} />

          {/* BOTTOM (vai descer e sumir) */}
          <SlideCard slide={bottom!} height={height} radius={radius} shadow={shadow} />
          <Box sx={{ height: gap }} />

          {/* NEXT (entra por cima e vira TOP) */}
          <SlideCard slide={nextBottom!} height={height} radius={radius} shadow={shadow} />
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
        transform: "translateZ(0)",
        backfaceVisibility: "hidden",
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
          transform: "translateZ(0)",
        }}
      />
    </Box>
  );
}
