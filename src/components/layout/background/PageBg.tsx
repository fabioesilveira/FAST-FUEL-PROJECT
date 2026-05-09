import * as React from "react";
import Box from "@mui/material/Box";

type PageBgProps = {
    children: React.ReactNode;
    stripeWidth?: number;
    gapWidth?: number;
    stripeAlpha?: number;
};

export default function PageBg({
    children,
    stripeWidth = 56,
    gapWidth = 54,
    stripeAlpha = 0.36,
}: PageBgProps) {
    const period = stripeWidth + gapWidth;

    return (
        <Box
            sx={{
                position: "relative",
                minHeight: "100vh",
                bgcolor: "#fff",

                "&::before": {
                    content: '""',
                    position: "fixed",
                    inset: 0,
                    zIndex: 0,
                    pointerEvents: "none",

                    background: `
                        repeating-linear-gradient(
                            90deg,
                            rgba(255, 248, 235, ${stripeAlpha}) 0px,
                            rgba(255, 248, 235, ${stripeAlpha}) ${stripeWidth}px,
                            #ffffff ${stripeWidth}px,
                            #ffffff ${period}px
                        )
                    `,

                    maskImage: `
                        linear-gradient(
                            90deg,
                            rgba(0,0,0,1) 0%,
                            rgba(0,0,0,0.95) 18%,
                            rgba(0,0,0,0.55) 34%,
                            rgba(0,0,0,0.12) 46%,
                            rgba(0,0,0,0.12) 54%,
                            rgba(0,0,0,0.55) 66%,
                            rgba(0,0,0,0.95) 82%,
                            rgba(0,0,0,1) 100%
                        )
                    `,

                    WebkitMaskImage: `
                        linear-gradient(
                            90deg,
                            rgba(0,0,0,1) 0%,
                            rgba(0,0,0,0.95) 18%,
                            rgba(0,0,0,0.55) 34%,
                            rgba(0,0,0,0.12) 46%,
                            rgba(0,0,0,0.12) 54%,
                            rgba(0,0,0,0.55) 66%,
                            rgba(0,0,0,0.95) 82%,
                            rgba(0,0,0,1) 100%
                        )
                    `,
                },
            }}
        >
            <Box sx={{ position: "relative", zIndex: 2 }}>
                {children}
            </Box>
        </Box>
    );
}