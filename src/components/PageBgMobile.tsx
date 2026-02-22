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
        bgcolor: "#ffffff", // mobile clean
      }}
    >
      {children}
    </Box>
  );
}
