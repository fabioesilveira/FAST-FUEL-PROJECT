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
                backgroundColor: "#f6f8fa",
                color: "#24292f",
                px: 3,
                py: 2.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
                border: "1px solid #d0d7de",
                boxShadow: "0 6px 18px rgba(31, 35, 40, 0.10)",
            }}
        >
            <Box>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.2,
                        mb: 0.7,
                    }}
                >
                    <GitHubIcon
                        sx={{
                            fontSize: 30,
                            color: "#24292f",
                        }}
                    />

                    <Typography
                        sx={{
                            fontSize: 16,
                            fontWeight: 800,
                            letterSpacing: 0.5,
                            color: "#24292f",
                        }}
                    >
                        FAST FUEL ON GITHUB
                    </Typography>
                </Box>

                <Typography
                    sx={{
                        fontSize: 13.5,
                        color: "#57606a",
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
                    color: "#24292f",
                    border: "1px solid #d0d7de",
                    backgroundColor: "#ffffff",
                    borderRadius: 2.5,
                    px: 2,
                    py: 1,
                    fontWeight: 700,
                    textTransform: "none",
                    whiteSpace: "nowrap",
                    "&:hover": {
                        backgroundColor: "#f3f4f6",
                        borderColor: "#8c959f",
                    },
                }}
            >
                View Repo
            </Button>
        </Box>
    );
}