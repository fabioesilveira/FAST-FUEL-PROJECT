import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import HomeSearchProductCard from "./HomeSearchProductCard";
import type { Meal } from "../../context/context";

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
                    {/* HEADLINE */}
                    <Typography
                        align="center"
                        sx={{
                            mb: { xs: 4.5, sm: 4.5, md: 3.5 },
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

                    {/* READY TO ORDER */}

                    <Box sx={{ display: "flex", justifyContent: "center", mt: 0.5, mb: 3 }}>
                        <Box
                            onClick={enterFastThru}
                            sx={{
                                fontSize: { xs: "0.82rem", sm: "0.85rem", md: "0.88rem" },
                                px: { xs: 1.6, sm: 1.7, md: 1.8 },
                                py: { xs: 1.05, sm: 1.1, md: 1.15 },
                                mb: { xs: 1.5, md: 1.5 },
                                borderRadius: "8px",
                                backgroundColor: "#1e5bb8",
                                color: "#fff",
                                fontFamily: "Titan One",
                                letterSpacing: "0.09em",
                                textTransform: "uppercase",
                                lineHeight: 1,
                                cursor: "pointer",
                                border: "1px solid rgba(230,81,0,0.18)",
                                boxShadow: 2,
                                transition: "all 0.2s ease",
                                "&:hover": {
                                    backgroundColor: "#163f82",
                                    transform: "translateY(-2px)",
                                },
                            }}
                        >
                            READY TO ORDER
                        </Box>

                    </Box>

                    {/* GRID */}
                    <Box
                        sx={{
                            display: "grid",
                            justifyContent: "center",
                            justifyItems: "center",
                            gap: 4,
                            mb: 2,
                            gridTemplateColumns: {
                                xs: "repeat(1, 260px)",
                                sm:
                                    filteredData.length === 1
                                        ? "repeat(1, 300px)"
                                        : "repeat(2, 300px)",
                                md:
                                    filteredData.length === 1
                                        ? "repeat(1, 300px)"
                                        : "repeat(2, 300px)",
                                lg:
                                    filteredData.length === 1
                                        ? "repeat(1, 300px)"
                                        : "repeat(2, 300px)",
                            },
                        }}
                    >
                        {filteredData.map((e) => (
                            <HomeSearchProductCard
                                key={String(e.id)}
                                product={e}
                            />
                        ))}
                    </Box>
                </>
            )}
        </>
    );
}