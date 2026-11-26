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

    const hideHeaderRef = useRef(false);
    const retractCycleRef = useRef(false);
    const cooldownRef = useRef(false);

    const isFormFieldFocused = () => {
        const activeElement = document.activeElement;

        return (
            activeElement instanceof HTMLInputElement ||
            activeElement instanceof HTMLTextAreaElement ||
            activeElement instanceof HTMLSelectElement ||
            activeElement instanceof HTMLIFrameElement
        );
    };

    const getSafeViewportTop = () => {
        const viewport = window.visualViewport;

        if (!viewport) return 0;

        return Math.min(
            Math.max(Math.round(viewport.offsetTop), 0),
            80
        );
    };

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

                if (hideHeaderRef.current) {
                    return;
                }

                const nextTop = getSafeViewportTop();

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
        let returnTimer: ReturnType<typeof setTimeout>;
        let cooldownTimer: ReturnType<typeof setTimeout>;

        const viewport = window.visualViewport;

        const resetHeader = () => {
            clearTimeout(returnTimer);
            clearTimeout(cooldownTimer);

            hideHeaderRef.current = false;
            retractCycleRef.current = false;
            cooldownRef.current = false;

            setHideHeader(false);
            setViewportTop(0);
        };

        const startRetractCycle = () => {
            if (!isFormFieldFocused()) {
                resetHeader();
                return;
            }

            if (
                retractCycleRef.current ||
                cooldownRef.current
            ) {
                return;
            }

            retractCycleRef.current = true;
            hideHeaderRef.current = true;

            setHideHeader(true);

            returnTimer = setTimeout(() => {
                setViewportTop(getSafeViewportTop());

                hideHeaderRef.current = false;
                setHideHeader(false);

                retractCycleRef.current = false;
                cooldownRef.current = true;

                cooldownTimer = setTimeout(() => {
                    cooldownRef.current = false;
                }, 250);
            }, 500);
        };

        const handleWindowScroll = () => {
            startRetractCycle();
        };

        const handleViewportScroll = () => {
            startRetractCycle();
        };

        const handleFocusOut = () => {
            window.setTimeout(() => {
                if (!isFormFieldFocused()) {
                    resetHeader();
                }
            }, 0);
        };

        window.addEventListener(
            "scroll",
            handleWindowScroll,
            { passive: true }
        );

        viewport?.addEventListener(
            "scroll",
            handleViewportScroll
        );

        document.addEventListener(
            "focusout",
            handleFocusOut
        );

        return () => {
            clearTimeout(returnTimer);
            clearTimeout(cooldownTimer);

            window.removeEventListener(
                "scroll",
                handleWindowScroll
            );

            viewport?.removeEventListener(
                "scroll",
                handleViewportScroll
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