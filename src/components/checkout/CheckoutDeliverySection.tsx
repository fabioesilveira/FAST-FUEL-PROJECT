import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import AddressLookup from "../AddressLookup";

type AddressState = {
    street: string;
    city: string;
    apt: string;
    state: string;
    zip: string;
    country: string;
};

type AddressLookupResult = {
    street: string;
    city: string;
    state: string;
    zip: string;
};

type CheckoutDeliverySectionProps = {
    address: AddressState;
    streetText: string;
    tfBlueLabelSx: any;
    mobile?: boolean;
    onStreetTextChange: (value: string) => void;
    onAddressChange: (updater: (prev: AddressState) => AddressState) => void;
};

export default function CheckoutDeliverySection({
    address,
    streetText,
    tfBlueLabelSx,
    mobile = false,
    onStreetTextChange,
    onAddressChange,
}: CheckoutDeliverySectionProps) {
    const rowSpacing = mobile ? 1.2 : 1.6;
    const wrapperMargin = mobile ? 3.2 : 3;

    return (
        <Box sx={{ mb: wrapperMargin }}>
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
                        mt: 0.9,
                    },
                }}
            >
                Delivery
            </Typography>

            <Stack spacing={1.6}>
                <AddressLookup
                    sx={tfBlueLabelSx}
                    requireZip5
                    inputValue={streetText}
                    onInputChange={(v) => {
                        onStreetTextChange(v);

                        onAddressChange((prev) => ({
                            ...prev,
                            street: v,
                        }));

                        if (!v.trim()) {
                            onAddressChange((prev) => ({
                                ...prev,
                                street: "",
                                city: "",
                                apt: "",
                                state: "",
                                zip: "",
                                country: "USA",
                            }));
                        }
                    }}
                    onSelect={(addr: AddressLookupResult) => {
                        onStreetTextChange(addr.street);

                        onAddressChange((prev) => ({
                            ...prev,
                            street: addr.street,
                            city: addr.city,
                            state: addr.state,
                            zip: addr.zip,
                            country: "USA",
                        }));
                    }}
                />

                {mobile ? (
                    <>
                        <TextField
                            size="small"
                            label="City*"
                            fullWidth
                            variant="outlined"
                            value={address.city}
                            onChange={(e) =>
                                onAddressChange((prev) => ({ ...prev, city: e.target.value }))
                            }
                            sx={tfBlueLabelSx}
                        />

                        <TextField
                            size="small"
                            label="Apt / Suite"
                            fullWidth
                            variant="outlined"
                            value={address.apt}
                            onChange={(e) =>
                                onAddressChange((prev) => ({ ...prev, apt: e.target.value }))
                            }
                            sx={tfBlueLabelSx}
                        />

                        <Stack direction="row" spacing={rowSpacing}>
                            <TextField
                                size="small"
                                label="State*"
                                variant="outlined"
                                value={address.state}
                                onChange={(e) =>
                                    onAddressChange((prev) => ({ ...prev, state: e.target.value }))
                                }
                                sx={[tfBlueLabelSx, { flex: 1 }]}
                            />

                            <TextField
                                size="small"
                                label="Zipcode*"
                                variant="outlined"
                                value={address.zip}
                                onChange={(e) =>
                                    onAddressChange((prev) => ({ ...prev, zip: e.target.value }))
                                }
                                sx={[tfBlueLabelSx, { flex: 1 }]}
                            />
                        </Stack>

                        <TextField
                            size="small"
                            label="Country*"
                            placeholder="USA"
                            variant="outlined"
                            value={address.country}
                            onChange={(e) =>
                                onAddressChange((prev) => ({
                                    ...prev,
                                    country: e.target.value,
                                }))
                            }
                            sx={tfBlueLabelSx}
                        />
                    </>
                ) : (
                    <>
                        <Stack direction="row" spacing={rowSpacing}>
                            <TextField
                                size="small"
                                label="City*"
                                fullWidth
                                variant="outlined"
                                value={address.city}
                                onChange={(e) =>
                                    onAddressChange((prev) => ({ ...prev, city: e.target.value }))
                                }
                                sx={[tfBlueLabelSx, { flex: 6 }]}
                            />

                            <TextField
                                size="small"
                                label="Apt / Suite"
                                variant="outlined"
                                value={address.apt}
                                onChange={(e) =>
                                    onAddressChange((prev) => ({ ...prev, apt: e.target.value }))
                                }
                                sx={[tfBlueLabelSx, { flex: 4 }]}
                            />
                        </Stack>

                        <Stack direction="row" spacing={rowSpacing}>
                            <TextField
                                size="small"
                                label="State*"
                                variant="outlined"
                                value={address.state}
                                onChange={(e) =>
                                    onAddressChange((prev) => ({ ...prev, state: e.target.value }))
                                }
                                sx={[tfBlueLabelSx, { flex: 4.5 }]}
                            />

                            <TextField
                                size="small"
                                label="Zipcode*"
                                variant="outlined"
                                value={address.zip}
                                onChange={(e) =>
                                    onAddressChange((prev) => ({ ...prev, zip: e.target.value }))
                                }
                                sx={[tfBlueLabelSx, { flex: 3 }]}
                            />

                            <TextField
                                size="small"
                                label="Country*"
                                placeholder="USA"
                                variant="outlined"
                                value={address.country}
                                onChange={(e) =>
                                    onAddressChange((prev) => ({
                                        ...prev,
                                        country: e.target.value,
                                    }))
                                }
                                sx={[tfBlueLabelSx, { flex: 2.5 }]}
                            />
                        </Stack>
                    </>
                )}

                <Typography
                    align="center"
                    sx={{ mt: mobile ? 0.3 : 0.6, fontSize: "0.75rem", color: "text.secondary" }}
                >
                    Start typing and select an address from the suggestions.
                </Typography>
            </Stack>
        </Box>
    );
}