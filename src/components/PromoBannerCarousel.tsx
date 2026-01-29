import { useEffect, useMemo, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

type BannerItem = {
    title: string;
    subtitle?: string;
};

type PromoBannerCarouselProps = {
    items?: BannerItem[];
    interval?: number;
    fadeMs?: number;
};

export default function PromoBannerCarousel({
    items = defaultItems,
    interval = 4200,
    fadeMs = 320, // 👈 a bit slower = smoother
}: PromoBannerCarouselProps) {
    const safeItems = useMemo(() => (items ?? []).filter(Boolean), [items]);
    const count = safeItems.length;

    const [idx, setIdx] = useState(0);
    const [visible, setVisible] = useState(true);

    const holdRef = useRef<number | null>(null);
    const fadeRef = useRef<number | null>(null);

    useEffect(() => {
        setIdx(0);
        setVisible(true);
    }, [count]);

    useEffect(() => {
        if (count < 2) return;

        const holdTime = Math.max(0, interval - fadeMs * 2);

        const cycle = () => {
            setVisible(false);

            fadeRef.current = window.setTimeout(() => {
                setIdx((p) => (p + 1) % count);
                setVisible(true);

                holdRef.current = window.setTimeout(cycle, holdTime + fadeMs);
            }, fadeMs);
        };

        holdRef.current = window.setTimeout(cycle, holdTime);

        return () => {
            if (holdRef.current) window.clearTimeout(holdRef.current);
            if (fadeRef.current) window.clearTimeout(fadeRef.current);
        };
    }, [count, interval, fadeMs]);

    if (count === 0) return null;
    const b = safeItems[idx];

    const easing = "cubic-bezier(0.22, 1, 0.36, 1)";

    return (
        <Box
            sx={{
                width: "100%",
                overflow: "hidden",
                background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
                borderRight: { xs: 0, md: "2px solid rgba(13, 71, 161, 0.32)" },
                borderLeft: { xs: 0, md: "2px solid rgba(13, 71, 161, 0.18)" },
                borderTop: "2px solid rgba(13, 71, 161, 0.18)",
                borderBottom: "2px solid rgba(13, 71, 161, 0.18)",
                borderRadius: 0,
                mt: { xs: 0.7, sm: 1.7, md: 0.7 },
                mb: { xs: 6, md: -0.5 },
                height: { xs: 95, md: 95 },
                boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
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

                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateY(0px)" : "translateY(6px)",
                    filter: visible ? "blur(0px)" : "blur(0.6px)",
                    transition: `opacity ${fadeMs}ms ${easing}, transform ${fadeMs}ms ${easing}, filter ${fadeMs}ms ${easing}`,
                    willChange: "opacity, transform, filter",
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
                            mt: 0.9,
                            fontSize: { xs: "0.88rem", sm: "0.95rem", md: "1.05rem" },
                            fontWeight: 800,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            color: "rgba(13, 71, 161, 0.85)",
                        }}
                    >
                        {b.subtitle}
                    </Typography>
                )}
            </Box>
        </Box>
    );
}

const defaultItems: BannerItem[] = [
    { title: "Fuel Up Fast. Taste That Lasts." },
    {
        title: "Combo Promo",
        subtitle: "Sandwich + side + beverage = $2 off applied at total",
    },
    {
        title: "Have your order ready?",
        subtitle: "Try Fast Thru mode for a quick checkout",
    },
    {
        title: "Treat yourself today",
        subtitle: "Try our delicious desserts",
    },
    {
        title: "Fast delivery",
        subtitle: "Free delivery on orders over $30",
    }
];
