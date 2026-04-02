import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useEffect, useRef, useState } from "react";

type ProductsTitleBarProps = {
    title: string;
    top?: number;
};

export default function ProductsTitleBar({
    title,
    top = 80,
}: ProductsTitleBarProps) {
    const [visible, setVisible] = useState(true);
    const lastYRef = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentY = window.scrollY;

            if (currentY <= 8) {
                setVisible(true);
                lastYRef.current = currentY;
                return;
            }

            const delta = currentY - lastYRef.current;

            if (delta > 8) {
                setVisible(false);
            } else if (delta < -8) {
                setVisible(true);
            }

            lastYRef.current = currentY;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <Box
            sx={{
                position: "fixed",
                top: `${top}px`,
                left: 0,
                right: 0,
                zIndex: (t) => t.zIndex.appBar - 1,
                transform: visible ? "translateY(0)" : "translateY(-100%)",
                transition: "transform 220ms ease",
                bgcolor: "rgba(255, 243, 224, 0.78)",
                backdropFilter: "blur(10px)",
                borderBottom: "1px solid rgba(0,0,0,0.05)",
                pointerEvents: "none",
            }}
        >
            <Box
                sx={{
                    maxWidth: 1400,
                    mx: "auto",
                    px: { xs: 2.1, md: 3 },
                    py: { xs: 1.3, md: 1.4 }
                }}
            >
                <Typography
                    sx={{
                        color: "#0d47a1",
                        fontWeight: 900,
                        letterSpacing: "0.11em",
                        textTransform: "uppercase",
                        fontSize: { xs: "1.05rem", md: "1.20rem" },
                        textShadow: "1px 1px 0 rgba(230, 81, 0, 0.18)",
                        marginLeft: { xs: -0.1, md: -1.5 }
                    }}
                >
                    {title}
                </Typography>
            </Box>
        </Box>
    );
}