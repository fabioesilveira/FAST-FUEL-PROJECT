import { Box, Popover, Stack, Typography } from "@mui/material";

type PreviewProduct = {
    product_id: number;
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

const imageStylesOrder: Record<string, React.CSSProperties> = {
    "1": { width: "60px", height: "52px", marginTop: "3px" },
    "2": { width: "90px", height: "75px" },
    "3": { width: "65px", height: "55px" },
    "4": { width: "85px", height: "65px", marginTop: "-2px" },
    "11": { width: "70px", height: "73px" },
    "12": { width: "82px", height: "67px" },
    "13": { width: "75px", height: "65px", marginTop: "4px" },
    "14": { width: "65px", height: "70px" },
    "5": { width: "77px", height: "77px" },
    "6": { width: "77px", height: "77px" },
    "7": { width: "77px", height: "77px" },
    "8": { width: "77px", height: "77px" },
    "9": { width: "77px", height: "77px" },
    "10": { width: "77px", height: "77px" },
    "15": { width: "200px", height: "81px" },
    "16": { width: "82px", height: "75px" },
    "17": { width: "75px", height: "79px" },
    "18": { width: "60px", height: "51px" },
};

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
                        sx={{
                            width: 72,
                            height: 72,
                            flexShrink: 0,
                            borderRadius: 1.5,
                            bgcolor: "#fff",
                            border: "1px solid rgba(230,81,0,0.25)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden",
                            p: 0.6,
                        }}
                    >
                        <Box
                            component="img"
                            src={product.product_image}
                            alt={product.product_name}
                            style={
                                imageStylesOrder[String(product.product_id)] ?? {
                                    width: "68px",
                                    height: "68px",
                                }
                            }
                            sx={{
                                objectFit: "contain",
                                display: "block",
                            }}
                        />
                    </Box>

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