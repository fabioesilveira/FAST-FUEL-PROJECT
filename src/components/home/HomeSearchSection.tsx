import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import HomeSearchProductCard from "./HomeSearchProductCard";
import type { Meal } from "../../context/context";

import IconButton from "@mui/material/IconButton";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";

type Props = {
    isSearching: boolean;
    showKeepTyping: boolean;
    showNotFound: boolean;
    hasResults: boolean;
    charsLeft: number;
    headlineText: string;
    isCategorySearch: boolean;
    headlineMt: any;
    filteredData: Meal[];
    enterFastThru: () => void;
};

export default function HomeSearchSection({
    isSearching,
    showKeepTyping,
    showNotFound,
    hasResults,
    charsLeft,
    headlineText,
    isCategorySearch,
    headlineMt,
    filteredData,
    enterFastThru,
}: Props) {

    const [resultIndex, setResultIndex] = useState(0);

    const sortedResults = [...filteredData].sort(
        (a, b) => Number(a.id) - Number(b.id)
    );

    const currentProduct = sortedResults[resultIndex];

    useEffect(() => {
        setResultIndex(0);
    }, [filteredData]);

    function showPreviousResult() {
        setResultIndex((prev) =>
            prev === 0
                ? sortedResults.length - 1
                : prev - 1
        );
    }

    function showNextResult() {
        setResultIndex((prev) =>
            prev === sortedResults.length - 1
                ? 0
                : prev + 1
        );
    }

    if (!isSearching) return null;

    return (
        <>
            {/* KEEP TYPING */}
            {showKeepTyping && (
                <Box
                    sx={{
                        minHeight: { xs: "55dvh", md: "52dvh" },
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        px: 2,
                    }}
                >
                    <Typography
                        align="center"
                        sx={{
                            fontFamily: "Titan One",
                            fontSize: { xs: "22px", md: "30px" },
                            letterSpacing: "0.05em",
                            color: "rgba(13, 71, 161, 0.65)",
                            textAlign: "center",
                        }}
                    >
                        Keep typing… ✍️ <br />
                        <span style={{ fontSize: "0.75em" }}>
                            {charsLeft} more {charsLeft === 1 ? "letter" : "letters"}
                        </span>
                    </Typography>
                </Box>
            )}

            {/* NOT FOUND */}
            {showNotFound && (
                <Box
                    sx={{
                        minHeight: { xs: "55dvh", md: "52dvh" },
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        px: 2,
                    }}
                >
                    <Typography
                        align="center"
                        sx={{
                            fontFamily: "Titan One",
                            fontSize: { xs: "24px", md: "32px" },
                            letterSpacing: "0.05em",
                            color: "rgba(13, 71, 161, 0.65)",
                            textAlign: "center",
                        }}
                    >
                        No products found 😕 <br />
                        <span style={{ fontSize: "0.77em" }}>
                            Try a different search
                        </span>
                    </Typography>
                </Box>
            )}

            {/* RESULTS */}
            {hasResults && (
                <>
                    <Typography
                        align="center"
                        sx={{
                            mb: { xs: 4.5, sm: 4.5, md: 5.8 },
                            mt: headlineMt,
                            fontFamily: "Titan One",
                            fontSize: isCategorySearch
                                ? { xs: "25px", sm: "28px", md: "29px" }
                                : { xs: "23px", sm: "26px", md: "27px" },
                            letterSpacing: isCategorySearch ? "0.08em" : "0.04em",
                            lineHeight: 1.12,
                            textTransform: "uppercase",
                            color: "#ff8a4c",
                            textShadow: "0 1px 2px rgba(30, 91, 184, 0.22)",
                            px: { xs: 1, sm: 0 },
                        }}
                    >
                        {headlineText}
                    </Typography>

                    {/* SEARCH RESULT CAROUSEL */}
                    <Box
                        sx={{
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            mb: 2,
                            mt: 3
                        }}
                    >
                        <Typography
                            sx={{
                                mb: 1.5,
                                minHeight: "18px",
                                fontSize: "0.76rem",
                                fontWeight: 800,
                                color: "rgba(13, 71, 161, 0.55)",
                                letterSpacing: "0.06em",
                            }}
                        >
                            {resultIndex + 1} of {sortedResults.length}
                        </Typography>

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: {
                                    xs: 1,
                                    sm: 2,
                                    md: 3,
                                },
                                width: "100%",
                            }}
                        >
                            {sortedResults.length > 1 && (
                                <IconButton
                                    onClick={showPreviousResult}
                                    aria-label="Previous product"
                                    sx={{
                                        width: { xs: 38, sm: 44 },
                                        height: { xs: 38, sm: 44 },
                                        flexShrink: 0,
                                        mr: 0.6,
                                        color: "#0d47a1",
                                        bgcolor: "rgba(13, 71, 161, 0.08)",
                                        border: "1px solid rgba(13, 71, 161, 0.16)",

                                        "&:hover": {
                                            bgcolor: "rgba(13, 71, 161, 0.14)",
                                        },
                                    }}
                                >
                                    <ArrowBackIosNewRoundedIcon
                                        sx={{ fontSize: 18, mr: 0.18 }}
                                    />
                                </IconButton>
                            )}

                            <Box
                                key={String(currentProduct?.id)}
                                sx={{
                                    width: {
                                        xs: 260,
                                        sm: 300,
                                    },

                                    animation:
                                        "searchCardIn 240ms ease",

                                    "@keyframes searchCardIn": {
                                        from: {
                                            opacity: 0,
                                            transform:
                                                "translateY(8px) scale(0.98)",
                                        },

                                        to: {
                                            opacity: 1,
                                            transform:
                                                "translateY(0) scale(1)",
                                        },
                                    },
                                }}
                            >
                                {currentProduct && (
                                    <HomeSearchProductCard
                                        product={currentProduct}
                                    />
                                )}
                            </Box>

                            {sortedResults.length > 1 && (
                                <IconButton
                                    onClick={showNextResult}
                                    aria-label="Next product"
                                    sx={{
                                        width: { xs: 38, sm: 44 },
                                        height: { xs: 38, sm: 44 },
                                        flexShrink: 0,
                                        ml: 0.6,
                                        color: "#0d47a1",
                                        bgcolor: "rgba(13, 71, 161, 0.08)",
                                        border: "1px solid rgba(13, 71, 161, 0.16)",

                                        "&:hover": {
                                            bgcolor: "rgba(13, 71, 161, 0.14)",
                                        },
                                    }}
                                >
                                    <ArrowForwardIosRoundedIcon
                                        sx={{ fontSize: 18, ml: 0.18 }}
                                    />
                                </IconButton>
                            )}
                        </Box>

                        {/* READY TO ORDER */}
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                mt: 3.7,
                                mb: 3,
                            }}
                        >
                            <Box
                                onClick={enterFastThru}
                                sx={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer",
                                    position: "relative",

                                    fontFamily: "Titan One",
                                    fontSize: { xs: "0.9rem", md: "0.95rem" },
                                    letterSpacing: "0.08em",
                                    textTransform: "uppercase",
                                    color: "#1e5bb8",

                                    "&::after": {
                                        content: '""',
                                        position: "absolute",
                                        left: 0,
                                        bottom: "-5px",
                                        width: "100%",
                                        height: "2px",
                                        backgroundColor: "#ff8a4c",
                                        transform: "scaleX(0.65)",
                                        transformOrigin: "center",
                                        transition: "transform 0.2s ease",
                                    },

                                    "&:hover::after": {
                                        transform: "scaleX(1)",
                                    },

                                    "&:hover": {
                                        color: "#163f82",
                                    },
                                }}
                            >
                                Ready to order? →
                            </Box>
                        </Box>
                    </Box>
                </>
            )}
        </>
    );
}