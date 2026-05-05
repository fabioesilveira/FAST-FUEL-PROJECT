import { Box, Button, Chip, Stack, TextField } from "@mui/material";

type GuestOrderFiltersProps = {
    emailFilter: string;
    orderCodeFilter: string;
    loading: boolean;
    canSearch: boolean;
    tfBlueLabelSx: any;
    isMobile: boolean;
    onEmailChange: (value: string) => void;
    onOrderCodeChange: (value: string) => void;
    onSearch: () => void;
    onReset: () => void;
};

export default function GuestOrderFilters({
    emailFilter,
    orderCodeFilter,
    loading,
    canSearch,
    tfBlueLabelSx,
    isMobile,
    onEmailChange,
    onOrderCodeChange,
    onSearch,
    onReset,
}: GuestOrderFiltersProps) {
    if (isMobile) {
        return (
            <Box sx={{ mb: 2 }}>
                <Chip
                    label="Guest Order Tracking"
                    size="small"
                    sx={{
                        mb: 1.9,
                        height: 24,
                        fontSize: "0.62rem",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        bgcolor: "#1e5bb8",
                        color: "#fff",
                        fontWeight: 800,
                        "& .MuiChip-label": {
                            px: 0.9,
                        },
                    }}
                />

                <Stack direction="column" spacing={1.2}>
                    <TextField
                        size="small"
                        label="Email*"
                        value={emailFilter}
                        onChange={(e) => onEmailChange(e.target.value)}
                        sx={tfBlueLabelSx}
                        fullWidth
                    />

                    <TextField
                        size="small"
                        label="Order Number*"
                        value={orderCodeFilter}
                        onChange={(e) => onOrderCodeChange(e.target.value.replace(/\D/g, ""))}
                        inputProps={{ maxLength: 6, inputMode: "numeric" }}
                        sx={tfBlueLabelSx}
                        fullWidth
                    />

                    <Stack direction="row" spacing={1.2}>
                        <Button
                            variant="contained"
                            disabled={!canSearch || loading}
                            onClick={onSearch}
                            sx={{
                                flex: 1,
                                borderRadius: 1.5,
                                bgcolor: "#1e5bb8",
                                color: "#fff",
                                fontWeight: 900,
                                fontSize: "0.74rem",
                                textTransform: "uppercase",
                                letterSpacing: "0.10em",
                                height: 37,
                                "&.Mui-disabled": {
                                    bgcolor: "rgba(30, 91, 184, 0.35)",
                                    color: "rgba(255,255,255,0.85)",
                                },
                            }}
                        >
                            Search
                        </Button>

                        <Button
                            variant="contained"
                            onClick={onReset}
                            disabled={loading}
                            sx={{
                                flex: 1,
                                borderRadius: 1.5,
                                color: "#0d47a1",
                                bgcolor: "rgba(230, 81, 0, 0.20)",
                                fontWeight: 900,
                                textTransform: "uppercase",
                                letterSpacing: "0.10em",
                                fontSize: "0.74rem",
                                height: 37,
                                "&:hover": {
                                    bgcolor: "rgba(230, 81, 0, 0.28)",
                                    color: "#0d47a1",
                                },
                            }}
                        >
                            Reset
                        </Button>
                    </Stack>
                </Stack>
            </Box>
        );
    }

    return (
        <Box>
            <Chip
                label="GUEST ORDER TRACKING"
                size="small"
                sx={{
                    mb: 2,
                    mt: { sm: 0.8, md: 0 },
                    height: 22,
                    fontSize: "0.66rem",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    bgcolor: "#1e5bb8",
                    color: "#fff",
                    fontWeight: 800,
                    display: "inline-flex",
                    alignItems: "center",
                    "& .MuiChip-label": {
                        px: 0.9,
                    },
                }}
            />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2} alignItems="stretch">
                <TextField
                    size="small"
                    label="Email*"
                    value={emailFilter}
                    onChange={(e) => onEmailChange(e.target.value)}
                    sx={[
                        tfBlueLabelSx,
                        {
                            flex: 1.2,
                        },
                    ]}
                />

                <TextField
                    size="small"
                    label="Order Number*"
                    value={orderCodeFilter}
                    onChange={(e) => onOrderCodeChange(e.target.value.replace(/\D/g, ""))}
                    inputProps={{ maxLength: 6, inputMode: "numeric" }}
                    sx={[
                        tfBlueLabelSx,
                        {
                            flex: 0.8,
                        },
                    ]}
                />

                <Button
                    variant="contained"
                    disabled={!canSearch || loading}
                    onClick={onSearch}
                    sx={{
                        flex: { xs: "unset", sm: 0.6 },
                        width: { xs: "auto", sm: "auto" },
                        alignSelf: { xs: "flex-start", sm: "auto" },
                        minWidth: { xs: 88, sm: 110 },
                        borderRadius: 1.5,
                        bgcolor: "#1e5bb8",
                        color: "#fff",
                        fontWeight: 900,
                        textTransform: "uppercase",
                        letterSpacing: { xs: "0.06em", sm: "0.10em" },
                        height: { xs: 30, sm: 40 },
                        fontSize: { xs: "0.66rem", sm: "0.82rem" },
                        px: { xs: 1.2, sm: 1.6 },
                        WebkitTapHighlightColor: "transparent",

                        "@media (hover: hover) and (pointer: fine)": {
                            "&:hover": { bgcolor: "#164a96" },
                        },

                        "@media (hover: none) and (pointer: coarse)": {
                            "&:hover": { bgcolor: "#1e5bb8" },
                            "&:focus, &:focus-visible, &.Mui-focusVisible": {
                                bgcolor: "#1e5bb8",
                            },
                        },

                        "&.Mui-disabled": {
                            bgcolor: "rgba(30, 91, 184, 0.35)",
                            color: "rgba(255,255,255,0.85)",
                        },
                    }}
                >
                    Search
                </Button>

                <Button
                    variant="contained"
                    onClick={onReset}
                    disabled={loading}
                    sx={{
                        flex: { xs: "unset", sm: 0.6 },
                        display: { xs: "none", sm: "inline-flex" },
                        minWidth: { xs: 88, sm: 110 },
                        borderRadius: 1.5,
                        borderColor: "rgba(0,0,0,0.35)",
                        color: "#0d47a1",
                        bgcolor: "rgba(230, 81, 0, 0.20)",
                        fontWeight: 900,
                        textTransform: "uppercase",
                        letterSpacing: { xs: "0.06em", sm: "0.10em" },
                        height: { xs: 30, sm: 40 },
                        fontSize: { xs: "0.66rem", sm: "0.82rem" },
                        px: { xs: 1.2, sm: 1.6 },

                        "&:hover": {
                            bgcolor: "rgba(230, 81, 0, 0.28)",
                            borderColor: "#0d47a1",
                            color: "#0d47a1",
                        },
                        "&:active": {
                            bgcolor: "rgba(230, 81, 0, 0.28)",
                            transform: "translateY(1px)",
                        },
                    }}
                >
                    Reset
                </Button>
            </Stack>
        </Box>
    );
}