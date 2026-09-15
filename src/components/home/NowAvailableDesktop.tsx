import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

type Props = {
    onOpenFastThru: () => void;
};

export default function NowAvailableDesktop({
    onOpenFastThru,
}: Props) {
    return (
        <Box
            sx={{
                height: "100%",
                px: 3,
                py: 3,
                borderRadius: 4,
                background:
                    "linear-gradient(135deg, #0f766e 0%, #2fb7a8 100%)",
                boxShadow:
                    "0 8px 24px rgba(13,71,161,0.18)",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Typography
                sx={{
                    fontSize: "0.74rem",
                    fontWeight: 900,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "#ffe0c7",
                    mb: 0.9,
                }}
            >
                Now Available
            </Typography>

            <Typography
                sx={{
                    fontSize: "1.25rem",
                    lineHeight: 1.25,
                    fontWeight: 900,
                    color: "#fff",
                    mb: 1.1,
                    maxWidth: 320,
                }}
            >
                Skip the line. Order from home.
            </Typography>

            <Typography
                sx={{
                    fontSize: "0.82rem",
                    lineHeight: 1.6,
                    color: "rgba(255,255,255,0.82)",
                    maxWidth: 340,
                    mx: "auto",
                    mb: 2,
                }}
            >
                Get your Fast Fuel favorites delivered straight to your door
                with a fast and simple ordering experience.
            </Typography>

            <Button
                variant="contained"
                onClick={onOpenFastThru}
                sx={{
                    bgcolor: "#e65100",
                    color: "#fff",
                    fontWeight: 900,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    borderRadius: 999,
                    px: 3,
                    py: 1,
                    fontSize: "0.76rem",

                    "&:hover": {
                        bgcolor: "#c74400",
                    },
                }}
            >
                Order Now
            </Button>
        </Box>
    );
}