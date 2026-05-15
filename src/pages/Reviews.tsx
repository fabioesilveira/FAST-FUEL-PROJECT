import { useEffect, useState, type MouseEvent } from "react";
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
import { api } from "../api";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import StarIcon from "@mui/icons-material/Star";
import SearchIcon from "@mui/icons-material/Search";
import NavbarAction from "../components/layout/navbar/NavbarAction";
import Footer from "../components/layout/footer/Footer";
import ProductsTitleBar from "../components/TitleBar";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import ProductPreviewPopover from "../components/reviews/ProductPreviewPopover";

type Review = {
    id: number;
    product_id: number;
    product_name: string;
    product_image?: string;
    category: string;
    display_name: string;
    rating: number;
    comment: string | null;
    created_at: string;
};

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
    { label: "Burgers", value: "sandwiches" },
    { label: "Sides", value: "sides" },
    { label: "Drinks", value: "beverages" },
    { label: "Desserts", value: "desserts" },
];


function formatReviewDate(date: string) {
    return new Date(date).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
    });
}

function cleanProductName(name: string) {
    return String(name || "")
        .replace(/\/\s*\d+\s*kcal/i, "")
        .replace(/•\s*\d+\s*kcal/i, "")
        .trim();
}


export default function Reviews() {
    useDocumentTitle("FastFuel • Reviews");

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const hideActionButtons = useMediaQuery(theme.breakpoints.down("md"));

    const [search, setSearch] = useState("");

    const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLElement | null>(null);
    const [categoryAnchorEl, setCategoryAnchorEl] = useState<HTMLElement | null>(null);
    const [productAnchorEl, setProductAnchorEl] = useState<HTMLElement | null>(null);

    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(false);
    const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
    const [dateAnchorEl, setDateAnchorEl] = useState<HTMLElement | null>(null);

    const [previewAnchorEl, setPreviewAnchorEl] =
        useState<HTMLElement | null>(null);

    const [previewProduct, setPreviewProduct] =
        useState<Review | null>(null);

    const filterOpen = Boolean(filterAnchorEl && document.body.contains(filterAnchorEl));
    const categoryOpen = Boolean(categoryAnchorEl && document.body.contains(categoryAnchorEl));
    const productOpen = Boolean(productAnchorEl && document.body.contains(productAnchorEl));
    const dateOpen = Boolean(dateAnchorEl && document.body.contains(dateAnchorEl));

    function openFilterMenu(e: MouseEvent<HTMLElement>) {
        setFilterAnchorEl(e.currentTarget);
    }

    function closeAllMenus() {
        setFilterAnchorEl(null);
        setCategoryAnchorEl(null);
        setProductAnchorEl(null);
        setDateAnchorEl(null);
    }

    function handleClearFilters() {
        setSearch("");
        setSelectedCategory("all");
        setSelectedProductId(null);
        setSortOrder("newest");
        closeAllMenus();
    }

    function closeProductPreview() {
        setPreviewAnchorEl(null);
        setPreviewProduct(null);
    }

    useEffect(() => {
        async function fetchReviews() {
            setLoading(true);

            try {
                const res = await api.get("/reviews");
                setReviews(res.data?.reviews ?? []);
            } catch (err) {
                console.error("Failed to load reviews:", err);
                setReviews([]);
            } finally {
                setLoading(false);
            }
        }

        fetchReviews();
    }, []);

    const productOptions = Array.from(
        new Map(
            reviews.map((review) => [
                review.product_id,
                {
                    id: review.product_id,
                    name: review.product_name,
                    category: review.category,
                    image: review.product_image,
                },
            ])
        ).values()
    );

    const filteredReviews = reviews
        .filter((review) => {
            const matchesCategory =
                selectedCategory === "all" || review.category === selectedCategory;

            const matchesProduct =
                selectedProductId === null || review.product_id === selectedProductId;

            const q = search.trim().toLowerCase();

            const matchesSearch =
                !q ||
                review.product_name?.toLowerCase().includes(q) ||
                review.display_name?.toLowerCase().includes(q) ||
                review.comment?.toLowerCase().includes(q);

            return matchesCategory && matchesProduct && matchesSearch;
        })
        .sort((a, b) => {
            const da = new Date(a.created_at).getTime();
            const db = new Date(b.created_at).getTime();

            return sortOrder === "newest" ? db - da : da - db;
        });

    useEffect(() => {
        function handleResize() {
            closeAllMenus();
        }

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const filtersHeader = (
        <Box sx={{ mb: isMobile ? 2 : 0 }}>
            <Chip
                label="Customer Reviews"
                size="small"
                sx={{
                    mb: isMobile ? 1.9 : 2,
                    mt: isMobile ? 0 : { sm: 0.8, md: 0 },
                    height: isMobile ? 24 : 22,
                    fontSize: isMobile ? "0.62rem" : "0.66rem",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    bgcolor: "#1e5bb8",
                    color: "#fff",
                    fontWeight: 800,
                    "& .MuiChip-label": { px: 0.9 },
                }}
            />

            <Stack
                direction="row"
                spacing={1}
                alignItems="stretch"
                sx={{ width: "100%" }}
            >
                <Button
                    variant="outlined"
                    onClick={openFilterMenu}
                    endIcon={<ExpandMoreIcon />}
                    sx={{
                        width: isMobile ? 132 : 180,
                        flexShrink: 0,
                        borderRadius: 1.5,
                        bgcolor: "#f7e6db",
                        borderColor: "#e65100",
                        color: "#0d47a1",
                        fontWeight: 900,
                        textTransform: "uppercase",
                        letterSpacing: isMobile ? "0.035em" : "0.08em",
                        height: 40,
                        fontSize: "0.78rem",
                        justifyContent: "flex-start",
                        gap: isMobile ? 0.3 : 0.8,
                        whiteSpace: "nowrap",

                        pl: isMobile ? 1.6 : 1.4,
                        pr: isMobile ? 0.7 : 1.6,

                        "&:hover": {
                            bgcolor: "#f1ddcf",
                            borderColor: "#e65100",
                            color: "#0d47a1",
                        },

                        "& .MuiButton-endIcon": {
                            ...(isMobile
                                ? {
                                    marginLeft: "1px",
                                    marginRight: "auto",
                                }
                                : {
                                    marginLeft: "auto",
                                    marginRight: -1,
                                }),
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
                            "& .MuiInputBase-root": {
                                height: 40,
                            },
                        },
                    ]}
                    InputProps={{
                        endAdornment: hideActionButtons ? (
                            <SearchIcon sx={{ color: "#1e5bb8", fontSize: 21 }} />
                        ) : undefined,
                    }}
                />

                {!hideActionButtons && (
                    <>
                        <Button
                            variant="contained"
                            onClick={handleClearFilters}
                            sx={{
                                width: 130,
                                flexShrink: 0,
                                height: 40,
                                borderRadius: 1.5,

                                bgcolor: "#1e5bb8",
                                color: "#fff",
                                fontWeight: 900,
                                fontSize: "0.76rem",
                                letterSpacing: "0.08em",
                                textTransform: "uppercase",
                                whiteSpace: "nowrap",
                                "&:hover": {
                                    bgcolor: "#0f4698",
                                },
                            }}
                        >
                            Clear Filters
                        </Button>
                    </>
                )}
            </Stack>
        </Box>
    );

    const reviewsContent = (
        <Stack spacing={1.4}>
            {loading ? (
                <Typography sx={{ color: "text.secondary", textAlign: "center", pt: 17 }}>
                    Loading reviews...
                </Typography>
            ) : filteredReviews.length === 0 ? (
                <Typography sx={{ color: "text.secondary", textAlign: "center", pt: 17 }}>
                    No reviews found.
                </Typography>
            ) : (
                filteredReviews.map((review) => (
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
                                        onClick={(e) => {
                                            setPreviewAnchorEl(e.currentTarget);
                                            setPreviewProduct(review);
                                        }}
                                        sx={{
                                            fontSize: isMobile ? 18.5 : 18,
                                            fontWeight: 900,
                                            color: "#1e5bb8",
                                            cursor: "pointer",
                                            lineHeight: 1.1,
                                        }}
                                    >
                                        {cleanProductName(review.product_name)}
                                    </Typography>

                                    <Typography
                                        sx={{
                                            mt: 0.35,
                                            fontSize: "0.82rem",
                                            color: "rgba(0,0,0,0.62)",
                                            fontWeight: 700,
                                        }}
                                    >
                                        {review.display_name} • {formatReviewDate(review.created_at)}
                                    </Typography>
                                </Box>

                                <Stack direction="row" spacing={0.15} sx={{ flexShrink: 0 }}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <StarIcon
                                            key={star}
                                            sx={{
                                                fontSize: isMobile ? 19 : 20,
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
                                {review.comment || "No comment provided."}
                            </Typography>
                        </Stack>
                    </Paper>
                ))
            )}
        </Stack>
    );

    return (
        <>
            <NavbarAction />
            <ProductsTitleBar title="Reviews" />

            {isMobile ? (
                <Box
                    sx={{
                        minHeight: "100dvh",
                        display: "flex",
                        flexDirection: "column",
                        bgcolor: "#fff",
                    }}
                >
                    <Box
                        component="main"
                        sx={{
                            width: "100%",
                            maxWidth: 490,
                            mx: "auto",
                            px: 2.5,
                            pt: "150px",
                            pb: "32px",
                            flex: 1,
                        }}
                    >
                        {filtersHeader}

                        <Divider sx={{ borderColor: "rgba(0, 0, 0, 0.45)", mb: 2 }} />

                        {reviewsContent}
                    </Box>

                    <Footer />
                </Box>
            ) : (
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
                                {filtersHeader}

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
                                    {reviewsContent}
                                </Box>
                            </Paper>
                        </Box>
                    </Box>

                    <Footer />
                </Box>
            )}

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

                <MenuItem onClick={(e) => setDateAnchorEl(e.currentTarget)}>
                    <ListItemText primary="Date" />
                    <ExpandMoreIcon sx={{ transform: "rotate(-90deg)", fontSize: 19 }} />
                </MenuItem>

                {isMobile && (
                    <>
                        <Divider sx={{ my: 0.6 }} />

                        <MenuItem onClick={handleClearFilters}>
                            <ListItemText primary="Clear Filters" />
                        </MenuItem>
                    </>
                )}
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
                            setSelectedCategory(cat.value);
                            setSelectedProductId(null);
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
                {productOptions.map((product) => (
                    <MenuItem
                        key={product.id}
                        onClick={() => {
                            setSelectedProductId(product.id);
                            setSelectedCategory("all");
                            closeAllMenus();
                        }}
                    >
                        {cleanProductName(product.name)}
                    </MenuItem>
                ))}
            </Menu>

            <Menu
                anchorEl={dateAnchorEl}
                open={dateOpen}
                onClose={() => setDateAnchorEl(null)}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
            >
                <MenuItem
                    onClick={() => {
                        setSortOrder("newest");
                        closeAllMenus();
                    }}
                >
                    Newest
                </MenuItem>

                <MenuItem
                    onClick={() => {
                        setSortOrder("oldest");
                        closeAllMenus();
                    }}
                >
                    Oldest
                </MenuItem>
            </Menu>

            <ProductPreviewPopover
                anchorEl={previewAnchorEl}
                product={previewProduct}
                onClose={closeProductPreview}
            />
        </>
    );
}