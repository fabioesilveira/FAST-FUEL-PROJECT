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

    const lastScrollYRef = useRef(window.scrollY);
    const reverseScrollRef = useRef(false);

    const initialMountRef = useRef(true);

    const isFormFieldFocused = () => {
        const activeElement = document.activeElement;

        return (
            activeElement instanceof HTMLInputElement ||
            activeElement instanceof HTMLTextAreaElement ||
            activeElement instanceof HTMLSelectElement ||
            activeElement instanceof HTMLIFrameElement
        );
    };

    useEffect(() => {
        reverseScrollRef.current = false;
        lastScrollYRef.current = window.scrollY;

        setHideHeader(false);

        const viewport = window.visualViewport;

        setViewportTop(
            viewport
                ? Math.round(viewport.offsetTop)
                : 0
        );

        const timer = window.setTimeout(() => {
            initialMountRef.current = false;
            lastScrollYRef.current = window.scrollY;
        }, 450);

        return () => {
            window.clearTimeout(timer);
        };
    }, []);

    useEffect(() => {
        const viewport = window.visualViewport;

        if (!viewport) return;

        let frame = 0;

        const updatePosition = () => {
            cancelAnimationFrame(frame);

            frame = requestAnimationFrame(() => {
                if (!isFormFieldFocused()) {
                    setViewportTop(0);
                    return;
                }

                // During reverse scroll, keep the header
                // completely out of the viewport logic.
                if (reverseScrollRef.current) {
                    return;
                }

                const nextTop = Math.round(
                    viewport.offsetTop
                );

                setViewportTop((currentTop) =>
                    Math.abs(currentTop - nextTop) >= 2
                        ? nextTop
                        : currentTop
                );
            });
        };

        updatePosition();

        viewport.addEventListener(
            "scroll",
            updatePosition
        );

        viewport.addEventListener(
            "resize",
            updatePosition
        );

        return () => {
            cancelAnimationFrame(frame);

            viewport.removeEventListener(
                "scroll",
                updatePosition
            );

            viewport.removeEventListener(
                "resize",
                updatePosition
            );
        };
    }, []);

    useEffect(() => {
        let showTimer: ReturnType<typeof setTimeout>;

        const handleFocusIn = () => {
            if (!isFormFieldFocused()) return;

            clearTimeout(showTimer);

            reverseScrollRef.current = false;
            lastScrollYRef.current = window.scrollY;

            setViewportTop(0);
            setHideHeader(false);
        };

        const handleScroll = () => {
            const currentY = window.scrollY;

            if (initialMountRef.current) {
                lastScrollYRef.current = currentY;
                return;
            }

            const previousY = lastScrollYRef.current;

            const delta = currentY - previousY;

            lastScrollYRef.current = currentY;

            if (!isFormFieldFocused()) {
                clearTimeout(showTimer);

                reverseScrollRef.current = false;

                setHideHeader(false);
                setViewportTop(0);

                return;
            }

            if (reverseScrollRef.current) {
                clearTimeout(showTimer);

                if (currentY <= 2) {
                    reverseScrollRef.current = false;

                    setViewportTop(0);
                    setHideHeader(false);
                }

                return;
            }

            if (delta < -2) {
                clearTimeout(showTimer);

                reverseScrollRef.current = true;

                setViewportTop(0);
                setHideHeader(true);

                return;
            }

            if (Math.abs(delta) <= 2) {
                return;
            }

            if (delta > 2) {
                clearTimeout(showTimer);

                setHideHeader(true);

                showTimer = setTimeout(() => {
                    setHideHeader(false);
                }, 550);
            }
        };

        const handleFocusOut = () => {
            window.setTimeout(() => {
                if (!isFormFieldFocused()) {
                    clearTimeout(showTimer);

                    reverseScrollRef.current = false;

                    setHideHeader(false);
                    setViewportTop(0);
                }
            }, 0);
        };

        window.addEventListener(
            "scroll",
            handleScroll,
            { passive: true }
        );

        document.addEventListener(
            "focusin",
            handleFocusIn
        );

        document.addEventListener(
            "focusout",
            handleFocusOut
        );

        return () => {
            clearTimeout(showTimer);

            window.removeEventListener(
                "scroll",
                handleScroll
            );

            document.removeEventListener(
                "focusin",
                handleFocusIn
            );

            document.removeEventListener(
                "focusout",
                handleFocusOut
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
                        "transform 280ms cubic-bezier(0.16, 1, 0.3, 1)",

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