import { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import EmailIcon from "@mui/icons-material/Email";
import { useNavigate } from "react-router-dom";

type MobileContactBubbleProps = {
  isHidden: boolean;
};

const MobileContactBubble = styled("button", {
  shouldForwardProp: (prop) => prop !== "isHidden",
})<MobileContactBubbleProps>(({ theme, isHidden }) => ({
  position: "fixed",
  right: 14,
  bottom: 150,
  zIndex: 1400,

  width: 52,
  height: 52,
  borderRadius: "999px",
  display: "grid",
  placeItems: "center",

  backgroundColor: "#e65100",
  border: "2px solid rgba(255, 224, 199, 0.95)",
  boxShadow: "0 10px 22px rgba(0,0,0,0.28)",
  cursor: "pointer",
  padding: 0,
  outline: "none",
  WebkitTapHighlightColor: "transparent",

  opacity: isHidden ? 0 : 1,
  transform: isHidden
    ? "translateX(calc(100% + 20px))"
    : "translateX(0)",

  pointerEvents: isHidden ? "none" : "auto",

  transition:
    "transform 0.3s ease, opacity 0.25s ease, box-shadow 0.2s ease",

  "@media (hover: hover) and (pointer: fine)": {
    "&:hover": {
      boxShadow: "0 12px 26px rgba(0,0,0,0.22)",
    },
  },

  "&:focus, &:focus-visible": {
    outline: "none",
  },

  [theme.breakpoints.up("sm")]: {
    display: "none",
  },
}));

type FloatingContactMobileProps = {
  driveModeActive: boolean;
};

export default function FloatingContactMobile({
  driveModeActive,
}: FloatingContactMobileProps) {
  const navigate = useNavigate();
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    if (!driveModeActive) {
      setIsHidden(false);
      return;
    }

    const handleScroll = () => {
      setIsHidden(window.scrollY > 10);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [driveModeActive]);

  return (
    <MobileContactBubble
      type="button"
      isHidden={isHidden}
      onPointerUp={(event) => event.currentTarget.blur()}
      onClick={() => navigate("/contact-us")}
      aria-label="Contact us"
      aria-hidden={isHidden}
      tabIndex={isHidden ? -1 : 0}
    >
      <EmailIcon
        sx={{
          color: "#ffe0c7",
          fontSize: 25.5,
        }}
      />
    </MobileContactBubble>
  );
}