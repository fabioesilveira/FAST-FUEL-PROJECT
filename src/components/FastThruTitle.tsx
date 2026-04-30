import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

type FastThruTitleProps = {
    total: number;
    cartCount?: number;
    onReceiptClick: (e: React.MouseEvent<HTMLElement>) => void;
    onExit: () => void;
    top?: number;
};

export default function FastThruTitle({
    total,
    cartCount = 0,
    onReceiptClick,
    onExit,
    top = 80,
}: FastThruTitleProps) {
    const [solidBg, setSolidBg] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setSolidBg(window.scrollY > 8);
        };

        handleScroll();
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
                bgcolor: solidBg
                    ? "rgba(255, 243, 224, 0.97)"
                    : "rgba(255, 243, 224, 0.82)",
                backdropFilter: "blur(10px)",
                borderBottom: "1px solid rgba(0,0,0,0.05)",
                transition: "background-color 180ms ease",
            }}
        >
            <Box
                sx={{
                    maxWidth: 1400,
                    mx: "auto",
                    px: { xs: 2.1, md: 3 },
                    py: { xs: 1.45, md: 1.55 },
                    position: "relative",
                }}
            >
                <Button
                    onClick={onExit}
                    sx={{
                        position: "absolute",
                        top: { xs: 9, md: 5 },
                        right: { xs: 10, md: 12 },
                        minWidth: 0,
                        width: 30.5,
                        height: 30.5,
                        p: 0,
                        borderRadius: "999px",
                        color: "#0d47a1",
                        fontWeight: 900,
                        opacity: 0.8,
                        "&:hover": {
                            bgcolor: "rgba(13, 71, 161, 0.08)",
                            opacity: 1,
                        },
                    }}
                >
                    <CloseIcon sx={{ fontSize: 21.5 }} />
                </Button>


                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.1, // diminui aqui pra trazer mais perto do total
                        minWidth: 0,
                    }}
                >
                    <Typography
                        sx={{
                            color: "#0d47a1",
                            fontWeight: 900,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            fontSize: "clamp(1.02rem, 5vw, 1.45rem)",
                            lineHeight: 1,
                            whiteSpace: "nowrap",
                        }}
                    >
                        TOTAL: ${total.toFixed(2)}
                    </Typography>

                    <Box
                        sx={{
                            position: "relative",
                            display: "inline-flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            lineHeight: 1,
                            ml: -0.2, // ajuste fino
                        }}
                    >
                        {cartCount > 0 && (
                            <Box
                                sx={{
                                    position: "absolute",
                                    top: 0,
                                    right: -6,
                                    minWidth: 14,
                                    height: 14,
                                    px: 0.42,
                                    borderRadius: "999px",
                                    bgcolor: "#1e5bb8",
                                    color: "#fff",
                                    fontWeight: 900,
                                    fontSize: "0.62rem",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    boxShadow: "0 3px 8px rgba(0,0,0,0.18)",
                                    zIndex: 2,
                                }}
                            >
                                {cartCount}
                            </Box>
                        )}

                        <Button
                            onClick={onReceiptClick}
                            sx={{
                                minWidth: 0,
                                p: 0,
                                borderRadius: 0,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "flex-start",
                                gap: 0,
                                lineHeight: 1,
                                color: "#164a96",
                                backgroundColor: "transparent",
                                "&:hover": {
                                    backgroundColor: "transparent",
                                    opacity: 0.82,
                                },
                            }}
                        >
                            <ReceiptLongIcon
                                sx={{
                                    color: "#164a96",
                                    fontSize: 25,
                                    lineHeight: 1,
                                    mt: 1 , // esse cara alinha o ícone com o meio do TOTAL
                                }}
                            />

                            <KeyboardArrowDownIcon
                                sx={{
                                    color: "rgba(13,71,161,0.82)",
                                    fontSize: 13,
                                    mt: -0.45,
                                    lineHeight: 1,
                                }}
                            />
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}