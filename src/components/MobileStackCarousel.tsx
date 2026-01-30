import { useEffect, useMemo, useRef, useState, useCallback } from "react";
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
  radius?: number;
  shadow?: string;
  animationMs?: number;
};

export default function MobileCarouselSingle({
  slides,
  interval = 3800,
  height = 490,
  radius = 0,
  shadow = "0 10px 26px rgba(0,0,0,0.16)",
  animationMs = 520,
}: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const safeSlides = useMemo(() => slides.filter(Boolean), [slides]);
  const count = safeSlides.length;

  const [idx, setIdx] = useState(0);
  const [nextIdx, setNextIdx] = useState<number | null>(null);
  const [fading, setFading] = useState(false);

  const timerRef = useRef<number | null>(null);

  const idxRef = useRef(0);
  const fadingRef = useRef(false);

  useEffect(() => {
    idxRef.current = idx;
  }, [idx]);

  useEffect(() => {
    fadingRef.current = fading;
  }, [fading]);

  // swipe
  const startX = useRef<number | null>(null);
  const deltaX = useRef(0);

  const clearTimer = useCallback(() => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = null;
  }, []);

  const runTransitionTo = useCallback(
    (target: number) => {
      if (count < 2) return;
      if (fadingRef.current) return;
      if (target === idxRef.current) return;

      // monta incoming primeiro (opacity 0), depois liga fading (opacity 1)
      setNextIdx(target);
      requestAnimationFrame(() => setFading(true));

      window.setTimeout(() => {
        setIdx(target);
        setNextIdx(null);
        setFading(false);
      }, animationMs);
    },
    [count, animationMs]
  );

  const goNext = useCallback(() => {
    if (count < 2) return;
    const next = (idxRef.current + 1) % count;
    runTransitionTo(next);
  }, [count, runTransitionTo]);

  const goPrev = useCallback(() => {
    if (count < 2) return;
    const prev = (idxRef.current - 1 + count) % count;
    runTransitionTo(prev);
  }, [count, runTransitionTo]);

  const startTimer = useCallback(() => {
    clearTimer();
    if (count >= 2) {
      timerRef.current = window.setInterval(() => {
        goNext();
      }, interval);
    }
  }, [clearTimer, count, interval, goNext]);

  // reinicia quando muda quantidade de slides
  useEffect(() => {
    setIdx(0);
    idxRef.current = 0;
    setNextIdx(null);
    setFading(false);
    startTimer();
    return clearTimer;
  }, [count, startTimer, clearTimer]);

  useEffect(() => {
    startTimer();
    return clearTimer;
  }, [startTimer, clearTimer]);

  if (count === 0) return null;

  const current = safeSlides[idx];
  const incoming = nextIdx != null ? safeSlides[nextIdx] : null;

  const handleTouchStart = (e: React.TouchEvent) => {
    if (count < 2) return;
    startX.current = e.touches[0].clientX;
    deltaX.current = 0;
    clearTimer();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startX.current == null) return;
    deltaX.current = e.touches[0].clientX - startX.current;
  };

  const handleTouchEnd = () => {
    if (startX.current == null) return;
    const dx = deltaX.current;
    startX.current = null;

    if (dx > 40) goPrev();
    else if (dx < -40) goNext();

    startTimer();
  };

  return (
    <Box sx={{ width: "100%", mx: "auto", height: "100%" }}>
      <Box
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        sx={{
          position: "relative",
          height: isMobile ? "100%" : `${height}px`,
          overflow: "hidden",
          borderRadius: `${radius}px`,
        }}
      >
        <FadeSlide slide={current} radius={radius} shadow={shadow} opacity={1} animationMs={animationMs} />

        {incoming && (
          <FadeSlide
            slide={incoming}
            radius={radius}
            shadow={shadow}
            opacity={fading ? 1 : 0}
            animationMs={animationMs}
            absolute
          />
        )}

        <Box
          sx={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 2,
            display: "flex",
            gap: 0.8,
            justifyContent: "center",
            pointerEvents: "none",
            zIndex: 3,
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

function FadeSlide({
  slide,
  radius,
  shadow,
  opacity,
  animationMs,
  absolute = true,
}: {
  slide: Slide;
  radius: number;
  shadow: string;
  opacity: number;
  animationMs: number;
  absolute?: boolean;
}) {
  return (
    <Box
      sx={{
        position: absolute ? "absolute" : "relative",
        inset: 0,
        width: "100%",
        height: "100%",
        borderRadius: `${radius}px`,
        overflow: "hidden",
        boxShadow: shadow,
        bgcolor: slide.bg ?? "transparent",
        opacity,
        transition: `opacity ${animationMs}ms ease`,
        willChange: "opacity",
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
