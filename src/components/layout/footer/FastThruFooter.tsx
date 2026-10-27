import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function FastThruFooter() {
    return (
        <>
            <Typography
                sx={{
                    display: {
                        xs: "none",
                        md: "block",
                    },

                    position: "fixed",
                    right: 355,
                    bottom: 15,

                    fontSize: "0.77rem",
                    fontWeight: 700,
                    letterSpacing: "0.05em",

                    color: "rgba(13, 71, 161, 0.14)",

                    zIndex: -201,

                    userSelect: "none",
                    pointerEvents: "none",
                }}
            >
                © 2026 Fast Fuel.
            </Typography>

            <Box
                sx={{
                    display: {
                        xs: "none",
                        md: "block",
                    },

                    position: "fixed",
                    left: 0,
                    right: 0,
                    bottom: 0,

                    height: "13px",

                    bgcolor: "#e65100",

                    zIndex: 1200,
                }}
            />
        </>
    );
}