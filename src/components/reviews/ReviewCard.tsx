import { Box, Paper, Stack, Typography } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

type Review = {
    id: number;
    product_id: number;
    product_name: string;
    product_image?: string;
    category: string;
    display_name: string;
    rating: number;
    comment: string | null;
    created_at: string;
};

type ReviewCardProps = {
    review: Review;
    isMobile?: boolean;
    onPreviewOpen: (
        event: React.MouseEvent<HTMLElement>,
        review: Review
    ) => void;
};

const avatarColors = [
    "#1e5bb8",
    "#e65100",
    "#6b7280",
    "#7a8f7b",
    "#8d6e63",
];

function formatReviewDate(date: string) {
    return new Date(date).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
    });
}

function cleanProductName(name: string) {
    return String(name || "")
        .replace(/\/\s*\d+\s*kcal/i, "")
        .replace(/•\s*\d+\s*kcal/i, "")
        .trim();
}

function getAvatarColor(name: string) {
    const value = name
        .split("")
        .reduce((total, char) => total + char.charCodeAt(0), 0);

    return avatarColors[value % avatarColors.length];
}

export default function ReviewCard({
    review,
    isMobile = false,
    onPreviewOpen,
}: ReviewCardProps) {
    const initial =
        review.display_name?.trim().charAt(0).toUpperCase() || "?";

    return (
        <Paper
            elevation={0}
            sx={{
                p: 2,
                borderRadius: 2,
                border: "1px solid rgba(230, 81, 0, 0.28)",
                bgcolor: "#fff4e1",
            }}
        >
            <Stack spacing={0.8}>
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    gap={1}
                >
                    <Box>
                        <Typography
                            onClick={(e) => onPreviewOpen(e, review)}
                            sx={{
                                fontSize: isMobile ? 18.5 : 18,
                                fontWeight: 900,
                                color: "#1e5bb8",
                                cursor: "pointer",
                                lineHeight: 1.1,
                            }}
                        >
                            {cleanProductName(review.product_name)}
                        </Typography>

                        <Stack
                            direction="row"
                            alignItems="center"
                            spacing={0.8}
                            sx={{ mt: 0.55 }}
                        >
                            <Box
                                sx={{
                                    width: 30,
                                    height: 30,
                                    borderRadius: "50%",
                                    bgcolor: getAvatarColor(review.display_name),
                                    color: "#fff",
                                    display: "grid",
                                    placeItems: "center",
                                    flexShrink: 0,
                                    fontSize: "0.76rem",
                                    fontWeight: 900,
                                }}
                            >
                                {initial}
                            </Box>

                            <Typography
                                sx={{
                                    fontSize: "0.82rem",
                                    color: "rgba(0,0,0,0.62)",
                                    fontWeight: 700,
                                }}
                            >
                                {review.display_name} •{" "}
                                {formatReviewDate(review.created_at)}
                            </Typography>
                        </Stack>
                    </Box>

                    <Stack
                        direction="row"
                        spacing={0.15}
                        sx={{ flexShrink: 0 }}
                    >
                        {[1, 2, 3, 4, 5].map((star) => (
                            <StarIcon
                                key={star}
                                sx={{
                                    fontSize: isMobile ? 19 : 20,
                                    color:
                                        star <= review.rating
                                            ? "#e65100"
                                            : "rgba(0,0,0,0.18)",
                                }}
                            />
                        ))}
                    </Stack>
                </Stack>

                <Typography
                    sx={{
                        fontSize: "0.92rem",
                        lineHeight: 1.45,
                        color: "#333",
                    }}
                >
                    {review.comment || "No comment provided."}
                </Typography>
            </Stack>
        </Paper>
    );
}