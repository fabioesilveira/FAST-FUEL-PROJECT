import * as React from "react";
import Box from "@mui/material/Box";

type PageBgProps = {
    children: React.ReactNode;
    stripeCenterWidth?: number;
    stripeWidth?: number;
    gapWidth?: number;
    stripeAlpha?: number;
    centerBgAlpha?: number;
};

export default function PageBg({
    children,
    stripeCenterWidth = 1150,
    stripeWidth = 10,
    gapWidth = 18,
    stripeAlpha = 0.12,
    centerBgAlpha = 1,
}: PageBgProps) {
    const period = stripeWidth + gapWidth;

    return (
        <Box
            sx={{
                position: "relative",
                minHeight: "100vh",

                "&::before": {
                    content: '""',
                    position: "fixed",
                    inset: 0,
                    zIndex: 0,
                    pointerEvents: "none",
                    backgroundImage: `repeating-linear-gradient(90deg,
                 rgba(255, 244, 225, ${stripeAlpha}) 0px,
                 rgba(255, 244, 225, ${stripeAlpha}) ${stripeWidth}px,
                 rgba(255, 255, 255, 1) ${stripeWidth}px,
                 rgba(255, 255, 255, 1) ${period}px
                )`,
                    backgroundRepeat: "repeat",
                },

                "&::after": {
                    content: '""',
                    position: "fixed",
                    top: 0,
                    bottom: 0,

                    left: 0,
                    right: 0,
                    marginLeft: "auto",
                    marginRight: "auto",

                    width: "100vw",
                    maxWidth: `${stripeCenterWidth}px`,

                    zIndex: 1,
                    pointerEvents: "none",
                    backgroundColor:
                        centerBgAlpha >= 1 ? "#fff" : `rgba(255,255,255,${centerBgAlpha})`,
                },
            }}
        >
            <Box sx={{ position: "relative", zIndex: 2 }}>{children}</Box>
        </Box>
    );
}
