import { styled } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";

const FloatingWrapper = styled(Box)(({ theme }) => ({
    position: "fixed",
    right: 0,
    bottom: 170,
    zIndex: 1300,


    display: "flex",
    alignItems: "center",
    gap: 10,

    padding: "10px 16px 10px 14px",
    
    borderTopLeftRadius: "12px",
    borderBottomLeftRadius: "12px",

    backgroundColor: "#ffe0c7",

    borderTop: "3px solid rgba(230, 81, 0, 0.85)",
    borderBottom: "3px solid rgba(230, 81, 0, 0.85)",
    borderLeft: "3px solid rgba(230, 81, 0, 0.85)",
    borderRight: "none",

    cursor: "pointer",
    boxShadow: "0 8px 22px rgba(0,0,0,0.25)",
    transition: "all .22s ease",

    "&:hover": {
        backgroundColor: "rgba(230, 81, 0, 0.12)",
        borderTop: "3px solid rgba(230, 81, 0, 0.45)",
        borderBottom: "3px solid rgba(230, 81, 0, 0.45)",
        borderLeft: "3px solid rgba(230, 81, 0, 0.45)",

        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,

        paddingLeft: "22px",

        transform: "translateY(-2px)",
        boxShadow: "0 10px 26px rgba(0,0,0,0.18)",
    },

    "&:active": {
        transform: "translateY(0)",
    },

    [theme.breakpoints.down("sm")]: {
        display: "none",
    },
}));


export default function FloatingContact() {
    return (
        <FloatingWrapper
            onClick={() => {
                window.location.href = "/contact-us";
            }}
        >
            <EmailIcon sx={{ color: "#e65100", fontSize: 30 }} />

            <Typography
                sx={{
                    fontWeight: 700,
                    fontSize: "1.10rem",
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
