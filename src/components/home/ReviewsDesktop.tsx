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

const avatarColors = [
    "#1e5bb8",
    "#e65100",
    "#6b7280",
    "#7a8f7b",
    "#8d6e63",
];

function getAvatarColor(name: string) {
    const value = name
        .split("")
        .reduce((total, char) => total + char.charCodeAt(0), 0);

    return avatarColors[value % avatarColors.length];
}

export default function ReviewsDesktop({ reviews }: Props) {
    const navigate = useNavigate();

    if (!reviews.length) return null;

    return (
        <Box
            sx={{
                width: "100%",
                mt: 5,
                mb: 1,
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
                    mb: 1.2,
                }}
            >
                What Consumers Are Saying
            </Typography>

            <Box
                sx={{
                    width: 58,
                    height: 2,
                    bgcolor: "#e65100",
                    borderRadius: 3,
                    mx: "auto",
                    mb: 2.4,
                }}
            />

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                    gap: 2,
                }}
            >
                {reviews.slice(0, 3).map((review) => {
                    const initial =
                        review.display_name?.trim().charAt(0).toUpperCase() || "?";

                    return (
                        <Box
                            key={review.id}
                            sx={{
                                bgcolor: "#f4f4f4",
                                border: "1px solid rgba(13,71,161,0.14)",
                                boxShadow: "0 4px 14px rgba(13,71,161,0.08)",
                                borderRadius: 2,
                                px: 2.2,
                                py: 2,
                                minHeight: 180,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                transition:
                                    "transform 180ms ease, box-shadow 180ms ease",

                                "&:hover": {
                                    transform: "translateY(-2px)",
                                    boxShadow:
                                        "0 8px 18px rgba(13,71,161,0.12)",
                                },
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: 1.1,
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 34,
                                        height: 34,
                                        borderRadius: "50%",
                                        bgcolor: getAvatarColor(
                                            review.display_name
                                        ),
                                        color: "#fff",
                                        display: "grid",
                                        placeItems: "center",
                                        flexShrink: 0,
                                        fontSize: "0.8rem",
                                        fontWeight: 900,
                                    }}
                                >
                                    {initial}
                                </Box>

                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "flex-start",
                                            justifyContent: "space-between",
                                            gap: 1,
                                            mb: 0.4,
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
                                            {cleanProductName(
                                                review.product_name
                                            )}
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
                                            ).toLocaleDateString(
                                                "en-US",
                                                {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                }
                                            )}
                                        </Typography>
                                    </Box>

                                    <Typography
                                        sx={{
                                            fontSize: "0.74rem",
                                            fontWeight: 800,
                                            color: "rgba(20,20,20,0.62)",
                                            mb: 0.7,
                                        }}
                                    >
                                        {review.display_name}
                                    </Typography>

                                    <Rating
                                        value={review.rating}
                                        readOnly
                                        size="small"
                                        sx={{
                                            mb: 1.1,

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
                            </Box>

                            {review.verified_purchase === 1 && (
                                <Typography
                                    sx={{
                                        mt: 1.4,
                                        ml: 5.7,
                                        fontSize: "0.7rem",
                                        fontWeight: 700,
                                        color: "#e65100",
                                    }}
                                >
                                    Verified Purchase
                                </Typography>
                            )}
                        </Box>
                    );
                })}

                <Box
                    component="button"
                    type="button"
                    onClick={() => navigate("/reviews")}
                    sx={{
                        bgcolor: "#0d47a1",
                        border: "none",
                        boxShadow: "0 4px 14px rgba(13,71,161,0.14)",
                        borderRadius: 2,
                        px: 2.2,
                        py: 2,
                        minHeight: 180,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "inherit",
                        cursor: "pointer",
                        color: "#fff",
                        transition:
                            "transform 180ms ease, box-shadow 180ms ease",

                        "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: "0 8px 18px rgba(13,71,161,0.20)",
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