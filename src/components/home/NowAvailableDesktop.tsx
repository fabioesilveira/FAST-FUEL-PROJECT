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
                borderRadius: 1.3,
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
                    fontSize: "0.86rem",
                    fontWeight: 900,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "#ffe0c7",
                    mb: 1.4,
                }}
            >
                Now Available
            </Typography>

            <Typography
                sx={{
                    fontSize: "1.5rem",
                    lineHeight: 1.3,
                    fontWeight: 900,
                    color: "#fff",
                    mb: 1.5,
                    maxWidth: 340,
                }}
            >
                Skip the line. Order from home.
            </Typography>

            <Typography
                sx={{
                    fontSize: "0.95rem",
                    lineHeight: 1.7,
                    color: "rgba(255,255,255,0.86)",
                    maxWidth: 350,
                    mx: "auto",
                    mb: 2.8,
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
                    px: 3.5,
                    py: 1.2,
                    fontSize: "0.84rem",

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