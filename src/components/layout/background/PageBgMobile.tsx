import React from "react";
import Box from "@mui/material/Box";

type PageBgMobileProps = {
  children: React.ReactNode;
  plain?: boolean;
};

export default function PageBgMobile({
  children,
  plain = false,
}: PageBgMobileProps) {
  return (
    <Box
      sx={{
        minHeight: "100dvh",
        overflowX: "hidden",

        background: plain
          ? "#ffffff"
          : `
              repeating-linear-gradient(
                90deg,
                #ffffff 0px,
                #ffffff 25px,
                rgba(0, 0, 0, 0.009) 25px,
                rgba(0, 0, 0, 0.009) 50px
              )
            `,
      }}
    >
      {children}
    </Box>
  );
}