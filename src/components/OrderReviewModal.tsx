import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Zoom from "@mui/material/Zoom";
import Backdrop from "@mui/material/Backdrop";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import type { TransitionProps } from "@mui/material/transitions";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement<any, any> },
    ref: React.Ref<unknown>
) {
    return <Zoom ref={ref} {...props} />;
});

export type ReviewEligibleItem = {
    sale_id: number;
    product_id: number;
    name: string;
    image?: string | null;
    category?: string | null;
    qty?: number;
};

type OrderReviewModalProps = {
    open: boolean;
    item: ReviewEligibleItem | null;
    currentIndex: number;
    totalItems: number;
    rating: number;
    comment: string;
    loading?: boolean;
    suggestionChips?: string[];
    onClose: () => void;
    onSkip: () => void;
    onRatingChange: (value: number) => void;
    onCommentChange: (value: string) => void;
    onSuggestionClick: (value: string) => void;
    onSubmit: () => void;
};

const defaultSuggestions = [
    "Very tasty",
    "Fresh",
    "Great portion",
    "Would order again",
];

export default function OrderReviewModal({
    open,
    item,
    currentIndex,
    totalItems,
    rating,
    comment,
    loading = false,
    suggestionChips = defaultSuggestions,
    onClose,
    onSkip,
    onRatingChange,
    onCommentChange,
    onSuggestionClick,
    onSubmit,
}: OrderReviewModalProps) {
    const isLast = currentIndex >= totalItems - 1;
    const submitLabel = isLast ? "Send Review" : "Send & Next";

    const actionButtonSx = {
        width: "100%",
        minWidth: { xs: "unset", sm: 140, md: 150 },
        height: { xs: "auto", sm: 40, md: 42 },
        py: { xs: 1.1, sm: 0.9, md: 0.9 },
        px: { xs: 2.2, sm: 2.4 },
        borderRadius: "10px",
        fontWeight: 900,
        letterSpacing: { xs: "0.05em", sm: "0.08em" },
        fontSize: { xs: "0.72rem", sm: "0.78rem", md: "0.82rem" },
        whiteSpace: "nowrap",
        textTransform: "uppercase" as const,
    };

    const neutralFieldSx = {
        "& .MuiInputLabel-root": {
            color: "rgba(0,0,0,0.62)",
            fontWeight: 700,
        },
        "& .MuiInputLabel-root.Mui-focused": {
            color: "#3a3a3a",
        },
        "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            backgroundColor: "#fbfbfb",
            "& fieldset": {
                borderColor: "rgba(0,0,0,0.14)",
            },
            "&:hover fieldset": {
                borderColor: "rgba(0,0,0,0.25)",
            },
            "&.Mui-focused fieldset": {
                borderColor: "#4a4a4a",
                borderWidth: 1.8,
            },
        },
    };

    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            transitionDuration={{ enter: 170, exit: 120 }}
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 170,
                sx: {
                    bgcolor: "rgba(0,0,0,0.35)",
                    transition: "opacity 170ms ease",
                },
            }}
            onClose={(_, reason) => {
                if (reason === "backdropClick" || reason === "escapeKeyDown") {
                    onClose();
                }
            }}
            maxWidth="sm"
            fullWidth
            sx={{
                zIndex: 9100,
                "& .MuiBackdrop-root": { zIndex: 9100 },
                "& .MuiDialog-container": { zIndex: 9101 },
                "& .MuiPaper-root": { zIndex: 9102 },
            }}
            PaperProps={{
                sx: {
                    borderRadius: { xs: "16px", md: "20px" },
                    border: "1.5px solid rgba(0,0,0,0.14)",
                    boxShadow: "0 18px 40px rgba(0,0,0,0.18)",
                    backgroundColor: "#ffffff",
                    overflow: "hidden",
                    willChange: "transform, opacity",
                },
            }}
        >
            <DialogTitle
                sx={{
                    position: "relative",
                    textAlign: "center",
                    pt: { xs: 2.4, md: 2.8 },
                    pb: { xs: 1.1, md: 1.3 },
                    px: { xs: 2, md: 3 },
                }}
            >
                <IconButton
                    onClick={onClose}
                    sx={{
                        position: "absolute",
                        right: { xs: 10, md: 12 },
                        top: { xs: 10, md: 12 },
                        color: "rgba(0,0,0,0.62)",
                    }}
                >
                    <CloseRoundedIcon />
                </IconButton>

                <Typography
                    sx={{
                        fontWeight: 900,
                        color: "#111111",
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        fontSize: { xs: "0.98rem", sm: "1.02rem", md: "1.08rem" },
                    }}
                >
                    Tell us how we did
                </Typography>

                <Typography
                    sx={{
                        mt: 0.7,
                        fontWeight: 700,
                        color: "#5a5a5a",
                        fontSize: { xs: "0.76rem", sm: "0.8rem", md: "0.84rem" },
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                    }}
                >
                    Reviewing {Math.min(currentIndex + 1, totalItems)} of {totalItems}
                </Typography>
            </DialogTitle>

            <DialogContent
                sx={{
                    px: { xs: 2, md: 3 },
                    pt: { xs: 0.8, md: 1 },
                    pb: { xs: 1.4, md: 1.8 },
                }}
            >
                {item && (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1.6,
                        }}
                    >
                        <Box
                            sx={{
                                border: "1px solid rgba(0,0,0,0.10)",
                                borderRadius: "14px",
                                backgroundColor: "#fcfcfc",
                                px: { xs: 1.4, md: 1.7 },
                                py: { xs: 1.4, md: 1.6 },
                                display: "flex",
                                alignItems: "center",
                                gap: 1.4,
                            }}
                        >
                            <Box
                                sx={{
                                    width: { xs: 66, md: 74 },
                                    height: { xs: 66, md: 74 },
                                    flexShrink: 0,
                                    borderRadius: "12px",
                                    border: "1px solid rgba(0,0,0,0.10)",
                                    backgroundColor: "#fff",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    overflow: "hidden",
                                    p: 0.8,
                                }}
                            >
                                {item.image ? (
                                    <Box
                                        component="img"
                                        src={item.image}
                                        alt={item.name}
                                        sx={{
                                            maxWidth: "100%",
                                            maxHeight: "100%",
                                            objectFit: "contain",
                                            display: "block",
                                        }}
                                    />
                                ) : null}
                            </Box>

                            <Box sx={{ minWidth: 0 }}>
                                <Typography
                                    sx={{
                                        fontWeight: 900,
                                        color: "#1a1a1a",
                                        fontSize: { xs: "0.9rem", md: "0.98rem" },
                                        lineHeight: 1.25,
                                    }}
                                >
                                    {item.name}
                                </Typography>

                                <Typography
                                    sx={{
                                        mt: 0.35,
                                        color: "rgba(0,0,0,0.60)",
                                        fontSize: { xs: "0.77rem", md: "0.82rem" },
                                        lineHeight: 1.25,
                                    }}
                                >
                                    {item.qty ? `Qty ${item.qty}` : "Purchased item"}
                                </Typography>
                            </Box>
                        </Box>

                        <Box
                            sx={{
                                border: "1px solid rgba(0,0,0,0.10)",
                                borderRadius: "14px",
                                backgroundColor: "#fcfcfc",
                                px: { xs: 1.4, md: 1.7 },
                                py: { xs: 1.4, md: 1.6 },
                            }}
                        >
                            <Typography
                                sx={{
                                    fontWeight: 900,
                                    color: "#1f1f1f",
                                    fontSize: { xs: "0.82rem", md: "0.86rem" },
                                    textTransform: "uppercase",
                                    letterSpacing: "0.05em",
                                    mb: 0.9,
                                }}
                            >
                                Your rating
                            </Typography>

                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: { xs: 0.2, md: 0.35 },
                                    mb: 0.6,
                                }}
                            >
                                {[1, 2, 3, 4, 5].map((value) => {
                                    const active = value <= rating;

                                    return (
                                        <IconButton
                                            key={value}
                                            onClick={() => onRatingChange(value)}
                                            sx={{
                                                p: { xs: 0.4, md: 0.45 },
                                                color: active ? "#f2b01e" : "rgba(0,0,0,0.22)",
                                                transition: "transform 0.14s ease, color 0.14s ease",
                                                "&:active": {
                                                    transform: "scale(0.94)",
                                                },
                                            }}
                                        >
                                            {active ? (
                                                <StarRoundedIcon sx={{ fontSize: { xs: 36, md: 40 } }} />
                                            ) : (
                                                <StarBorderRoundedIcon sx={{ fontSize: { xs: 36, md: 40 } }} />
                                            )}
                                        </IconButton>
                                    );
                                })}
                            </Box>

                            <Typography
                                sx={{
                                    textAlign: "center",
                                    color: "rgba(0,0,0,0.58)",
                                    fontSize: { xs: "0.78rem", md: "0.82rem" },
                                    lineHeight: 1.35,
                                }}
                            >
                                Tap a star to rate this item
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                border: "1px solid rgba(0,0,0,0.10)",
                                borderRadius: "14px",
                                backgroundColor: "#fcfcfc",
                                px: { xs: 1.4, md: 1.7 },
                                py: { xs: 1.4, md: 1.6 },
                            }}
                        >
                            <Typography
                                sx={{
                                    fontWeight: 900,
                                    color: "#1f1f1f",
                                    fontSize: { xs: "0.82rem", md: "0.86rem" },
                                    textTransform: "uppercase",
                                    letterSpacing: "0.05em",
                                    mb: 1,
                                }}
                            >
                                Add a comment
                            </Typography>

                            <Box
                                sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 0.8,
                                    mb: 1.1,
                                }}
                            >
                                {suggestionChips.map((text) => (
                                    <Chip
                                        key={text}
                                        label={text}
                                        onClick={() => onSuggestionClick(text)}
                                        sx={{
                                            borderRadius: "999px",
                                            bgcolor: "#f2f2f2",
                                            color: "#333",
                                            fontWeight: 800,
                                            border: "1px solid rgba(0,0,0,0.08)",
                                            "&:hover": {
                                                bgcolor: "#ebebeb",
                                            },
                                        }}
                                    />
                                ))}
                            </Box>

                            <TextField
                                multiline
                                minRows={4}
                                maxRows={6}
                                fullWidth
                                value={comment}
                                onChange={(e) => onCommentChange(e.target.value)}
                                placeholder="Tell us what you thought about this item..."
                                inputProps={{ maxLength: 500 }}
                                sx={neutralFieldSx}
                            />

                            <Typography
                                sx={{
                                    mt: 0.7,
                                    textAlign: "right",
                                    color: "rgba(0,0,0,0.52)",
                                    fontSize: "0.74rem",
                                }}
                            >
                                {comment.length}/500
                            </Typography>
                        </Box>
                    </Box>
                )}
            </DialogContent>

            <DialogActions
                sx={{
                    p: { xs: 1.8, md: 2.2 },
                    pt: 1,
                    justifyContent: "center",
                }}
            >
                <Box
                    sx={{
                        width: { xs: "100%", sm: "auto" },
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        alignItems: "center",
                        justifyContent: "center",
                        gap: { xs: 1.05, md: 1.2 },
                        mx: "auto",
                    }}
                >
                    <Button
                        onClick={onSkip}
                        disabled={loading}
                        variant="outlined"
                        sx={{
                            ...actionButtonSx,
                            border: "1.8px solid rgba(0,0,0,0.28)",
                            color: "#1f1f1f",
                            "&:hover": {
                                borderColor: "rgba(0,0,0,0.45)",
                                backgroundColor: "rgba(0,0,0,0.04)",
                            },
                        }}
                    >
                        Skip
                    </Button>

                    <Button
                        onClick={onSubmit}
                        disabled={loading || rating < 1}
                        variant="contained"
                        sx={{
                            ...actionButtonSx,
                            color: "#ffffff",
                            backgroundColor: "#4a4a4a",
                            "&:hover": { backgroundColor: "#3a3a3a" },
                            "&:active": {
                                transform: "translateY(1px)",
                                boxShadow: "0 6px 14px rgba(0,0,0,0.18)",
                            },
                            "&.Mui-disabled": {
                                backgroundColor: "rgba(74,74,74,0.35)",
                                color: "rgba(255,255,255,0.85)",
                            },
                        }}
                    >
                        {loading ? "Sending..." : submitLabel}
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
}