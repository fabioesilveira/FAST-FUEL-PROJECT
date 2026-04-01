import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

type CheckoutContactSectionProps = {
    fullName: string;
    email: string;
    isLogged: boolean;
    tfBlueLabelSx: any;
    onFullNameChange: (value: string) => void;
    onEmailChange: (value: string) => void;
};

export default function CheckoutContactSection({
    fullName,
    email,
    isLogged,
    tfBlueLabelSx,
    onFullNameChange,
    onEmailChange,
}: CheckoutContactSectionProps) {
    return (
        <Box sx={{ mb: 3.2 }}>
            <Typography
                variant="subtitle1"
                align="center"
                sx={{
                    textTransform: "uppercase",
                    letterSpacing: "0.16em",
                    mb: 2,
                    fontWeight: 700,
                    position: "relative",
                    "&::after": {
                        content: '""',
                        display: "block",
                        width: 52,
                        height: 3,
                        borderRadius: 999,
                        bgcolor: "#0d47a1",
                        mx: "auto",
                        mt: 0.8,
                    },
                }}
            >
                Contact Info
            </Typography>

            <Stack spacing={1.6}>
                <TextField
                    size="small"
                    label="Full Name*"
                    fullWidth
                    variant="outlined"
                    sx={tfBlueLabelSx}
                    value={fullName}
                    onChange={(e) => onFullNameChange(e.target.value)}
                    InputProps={{ readOnly: isLogged }}
                />

                <TextField
                    size="small"
                    label="Email*"
                    type="email"
                    fullWidth
                    variant="outlined"
                    sx={tfBlueLabelSx}
                    value={email}
                    onChange={(e) => onEmailChange(e.target.value)}
                    InputProps={{ readOnly: isLogged }}
                />
            </Stack>

            {!isLogged && (
                <Typography
                    align="center"
                    sx={{ mt: 1.4, fontSize: "0.75rem", color: "text.secondary" }}
                >
                    Guest checkout: keep your <b>Order Number</b> to track your order later.
                </Typography>
            )}
        </Box>
    );
}