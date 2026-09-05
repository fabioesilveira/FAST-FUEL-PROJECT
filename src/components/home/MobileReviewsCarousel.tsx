import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Rating from "@mui/material/Rating";

export type HomeReview = {
    id: number;
    product_id: number;
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
    if (!reviews.length) return null;

    return (
        <Box
            sx={{
                mt: 3.5,
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
                    fontSize: "1rem",
                    mb: 0.8,
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
                    mb: 2.3,
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
                            bgcolor: "#fffaf2",
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
            </Box>
        </Box>
    );
}