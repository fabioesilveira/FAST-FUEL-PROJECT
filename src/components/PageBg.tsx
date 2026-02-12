import React from "react";
import Box from "@mui/material/Box";

type PageBgProps = {
    children: React.ReactNode;
    centerMaxWidth?: number;
    fadeWidth?: number;
};

export default function PageBg({
    children,
    centerMaxWidth = 1000,
    fadeWidth = 180,
}: PageBgProps) {
    const half = centerMaxWidth / 2;

    return (
        <Box
            sx={{
                minHeight: "100dvh",
                position: "relative",
                bgcolor: "#ffffff",
                overflowX: "hidden",
            }}
        >
            <Box
                aria-hidden
                sx={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 0,
                    pointerEvents: "none",
                    backgroundImage: `
            repeating-linear-gradient(
              to right,
              rgba(255, 244, 225, 0.30) 0px,
              rgba(255, 244, 225, 0.30) 22px,
              rgba(255, 255, 255, 1) 22px,
              rgba(255, 255, 255, 1) 44px
            )
          `,
                    WebkitMaskImage: `linear-gradient(
            90deg,
            rgba(0,0,0,1) 0%,
            rgba(0,0,0,1) calc(50% - ${half + fadeWidth}px),
            rgba(0,0,0,0) calc(50% - ${half}px),
            rgba(0,0,0,0) calc(50% + ${half}px),
            rgba(0,0,0,1) calc(50% + ${half + fadeWidth}px),
            rgba(0,0,0,1) 100%
          )`,
                    maskImage: `linear-gradient(
            90deg,
            rgba(0,0,0,1) 0%,
            rgba(0,0,0,1) calc(50% - ${half + fadeWidth}px),
            rgba(0,0,0,0) calc(50% - ${half}px),
            rgba(0,0,0,0) calc(50% + ${half}px),
            rgba(0,0,0,1) calc(50% + ${half + fadeWidth}px),
            rgba(0,0,0,1) 100%
          )`,
                }}
            />

            {/* content */}
            <Box
                sx={{
                    position: "relative",
                    zIndex: 1,
                    minHeight: "100dvh",
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <Box
                    sx={{
                        width: "100%",
                        maxWidth: centerMaxWidth,
                        minHeight: "100dvh",
                        bgcolor: "#ffffff",
                        boxShadow: `
              -40px 0 90px rgba(255,255,255,0.98),
               40px 0 90px rgba(255,255,255,0.98)
            `,
                    }}
                >
                    {children}
                </Box>
            </Box>
        </Box>
    );
}
