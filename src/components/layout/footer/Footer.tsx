import { Box, Typography } from "@mui/material";

type FooterProps = {
  fixed?: boolean;
};

export default function Footer({ fixed = true }: FooterProps) {
  return (
    <Box
      component="footer"
      sx={{
        position: fixed ? "fixed" : "static",
        bottom: fixed ? 0 : "auto",
        left: fixed ? 0 : "auto",
        width: "100%",
        backgroundColor: "#e65100",
        color: "#fff3e0",
        py: 2,
        textAlign: "center",
        boxShadow: "0 -3px 10px rgba(0,0,0,0.25)",
        zIndex: fixed ? 1300 : "auto",
      }}
    >
      <Typography variant="body2">
        © {new Date().getFullYear()} Fast Fuel.
      </Typography>
    </Box>
  );
}