import GitHubIcon from "@mui/icons-material/GitHub";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Box, Button, Typography } from "@mui/material";

export default function GitHubRepoDesktop() {
    function openRepo() {
        window.open(
            "https://github.com/fabioesilveira/FAST-FUEL-PROJECT",
            "_blank",
            "noopener,noreferrer"
        );
    }

    return (
        <Box
            sx={{
                width: "100%",
                height: "100%",
                borderRadius: 4,
                background: "linear-gradient(135deg, #0d1117 0%, #24292f 100%)",
                color: "#fff",
                px: 3,
                py: 2.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
                boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
                border: "1px solid rgba(255,255,255,0.08)",
            }}
        >
            <Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.7 }}>
                    <GitHubIcon sx={{ fontSize: 28 }} />

                    <Typography
                        sx={{
                            fontSize: 16,
                            fontWeight: 800,
                            letterSpacing: 0.5,
                        }}
                    >
                        FAST FUEL ON GITHUB
                    </Typography>
                </Box>

                <Typography
                    sx={{
                        fontSize: 13.5,
                        color: "rgba(255,255,255,0.72)",
                        lineHeight: 1.5,
                    }}
                >
                    Explore the source code, architecture, and project implementation.
                </Typography>
            </Box>

            <Button
                onClick={openRepo}
                endIcon={<OpenInNewIcon />}
                sx={{
                    flexShrink: 0,
                    color: "#fff",
                    borderColor: "rgba(255,255,255,0.35)",
                    border: "1px solid",
                    borderRadius: 2.5,
                    px: 2,
                    py: 1,
                    fontWeight: 700,
                    textTransform: "none",
                    whiteSpace: "nowrap",
                    "&:hover": {
                        borderColor: "#fff",
                        backgroundColor: "rgba(255,255,255,0.08)",
                    },
                }}
            >
                View Repo
            </Button>
        </Box>
    );
}