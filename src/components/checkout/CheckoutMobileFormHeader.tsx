import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

import FastFuelCheckoutLogo from "../../assets/fast-fuel-checkout.png";

type Props = {
    onExit: () => void;
};

export default function CheckoutMobileFormHeader({
    onExit,
}: Props) {
    return (
        <Box
            sx={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1500,
                width: "100%",
                pt: "env(safe-area-inset-top)",
                bgcolor: "#ffffff",
                borderBottom: "1px solid rgba(13,71,161,0.08)",
            }}
        >
            <Box
                sx={{
                    height: 58,
                    px: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Button
                    onClick={onExit}
                    startIcon={
                        <ArrowBackRoundedIcon
                            sx={{ fontSize: 18 }}
                        />
                    }
                    sx={{
                        minWidth: 0,
                        px: 0.8,
                        color: "#0d47a1",
                        fontWeight: 800,
                        fontSize: "0.78rem",
                        letterSpacing: "0.04em",
                        textTransform: "none",
                        whiteSpace: "nowrap",

                        "&:hover": {
                            bgcolor: "rgba(13,71,161,0.05)",
                        },
                    }}
                >
                    Back to Checkout
                </Button>

                <Box
                    component="img"
                    src={FastFuelCheckoutLogo}
                    alt=""
                    aria-hidden="true"
                    sx={{
                        width: 52,
                        height: 52,
                        objectFit: "contain",
                        opacity: 0.55,
                        pointerEvents: "none",
                        userSelect: "none",
                    }}
                />
            </Box>
        </Box>
    );
}