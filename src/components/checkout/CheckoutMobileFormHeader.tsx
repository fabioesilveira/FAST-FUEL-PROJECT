import { useEffect, useRef, useState } from "react";
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
    const [hideHeader, setHideHeader] = useState(false);

    const lastScrollY = useRef(window.scrollY);
    const lastScrollTime = useRef(performance.now());

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

    useEffect(() => {
        let showTimer: ReturnType<typeof setTimeout>;

        const handleScroll = () => {
            const activeElement = document.activeElement;

            const inputFocused =
                activeElement instanceof HTMLInputElement ||
                activeElement instanceof HTMLTextAreaElement ||
                activeElement instanceof HTMLSelectElement;

            if (!inputFocused) {
                setHideHeader(false);
                return;
            }

            const now = performance.now();
            const currentY = window.scrollY;

            const distance = Math.abs(
                currentY - lastScrollY.current
            );

            const elapsed =
                now - lastScrollTime.current;

            const velocity =
                elapsed > 0
                    ? distance / elapsed
                    : 0;

            lastScrollY.current = currentY;
            lastScrollTime.current = now;

            clearTimeout(showTimer);

            if (velocity > 1.1) {
                setHideHeader(true);

                showTimer = setTimeout(() => {
                    setHideHeader(false);
                }, 140);
            } else {
                showTimer = setTimeout(() => {
                    setHideHeader(false);
                }, 90);
            }
        };

        window.addEventListener("scroll", handleScroll, {
            passive: true,
        });

        return () => {
            clearTimeout(showTimer);

            window.removeEventListener(
                "scroll",
                handleScroll
            );
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
                    transform: hideHeader
                        ? "translateY(-58px)"
                        : "translateY(0)",

                    transition:
                        "transform 180ms cubic-bezier(0.22, 1, 0.36, 1)",

                    willChange: "transform",

                    pt: "env(safe-area-inset-top)",
                    bgcolor: "#ffffff",
                    borderBottom:
                        "1px solid rgba(13,71,161,0.08)",
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
                                bgcolor:
                                    "rgba(13,71,161,0.05)",
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
        </Box>
    );
}
