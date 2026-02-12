import React from "react";
import Box from "@mui/material/Box";

type PageBgMobileProps = {
    children: React.ReactNode;
    stripeWidth?: number;
    gapWidth?: number;
    stripeAlpha?: number;
};

export default function PageBgMobile({
    children,
    stripeWidth = 3,
    gapWidth = 18,
    stripeAlpha = 0.045
}: PageBgMobileProps) {

    const total = stripeWidth + gapWidth;

    return (
        <Box
            sx={{
                minHeight: "100dvh",
                overflowX: "hidden",
                bgcolor: "#ffffff",

                backgroundImage: `
          repeating-linear-gradient(
            to right,
            rgba(255, 244, 225, ${stripeAlpha}) 0px,
            rgba(255, 244, 225, ${stripeAlpha}) ${stripeWidth}px,
            rgba(255,255,255,1) ${stripeWidth}px,
            rgba(255,255,255,1) ${total}px
          )
        `,

                backgroundAttachment: "scroll",

                backgroundBlendMode: "normal",
            }}
        >
            {children}
        </Box>
    );
}
