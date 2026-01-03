import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";

const MobileContactBubble = styled(Box)(({ theme }) => ({
  position: "fixed",
  right: 14,
  bottom: 150, 
  zIndex: 1400,

  width: 54,
  height: 54,
  borderRadius: "999px",

  display: "grid",
  placeItems: "center",

  backgroundColor: "#e65100",
  border: "2px solid rgba(255, 224, 199, 0.95)",
  boxShadow: "0 10px 22px rgba(0,0,0,0.28)",
  cursor: "pointer",
  transition: "all .2s ease",

  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 12px 26px rgba(0,0,0,0.22)",
  },

  "&:active": {
    transform: "translateY(0)",
  },

  [theme.breakpoints.up("sm")]: {
    display: "none",
  },
}));

export default function FloatingContactMobile() {
  return (
    <MobileContactBubble
      onClick={() => {
        window.location.href = "/contact-us";
      }}
      aria-label="Contact us"
      role="button"
    >
      <EmailIcon sx={{ color: "#ffe0c7", fontSize: 26 }} />
    </MobileContactBubble>
  );
}
