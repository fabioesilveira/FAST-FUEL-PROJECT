import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

import FastFuelCheckoutLogo from "../../assets/fast-fuel-checkout.png";

type Props = {
    onExit: () => void;
};

export default function CheckoutMobileFormHeader({
    onExit,
}: Props) {
    const [viewportTop, setViewportTop] = useState(0);

    useEffect(() => {
        const viewport = window.visualViewport;

        if (!viewport) return;

        let frame = 0;

        const updatePosition = () => {
            cancelAnimationFrame(frame);

            frame = requestAnimationFrame(() => {
                const nextTop = Math.round(viewport.offsetTop);

                setViewportTop((currentTop) =>
                    Math.abs(currentTop - nextTop) >= 2
                        ? nextTop
                        : currentTop
                );
            });
        };

        updatePosition();

        viewport.addEventListener("scroll", updatePosition);
        viewport.addEventListener("resize", updatePosition);

        return () => {
            cancelAnimationFrame(frame);

            viewport.removeEventListener("scroll", updatePosition);
            viewport.removeEventListener("resize", updatePosition);
        };
    }, []);

    return (
        <Box
            sx={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 9999,
                width: "100%",
                transform: `translateY(${viewportTop}px)`,
                willChange: "transform",

                pt: "env(safe-area-inset-top)",
                bgcolor: "#ffffff",
                borderBottom: "1px solid rgba(13,71,161,0.08)",

                "&::before": {
                    content: '""',
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: "-80px",
                    height: "80px",
                    bgcolor: "#ffffff",
                    pointerEvents: "none",
                },
            }}
        >
            <Box
                sx={{
                    height: 58,
                    px: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Button
                    onClick={onExit}
                    startIcon={
                        <ArrowBackRoundedIcon
                            sx={{ fontSize: 18 }}
                        />
                    }
                    sx={{
                        minWidth: 0,
                        px: 0.8,
                        color: "#0d47a1",
                        fontWeight: 800,
                        fontSize: "0.78rem",
                        letterSpacing: "0.04em",
                        textTransform: "none",
                        whiteSpace: "nowrap",

                        "&:hover": {
                            bgcolor: "rgba(13,71,161,0.05)",
                        },
                    }}
                >
                    Back to Checkout
                </Button>

                <Box
                    component="img"
                    src={FastFuelCheckoutLogo}
                    alt=""
                    aria-hidden="true"
                    sx={{
                        width: 52,
                        height: 52,
                        objectFit: "contain",
                        opacity: 0.55,
                        pointerEvents: "none",
                        userSelect: "none",
                    }}
                />
            </Box>
        </Box>
    );
}