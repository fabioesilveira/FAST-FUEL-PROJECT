import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Rating from "@mui/material/Rating";
import { cleanProductName } from "../../utils/homeHelpers";
import { useNavigate } from "react-router-dom";

export type HomeReview = {
    id: number;
    product_id: number;
    product_name: string;
    display_name: string;
    rating: number;
    comment: string | null;
    verified_purchase: number;
    created_at: string;
};

type Props = {
    reviews: HomeReview[];
};

export default function MobileReviewsCarousel({
    reviews,
}: Props) {

    const navigate = useNavigate();

    if (!reviews.length) return null;

    return (
        <Box
            sx={{
                mt: 2.4,
                mb: 2,
                width: "100%",
            }}
        >
            <Typography
                sx={{
                    textAlign: "center",
                    textTransform: "uppercase",
                    color: "#0d47a1",
                    fontWeight: 900,
                    letterSpacing: "0.1em",
                    fontSize: "0.95rem",
                    mb: 1.2,
                }}
            >
                What Consumers Are Saying
            </Typography>

            <Box
                sx={{
                    width: 48,
                    height: 3,
                    bgcolor: "#e65100",
                    borderRadius: 999,
                    mx: "auto",
                    mb: 2.65,
                }}
            />

            <Box
                sx={{
                    display: "flex",
                    gap: 1.5,
                    overflowX: "auto",
                    px: 2,
                    pb: 1.5,
                    scrollSnapType: "x mandatory",
                    WebkitOverflowScrolling: "touch",
                    scrollbarWidth: "none",

                    "&::-webkit-scrollbar": {
                        display: "none",
                    },
                }}
            >
                {reviews.map((review) => (
                    <Box
                        key={review.id}
                        sx={{
                            flex: "0 0 82%",
                            maxWidth: 330,
                            scrollSnapAlign: "center",
                            bgcolor: "#f4f4f4",
                            border:
                                "1px solid rgba(13,71,161,0.14)",
                            boxShadow:
                                "0 4px 14px rgba(13,71,161,0.08)",
                            borderRadius: 3,
                            px: 2.2,
                            py: 2,
                            minHeight: 150,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                        }}
                    >
                        <Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: 1,
                                    mb: 0.8,
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: "0.78rem",
                                        fontWeight: 900,
                                        color: "#0d47a1",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                        maxWidth: "65%",
                                    }}
                                >
                                    {cleanProductName(review.product_name)}
                                </Typography>

                                <Typography
                                    sx={{
                                        fontSize: "0.68rem",
                                        fontWeight: 600,
                                        color: "rgba(20,20,20,0.5)",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {new Date(
                                        review.created_at
                                    ).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                    })}
                                </Typography>
                            </Box>

                            <Rating
                                value={review.rating}
                                readOnly
                                size="small"
                                sx={{
                                    mb: 1.2,

                                    "& .MuiRating-iconFilled": {
                                        color: "#e65100",
                                    },
                                }}
                            />

                            <Typography
                                sx={{
                                    fontSize: "0.88rem",
                                    lineHeight: 1.6,
                                    color: "rgba(20,20,20,0.75)",
                                }}
                            >
                                “{review.comment}”
                            </Typography>
                        </Box>

                        <Box sx={{ mt: 1.5 }}>
                            <Typography
                                sx={{
                                    fontSize: "0.78rem",
                                    fontWeight: 800,
                                    color: "#0d47a1",
                                }}
                            >
                                — {review.display_name}
                            </Typography>

                            {review.verified_purchase === 1 && (
                                <Typography
                                    sx={{
                                        mt: 0.4,
                                        fontSize: "0.7rem",
                                        fontWeight: 700,
                                        color: "#e65100",
                                    }}
                                >
                                    Verified Purchase
                                </Typography>
                            )}
                        </Box>
                    </Box>
                ))}

                <Box
                    component="button"
                    type="button"
                    aria-label="See all reviews"
                    onClick={() => navigate("/reviews")}
                    sx={{
                        flex: "0 0 82%",
                        maxWidth: 330,
                        scrollSnapAlign: "center",
                        bgcolor: "#0d47a1",
                        border: "none",
                        boxShadow:
                            "0 4px 14px rgba(13,71,161,0.14)",
                        borderRadius: 3,
                        px: 2.2,
                        py: 2,
                        minHeight: 150,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "inherit",
                        cursor: "pointer",
                        color: "#fff",
                        WebkitTapHighlightColor: "transparent",

                        transition:
                            "transform 180ms ease, box-shadow 180ms ease",

                        "@media (hover: hover)": {
                            "&:hover": {
                                transform: "translateY(-2px)",
                                boxShadow:
                                    "0 8px 18px rgba(13,71,161,0.20)",
                            },
                        },

                        "&:active": {
                            transform: "scale(0.98)",
                        },
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: "1rem",
                            fontWeight: 900,
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                        }}
                    >
                        See All Reviews
                    </Typography>

                    <Typography
                        sx={{
                            mt: 0.8,
                            fontSize: "0.78rem",
                            color: "rgba(255,255,255,0.82)",
                        }}
                    >
                        Browse all customer feedback →
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}