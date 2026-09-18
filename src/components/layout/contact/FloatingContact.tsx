import { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import EmailIcon from "@mui/icons-material/Email";
import { useNavigate } from "react-router-dom";

const FloatingWrapper = styled("button", {
  shouldForwardProp: (prop) => prop !== "hidden",
})<{ hidden?: boolean }>(({ theme, hidden }) => ({
  position: "fixed",
  right: 0,
  bottom: 170,
  zIndex: 1300,

  display: "flex",
  alignItems: "center",
  gap: 10,

  width: 185,
  boxSizing: "border-box",
  justifyContent: "center",
  padding: "9px 15px 9px 13px",

  borderTopLeftRadius: 10,
  borderBottomLeftRadius: 10,

  backgroundColor: "#ffe0c7",

  borderTop: "2.5px solid rgba(230, 81, 0, 0.85)",
  borderBottom: "2.5px solid rgba(230, 81, 0, 0.85)",
  borderLeft: "2.5px solid rgba(230, 81, 0, 0.85)",
  borderRight: "none",

  cursor: hidden ? "default" : "pointer",
  boxShadow: "0 8px 22px rgba(0,0,0,0.25)",

  transform: hidden ? "translateX(115%)" : "translateX(0)",
  transition: "transform 280ms ease",
  willChange: "transform",

  outline: "none",
  WebkitTapHighlightColor: "transparent",
  appearance: "none",

  "@media (hover: hover) and (pointer: fine)": {
    "&:hover": {
      backgroundColor: "rgba(230, 81, 0, 0.12)",

      borderTop: "3px solid rgba(230, 81, 0, 0.45)",
      borderBottom: "3px solid rgba(230, 81, 0, 0.45)",
      borderLeft: "3px solid rgba(230, 81, 0, 0.45)",

      borderTopLeftRadius: 7,
      borderBottomLeftRadius: 7,

      width: 198,

      boxShadow: "0 10px 26px rgba(0,0,0,0.18)",
    },
  },

  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
}));

export default function FloatingContact() {
  const navigate = useNavigate();
  const [hideContact, setHideContact] = useState(false);

  useEffect(() => {
    const footer = document.getElementById("home-footer");

    if (!footer) {
      setHideContact(false);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setHideContact(entry.isIntersecting);
      },
      {
        threshold: 0,
        rootMargin: "0px 0px -120px 0px",
      }
    );

    observer.observe(footer);

    return () => observer.disconnect();
  }, []);

  return (
    <FloatingWrapper
      hidden={hideContact}
      type="button"
      onPointerUp={(e) =>
        (e.currentTarget as HTMLButtonElement).blur()
      }
      onClick={() => navigate("/contact-us")}
      aria-label="Contact us"
    >
      <EmailIcon
        sx={{
          color: "#e65100",
          fontSize: 25,
        }}
      />

      <Typography
        sx={{
          fontWeight: 700,
          fontSize: "1.07rem",
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