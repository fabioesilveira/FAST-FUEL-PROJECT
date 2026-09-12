import { Box } from "@mui/material";

type HomeDesktopGridProps = {
    left: React.ReactNode;
    topRight: React.ReactNode;
    bottomRight: React.ReactNode;
};

export default function HomeDesktopGrid({
    left,
    topRight,
    bottomRight,
}: HomeDesktopGridProps) {
    return (
        <Box
            sx={{
                width: "100%",
                maxWidth: 1280,
                mx: "auto",
                px: {
                    md: 3,
                    lg: 4,
                },
                display: "grid",
                gridTemplateColumns: {
                    md: "minmax(0, 3fr) minmax(0, 2fr)",
                },
                gap: 2.5,
                alignItems: "stretch",
            }}
        >
            <Box
                sx={{
                    minWidth: 0,
                    height: "100%",
                }}
            >
                {left}
            </Box>

            <Box
                sx={{
                    minWidth: 0,
                    display: "grid",
                    gridTemplateRows: "1fr 1fr",
                    gap: 2.5,
                    height: "100%",
                }}
            >
                <Box
                    sx={{
                        minWidth: 0,
                        height: "100%",
                    }}
                >
                    {topRight}
                </Box>

                <Box
                    sx={{
                        minWidth: 0,
                        height: "100%",
                    }}
                >
                    {bottomRight}
                </Box>
            </Box>
        </Box>
    );
}