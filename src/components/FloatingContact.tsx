import { styled, alpha } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";

const FloatingWrapper = styled(Box)(({ theme }) => ({
  position: "fixed",
  right: 20,
  bottom: 250, 
  zIndex: 1300,

  display: "flex",
  alignItems: "center",
  gap: 10,

  padding: "10px 16px",
  borderRadius: 999,

  backgroundColor: alpha("#e65100", 0.08),
  border: "2px solid rgba(230, 81, 0, 0.85)",

  cursor: "pointer",
  boxShadow: "0 8px 22px rgba(0,0,0,0.25)",
  transition: "all .2s ease",

  "&:hover": {
    backgroundColor: alpha("#e65100", 0.14),
    transform: "translateY(-2px)",
  },

  "&:active": {
    transform: "translateY(0)",
  },

  // opcional: esconder no mobile
  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
}));

export default function FloatingContact() {
  return (
    <FloatingWrapper
      onClick={() => {
        // pode abrir modal, navegar ou scrollar
        window.location.href = "/contact-us";
      }}
    >
      <EmailIcon sx={{ color: "#e65100", fontSize: 20 }} />

      <Typography
        sx={{
          fontWeight: 700,
          fontSize: "0.85rem",
          color: "#0d47a1",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
        }}
      >
        Contact us
      </Typography>
    </FloatingWrapper>
  );
}
