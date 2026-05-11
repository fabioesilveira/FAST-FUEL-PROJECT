import { Box, Popover, Stack, Typography } from "@mui/material";

type PreviewProduct = {
    product_name: string;
    product_image?: string;
    category: string;
};

type ProductPreviewPopoverProps = {
    anchorEl: HTMLElement | null;
    product: PreviewProduct | null;
    onClose: () => void;
};

function formatCategory(category: string) {
    switch (String(category).toLowerCase()) {
        case "sandwiches":
            return "Burgers";

        case "beverages":
            return "Drinks";

        case "sides":
            return "Sides";

        case "desserts":
            return "Desserts";

        default:
            return category;
    }
}

export default function ProductPreviewPopover({
    anchorEl,
    product,
    onClose,
}: ProductPreviewPopoverProps) {
    const open = Boolean(anchorEl && product);

    return (
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
            }}
            transformOrigin={{
                vertical: "top",
                horizontal: "left",
            }}
            PaperProps={{
                sx: {
                    mt: 1,
                    p: 1.4,
                    width: 230,
                    borderRadius: 2,
                    bgcolor: "#fffaf2",
                    border: "1px solid rgba(230,81,0,0.24)",
                    boxShadow: "0 10px 24px rgba(0,0,0,0.16)",
                },
            }}
        >
            {product && (
                <Stack direction="row" spacing={1.2} alignItems="center">
                    <Box
                        component="img"
                        src={product.product_image}
                        alt={product.product_name}
                        sx={{
                            width: 68,
                            height: 68,
                            objectFit: "contain",
                            borderRadius: 1.5,
                            bgcolor: "#fff",
                            border: "1px solid rgba(230,81,0,0.25)",
                            p: 0.6,
                            flexShrink: 0,
                        }}
                    />

                    <Box sx={{ minWidth: 0 }}>
                        <Typography
                            sx={{
                                fontWeight: 900,
                                color: "#0d47a1",
                                fontSize: "0.9rem",
                                lineHeight: 1.15,
                            }}
                        >
                            {product.product_name}
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.45,
                                fontSize: "0.72rem",
                                fontWeight: 900,
                                letterSpacing: "0.06em",
                                textTransform: "uppercase",
                                color: "#e65100",
                            }}
                        >
                            {formatCategory(product.category)}
                        </Typography>
                    </Box>
                </Stack>
            )}
        </Popover>
    );
}