import { styled } from "@mui/material/styles";
import EmailIcon from "@mui/icons-material/Email";
import { useNavigate } from "react-router-dom";

const MobileContactBubble = styled("button")(({ theme }) => ({
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
  WebkitTapHighlightColor: "transparent",

  // reset button defaults
  padding: 0,
  outline: "none",

  "@media (hover: hover) and (pointer: fine)": {
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 12px 26px rgba(0,0,0,0.22)",
    },
  },

  "&:active": { transform: "translateY(0)" },

  // remove “marked/focus” look on mobile
  "&:focus, &:focus-visible": {
    outline: "none",
  },

  [theme.breakpoints.up("sm")]: { display: "none" },
}));

export default function FloatingContactMobile() {
  const navigate = useNavigate();

  return (
    <MobileContactBubble
      type="button"
      onPointerUp={(e) => (e.currentTarget as HTMLButtonElement).blur()}
      onClick={() => navigate("/contact-us")}
      aria-label="Contact us"
    >
      <EmailIcon sx={{ color: "#ffe0c7", fontSize: 26 }} />
    </MobileContactBubble>
  );
}
