import { useState, type MouseEvent } from "react";
import {
    Box,
    Paper,
    Typography,
    Button,
    Stack,
    Chip,
    Divider,
    TextField,
    Menu,
    MenuItem,
    ListItemText,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import StarIcon from "@mui/icons-material/Star";
import SearchIcon from "@mui/icons-material/Search";
import NavbarAction from "../components/layout/navbar/NavbarAction";
import Footer from "../components/layout/footer/Footer";
import ProductsTitleBar from "../components/TitleBar";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

const tfBlueLabelSx = {
    "& label": { color: "#0d47a1" },
    "& label.Mui-focused": { color: "#0d47a1" },
    "& .MuiInputLabel-root.MuiInputLabel-shrink": {
        backgroundColor: "background.paper",
        padding: "0 6px",
        borderRadius: "8px",
        lineHeight: 1.2,
        zIndex: 1,
    },
    "& .MuiOutlinedInput-root": {
        "& fieldset": { borderColor: "#0d47a1" },
        "&:hover fieldset": { borderColor: "#123b7a" },
        "&.Mui-focused fieldset": { borderColor: "#0d47a1", borderWidth: 2 },
    },
};

const categories = [
    {
        label: "Burgers",
        products: ["Classic Burger", "Double Burger", "Cheese Burger"],
    },
    {
        label: "Sides",
        products: ["Fries", "Onion Rings", "Chicken Nuggets"],
    },
    {
        label: "Drinks",
        products: ["Coke", "Sprite", "Iced Tea"],
    },
    {
        label: "Desserts",
        products: ["Milkshake", "Brownie", "Ice Cream"],
    },
];

const mockReviews = [
    {
        id: 1,
        customer: "Guest",
        product: "Classic Burger",
        rating: 5,
        comment: "Great flavor, fast delivery, and the burger was fresh.",
        date: "May 2026",
    },
    {
        id: 2,
        customer: "Customer",
        product: "Fries",
        rating: 4,
        comment: "Crispy and tasty. I would order again.",
        date: "May 2026",
    },
];

export default function Reviews() {
    useDocumentTitle("FastFuel • Reviews");

    const [search, setSearch] = useState("");

    const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLElement | null>(null);
    const [categoryAnchorEl, setCategoryAnchorEl] = useState<HTMLElement | null>(null);
    const [productAnchorEl, setProductAnchorEl] = useState<HTMLElement | null>(null);

    const [selectedCategory, setSelectedCategory] = useState<string>("All Categories");
    // const [selectedProduct, setSelectedProduct] = useState<string>("All Products");

    const filterOpen = Boolean(filterAnchorEl);
    const categoryOpen = Boolean(categoryAnchorEl);
    const productOpen = Boolean(productAnchorEl);

    const selectedCategoryData = categories.find((c) => c.label === selectedCategory);

    function openFilterMenu(e: MouseEvent<HTMLElement>) {
        setFilterAnchorEl(e.currentTarget);
    }

    function closeAllMenus() {
        setFilterAnchorEl(null);
        setCategoryAnchorEl(null);
        setProductAnchorEl(null);
    }

    return (
        <>
            <NavbarAction />
            <ProductsTitleBar title="Reviews" />

            <Box sx={{ minHeight: "100svh", display: "flex", flexDirection: "column" }}>
                <Box
                    sx={{
                        position: "relative",
                        flexGrow: 1,
                        width: "100%",
                        bgcolor: "#fff",
                        borderTop: "3px solid #e65100",
                        boxShadow: "0px 4px 10px rgba(0,0,0,0.10)",

                        "&::before": {
                            content: '""',
                            display: "block",
                            position: "absolute",
                            top: 0,
                            bottom: 0,
                            left: "50%",
                            transform: "translateX(-50%)",
                            zIndex: 0,
                            width: {
                                xs: "min(100vw, 1040px)",
                                sm: "min(96vw, 1040px)",
                                md: 1300,
                            },
                            borderRadius: 20,
                            pointerEvents: "none",
                            backgroundImage: {
                                xs: `
                                    linear-gradient(90deg,
                                    rgba(255,255,255,1) 0%,
                                    rgba(255,255,255,0.0) 18%,
                                    rgba(255,255,255,0.0) 82%,
                                    rgba(255,255,255,1) 100%
                                    ),
                                    repeating-linear-gradient(135deg,
                                    rgba(13,71,161,0.012) 0px,
                                    rgba(13,71,161,0.012) 10px,
                                    rgba(230,81,0,0.010) 10px,
                                    rgba(230,81,0,0.010) 20px
                                    )
                                `,
                                sm: `
                                    linear-gradient(90deg,
                                    rgba(255,255,255,1) 0%,
                                    rgba(255,255,255,0.0) 16%,
                                    rgba(255,255,255,0.0) 84%,
                                    rgba(255,255,255,1) 100%
                                    ),
                                    repeating-linear-gradient(135deg,
                                    rgba(13,71,161,0.020) 0px,
                                    rgba(13,71,161,0.020) 10px,
                                    rgba(230,81,0,0.015) 10px,
                                    rgba(230,81,0,0.015) 20px
                                    )
                                `,
                                md: `
                                    linear-gradient(90deg,
                                    rgba(255,255,255,1) 0%,
                                    rgba(255,255,255,0.0) 16%,
                                    rgba(255,255,255,0.0) 84%,
                                    rgba(255,255,255,1) 100%
                                    ),
                                    repeating-linear-gradient(135deg,
                                    rgba(13,71,161,0.022) 0px,
                                    rgba(13,71,161,0.022) 10px,
                                    rgba(230,81,0,0.016) 10px,
                                    rgba(230,81,0,0.016) 20px
                                    )
                                `,
                            },
                            backgroundRepeat: "no-repeat, repeat",
                            backgroundSize: "100% 100%, auto",
                        },

                        "& > *": { position: "relative", zIndex: 1 },
                    }}
                >
                    <Box
                        component="main"
                        sx={{
                            flexGrow: 1,
                            display: "flex",
                            justifyContent: "center",
                            px: 2,
                            pt: { xs: "110px", md: "140px" },
                            pb: { xs: 1, md: 6 },
                            minHeight: 0,
                        }}
                    >
                        <Paper
                            elevation={0}
                            sx={{
                                width: "100%",
                                maxWidth: { xs: 520, md: 980 },
                                borderRadius: 3,
                                border: "1px solid rgba(13, 71, 161, 0.15)",
                                boxShadow:
                                    "0 4px 12px rgba(13, 71, 161, 0.12), 0 10px 24px rgba(13, 71, 161, 0.08)",
                                bgcolor: "background.paper",
                                p: { xs: 2.5, md: 4 },
                                height: { xs: "calc(100svh - 200px)", md: "calc(100vh - 240px)" },
                                maxHeight: 660,
                                mt: { sm: 5, md: 2 },
                                mb: { md: 1 },
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                                overflow: "hidden",
                            }}
                        >
                            <Box>
                                <Chip
                                    label="Customer Reviews"
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
                                        "& .MuiChip-label": { px: 0.9 },
                                    }}
                                />

                                <Stack
                                    direction={{ xs: "column", sm: "row" }}
                                    spacing={1.2}
                                    alignItems="stretch"
                                    sx={{ width: "100%" }}
                                >
                                    <Button
                                        variant="outlined"
                                        onClick={openFilterMenu}
                                        endIcon={<ExpandMoreIcon />}
                                        sx={{
                                            width: { xs: "100%", sm: 180 },
                                            flexShrink: 0,
                                            borderRadius: 1,

                                            bgcolor: "#f8efe4",
                                            borderColor: "rgba(230, 81, 0, 0.30)",
                                            color: "#0d47a1",

                                            fontWeight: 900,
                                            textTransform: "uppercase",
                                            letterSpacing: "0.08em",
                                            height: 40,
                                            fontSize: "0.78rem",
                                            justifyContent: "space-between",

                                            "&:hover": {
                                                bgcolor: "#f1e4d5",
                                                borderColor: "#e65100",
                                            },
                                        }}
                                    >
                                        Sort & Filter
                                    </Button>

                                    <TextField
                                        size="small"
                                        label="Search Reviews"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        sx={[
                                            tfBlueLabelSx,
                                            {
                                                flex: 1,
                                                minWidth: 0,
                                            },
                                        ]}

                                    />

                                    <Button
                                        variant="contained"
                                        sx={{
                                            width: { xs: "100%", sm: 130 },
                                            flexShrink: 0,
                                            height: 40,
                                            borderRadius: 1.5,
                                            bgcolor: "#1e5bb8",
                                            color: "#fff",
                                            fontWeight: 900,
                                            fontSize: "0.76rem",
                                            letterSpacing: "0.08em",
                                            textTransform: "uppercase",
                                            "&:hover": {
                                                bgcolor: "#123b7a",
                                            },
                                        }}
                                    >
                                        Search
                                    </Button>

                                    <Button
                                        variant="contained"
                                        onClick={() => {
                                            setSearch("");
                                            setSelectedCategory("All Categories");
                                            closeAllMenus();
                                        }}
                                        sx={{
                                            width: { xs: "100%", sm: 130 },
                                            flexShrink: 0,
                                            height: 40,
                                            borderRadius: 1.5,
                                            bgcolor: "rgba(230, 81, 0, 0.20)",
                                            color: "#0d47a1",
                                            fontWeight: 900,
                                            fontSize: "0.76rem",
                                            letterSpacing: "0.08em",
                                            textTransform: "uppercase",
                                            whiteSpace: "nowrap",
                                            "&:hover": {
                                                bgcolor: "rgba(230, 81, 0, 0.28)",
                                                color: "#0d47a1",
                                            },
                                        }}
                                    >
                                        Clear Filters
                                    </Button>
                                </Stack>
                            </Box>

                            <Divider sx={{ borderColor: "rgba(0, 0, 0, 0.45)" }} />

                            <Box
                                sx={{
                                    flex: 1,
                                    overflowY: "auto",
                                    pr: 0.5,
                                    display: "flex",
                                    flexDirection: "column",
                                    minHeight: 0,
                                }}
                            >
                                <Stack spacing={1.4}>
                                    {mockReviews.map((review) => (
                                        <Paper
                                            key={review.id}
                                            elevation={0}
                                            sx={{
                                                p: 2,
                                                borderRadius: 2,
                                                border: "1px solid rgba(230, 81, 0, 0.28)",
                                                bgcolor: "#fff4e1",
                                            }}
                                        >
                                            <Stack spacing={0.8}>
                                                <Stack
                                                    direction="row"
                                                    alignItems="center"
                                                    justifyContent="space-between"
                                                    gap={1}
                                                >
                                                    <Box>
                                                        <Typography
                                                            sx={{
                                                                fontSize: 18,
                                                                fontWeight: 900,
                                                                color: "#1e5bb8",
                                                                lineHeight: 1.1,
                                                            }}
                                                        >
                                                            {review.product}
                                                        </Typography>

                                                        <Typography
                                                            sx={{
                                                                mt: 0.35,
                                                                fontSize: "0.82rem",
                                                                color: "rgba(0,0,0,0.62)",
                                                                fontWeight: 700,
                                                            }}
                                                        >
                                                            {review.customer} • {review.date}
                                                        </Typography>
                                                    </Box>

                                                    <Stack direction="row" spacing={0.15}>
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <StarIcon
                                                                key={star}
                                                                sx={{
                                                                    fontSize: 20,
                                                                    color:
                                                                        star <= review.rating
                                                                            ? "#e65100"
                                                                            : "rgba(0,0,0,0.18)",
                                                                }}
                                                            />
                                                        ))}
                                                    </Stack>
                                                </Stack>

                                                <Typography
                                                    sx={{
                                                        fontSize: "0.92rem",
                                                        lineHeight: 1.45,
                                                        color: "#333",
                                                    }}
                                                >
                                                    {review.comment}
                                                </Typography>
                                            </Stack>
                                        </Paper>
                                    ))}
                                </Stack>
                            </Box>
                        </Paper>
                    </Box>
                </Box>

                <Footer />
            </Box>

            <Menu
                anchorEl={filterAnchorEl}
                open={filterOpen}
                onClose={closeAllMenus}
                PaperProps={{
                    sx: {
                        mt: 0.8,
                        borderRadius: 2,
                        minWidth: 210,
                        border: "1px solid rgba(0,0,0,0.12)",
                        boxShadow: "0 8px 22px rgba(0,0,0,0.12)",
                        px: 0.5,
                        py: 0.6,
                    },
                }}
            >
                <MenuItem onClick={(e) => setCategoryAnchorEl(e.currentTarget)}>
                    <ListItemText primary="Categories" />
                    <ExpandMoreIcon sx={{ transform: "rotate(-90deg)", fontSize: 19 }} />
                </MenuItem>

                <MenuItem onClick={(e) => setProductAnchorEl(e.currentTarget)}>
                    <ListItemText primary="Products" />
                    <ExpandMoreIcon sx={{ transform: "rotate(-90deg)", fontSize: 19 }} />
                </MenuItem>

                <Divider sx={{ my: 0.6 }} />

                <MenuItem
                    onClick={() => {
                        setSelectedCategory("All Categories");
                        // setSelectedProduct("All Products");
                        closeAllMenus();
                    }}
                >
                    <ListItemText primary="Clear Filters" />
                </MenuItem>
            </Menu>

            <Menu
                anchorEl={categoryAnchorEl}
                open={categoryOpen}
                onClose={() => setCategoryAnchorEl(null)}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
            >
                {categories.map((cat) => (
                    <MenuItem
                        key={cat.label}
                        onClick={() => {
                            setSelectedCategory(cat.label);
                            // setSelectedProduct("All Products");
                            closeAllMenus();
                        }}
                    >
                        {cat.label}
                    </MenuItem>
                ))}
            </Menu>

            <Menu
                anchorEl={productAnchorEl}
                open={productOpen}
                onClose={() => setProductAnchorEl(null)}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
            >
                {(selectedCategoryData?.products ?? categories.flatMap((c) => c.products)).map(
                    (product) => (
                        <MenuItem
                            key={product}
                            onClick={() => {
                                // setSelectedProduct(product);
                                closeAllMenus();
                            }}
                        >
                            {product}
                        </MenuItem>
                    )
                )}
            </Menu>
        </>
    );
}