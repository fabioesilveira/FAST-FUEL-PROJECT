import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

type CheckoutPaymentSectionProps = {
    tfBlueLabelSx: any;
    mobile?: boolean;
};

export default function CheckoutPaymentSection({
    tfBlueLabelSx,
    mobile = false,
}: CheckoutPaymentSectionProps) {
    const rowSpacing = mobile ? 1.2 : 1.6;
    const sectionMargin = mobile ? 1 : 1.5;

    return (
        <Box sx={{ mb: sectionMargin }}>
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
                Payment
            </Typography>

            <Stack spacing={1.6}>
                <TextField
                    size="small"
                    label="Name on Card*"
                    value="Fast Fuel Payment Simulation"
                    fullWidth
                    variant="outlined"
                    sx={[
                        tfBlueLabelSx,
                        { "& .MuiOutlinedInput-root": { bgcolor: "rgba(13, 71, 161, 0.06)" } },
                    ]}
                    InputProps={{ readOnly: true }}
                />

                <TextField
                    size="small"
                    label="Card Number*"
                    value="4242 4242 4242 4242"
                    fullWidth
                    variant="outlined"
                    sx={[
                        tfBlueLabelSx,
                        { "& .MuiOutlinedInput-root": { bgcolor: "rgba(13, 71, 161, 0.06)" } },
                    ]}
                    InputProps={{ readOnly: true }}
                />

                <Stack direction="row" spacing={rowSpacing}>
                    <TextField
                        size="small"
                        label="Valid Through*"
                        value="12/30"
                        fullWidth
                        variant="outlined"
                        sx={[
                            tfBlueLabelSx,
                            { flex: mobile ? 1 : 7 },
                            { "& .MuiOutlinedInput-root": { bgcolor: "rgba(13, 71, 161, 0.06)" } },
                        ]}
                        InputProps={{ readOnly: true }}
                    />

                    <TextField
                        size="small"
                        label="CVV*"
                        value="123"
                        fullWidth
                        variant="outlined"
                        sx={[
                            tfBlueLabelSx,
                            { flex: mobile ? 1 : 5 },
                            { "& .MuiOutlinedInput-root": { bgcolor: "rgba(13, 71, 161, 0.06)" } },
                        ]}
                        InputProps={{ readOnly: true }}
                    />
                </Stack>

                <Typography
                    align="center"
                    sx={{ mt: 0.5, fontSize: "0.75rem", color: "text.secondary" }}
                >
                    This is a portfolio demo — no real payment is processed.
                </Typography>
            </Stack>
        </Box>
    );
}