import React from "react";
import Box from "@mui/material/Box";

type PageBgMobileProps = {
  children: React.ReactNode;
};

export default function PageBgMobile({ children }: PageBgMobileProps) {
  return (
    <Box
      sx={{
        minHeight: "100dvh",
        overflowX: "hidden",
        background: `
  repeating-linear-gradient(
    90deg,
    #ffffff 0px,
    #ffffff 23px,
    rgba(255, 248, 235, 0.38) 23px,
    rgba(255, 248, 235, 0.38) 50px
  )
`,
      }}
    >
      {children}
    </Box>
  );
}