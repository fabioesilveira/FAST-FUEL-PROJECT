import * as React from "react";
import { api } from "../../api";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Rating from "@mui/material/Rating";
import LinearProgress from "@mui/material/LinearProgress";
import CircularProgress from "@mui/material/CircularProgress";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import GridViewIcon from "@mui/icons-material/GridView";
import ViewStreamIcon from "@mui/icons-material/ViewStream";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import type { Meal } from "../../context/context";
import ProductCard from "./ProductCard";
import ProductCardDesktopLandscape from "./ProductCardDesktopLandscape";

type CategoryInsightProduct = {
    id: number | string;
    name: string;
    image: string | null;
    category: string;
    average_rating: number;
    total_reviews: number;
    total_sold: number;
    sales_percentage: number;
};

type CategoryInsightReview = {
    id: number;
    product_id: number;
    product_name: string;
    product_image: string | null;
    display_name: string | null;
    rating: number;
    comment: string | null;
    created_at: string;
};

type CategoryInsights = {
    category: string;
    products: CategoryInsightProduct[];
    random_reviews: CategoryInsightReview[];
};

type ProductsGridProps = {
    data: Meal[];
    order: Meal[];
    onAdd: (p: Meal) => void;
    onRemove: (p: Meal) => void;
    imageStylesGridMobile: Record<string, React.CSSProperties>;
    imageStylesStreamMobile: Record<string, React.CSSProperties>;
    imageStylesDesktop: Record<string, React.CSSProperties>;
    imageStylesDesktopWide: Record<string, React.CSSProperties>;
    imageMap?: Record<string, string>;
    category?: string;
    categoryTitle?: string;
};

export default function ProductsGrid({
    data,
    order,
    onAdd,
    onRemove,
    imageStylesGridMobile,
    imageStylesStreamMobile,
    imageStylesDesktop,
    imageStylesDesktopWide,
    imageMap,
    category,
    categoryTitle = "Products",
}: ProductsGridProps) {
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isTabletOnly = useMediaQuery(theme.breakpoints.between("sm", "lg"));

    const [viewMode, setViewMode] = React.useState<"grid" | "stream">("grid");
    const [insightsOpen, setInsightsOpen] = React.useState(false);
    const [insightsLoading, setInsightsLoading] = React.useState(false);
    const [insights, setInsights] = React.useState<CategoryInsights | null>(null);

    async function openInsightsDrawer() {
        setInsightsOpen(true);

        if (!category || insights || insightsLoading) return;

        try {
            setInsightsLoading(true);
            const res = await api.get<CategoryInsights>(
                `/products/category/${category}/insights`
            );
            setInsights(res.data);
        } catch (e) {
            console.error(e);
        } finally {
            setInsightsLoading(false);
        }
    }

    if (isDesktop) {
        return (
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 560px)",
                    justifyContent: "center",
                    columnGap: 4,
                    rowGap: 4,
                    mt: 4,
                    mb: 10,
                    px: 2,
                    mx: "auto",
                    maxWidth: 1120,
                }}
            >
                {data.map((product, index) => (
                    <ProductCardDesktopLandscape
                        key={product.id}
                        product={product}
                        onAdd={onAdd}
                        onRemove={onRemove}
                        imgStyle={imageStylesDesktopWide[product.id]}
                        flip={index % 2 === 0}
                        qty={order.find((p) => p.id === product.id)?.quantidade ?? 0}
                        imageMap={imageMap}
                    />
                ))}
            </Box>
        );
    }

    return (
        <Box
            sx={{
                width: "100%",
                maxWidth: { xs: 490, sm: 680 },
                px: { xs: 1, sm: 2 },
                mx: "auto",
                mt: 4,
                mb: 2,
            }}
        >
            {isMobile && (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 1.4,
                    }}
                >
                    <Button
                        onClick={openInsightsDrawer}
                        startIcon={<InfoOutlinedIcon />}
                        sx={{
                            mt: 0.35,
                            height: 34,
                            borderRadius: "10px",
                            bgcolor: "white",
                            border: "1px solid rgba(230,81,0,0.20)",
                            boxShadow: "0 6px 16px rgba(13,71,161,0.10)",
                            color: "#0d47a1",
                            fontWeight: 900,
                            fontSize: "0.68rem",
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            px: 1.15,
                            "&:hover": {
                                bgcolor: "#fff4e1",
                            },
                            "& .MuiButton-startIcon": {
                                mr: 0.45,
                            },
                        }}
                    >
                        Insights
                    </Button>

                    <Box
                        sx={{
                            display: "inline-flex",
                            flexDirection: "column",
                            alignItems: "stretch",
                            bgcolor: "white",
                            border: "1px solid rgba(230,81,0,0.20)",
                            boxShadow: "0 6px 16px rgba(13,71,161,0.10)",
                            px: 0.35,
                            pt: 0.35,
                            pb: 0.25,
                            mb: 2.6,
                            minWidth: 92,
                            borderRadius: "10px",
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 0.2,
                            }}
                        >
                            <IconButton
                                onClick={() => setViewMode("stream")}
                                sx={{
                                    width: 34,
                                    height: 34,
                                    color:
                                        viewMode === "stream"
                                            ? "#0d47a1"
                                            : "rgba(13,71,161,0.35)",
                                }}
                                aria-label="Stream view"
                            >
                                <ViewStreamIcon />
                            </IconButton>

                            <IconButton
                                onClick={() => setViewMode("grid")}
                                sx={{
                                    width: 34,
                                    height: 34,
                                    color:
                                        viewMode === "grid"
                                            ? "#0d47a1"
                                            : "rgba(13,71,161,0.35)",
                                }}
                                aria-label="Grid view"
                            >
                                <GridViewIcon />
                            </IconButton>
                        </Box>

                        <Box
                            sx={{
                                position: "relative",
                                mt: 0,
                                height: 3,
                                borderRadius: "999px",
                                bgcolor: "rgba(13,71,161,0.12)",
                                overflow: "hidden",
                            }}
                        >
                            <Box
                                sx={{
                                    position: "absolute",
                                    top: 0,
                                    bottom: 0,
                                    left: viewMode === "stream" ? "8%" : "52%",
                                    width: "40%",
                                    borderRadius: "999px",
                                    bgcolor: "#e65100",
                                    transition: "left 0.22s ease",
                                }}
                            />
                        </Box>
                    </Box>
                </Box>
            )}

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: viewMode === "grid" ? "repeat(2, 1fr)" : "1fr",
                        sm: "repeat(2, 300px)",
                    },
                    justifyContent: "center",
                    justifyItems: "stretch",
                    columnGap: { xs: viewMode === "grid" ? 1.2 : 0, sm: 3 },
                    rowGap: { xs: viewMode === "grid" ? 5 : 4.5, sm: 3 },
                }}
            >
                {data.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onAdd={onAdd}
                        onRemove={onRemove}
                        isMobile={isMobile}
                        isTabletOnly={isTabletOnly}
                        imgStyle={
                            isMobile
                                ? viewMode === "stream"
                                    ? imageStylesStreamMobile[product.id]
                                    : imageStylesGridMobile[product.id]
                                : imageStylesDesktop[product.id]
                        }
                        qty={order.find((p) => p.id === product.id)?.quantidade ?? 0}
                        imageMap={imageMap}
                        viewMode={viewMode}
                    />
                ))}
            </Box>

            <Drawer
                anchor="left"
                open={insightsOpen}
                onClose={() => setInsightsOpen(false)}
                PaperProps={{
                    sx: {
                        width: "90vw",
                        maxWidth: 430,
                        borderTopRightRadius: 18,
                        borderBottomRightRadius: 18,
                        bgcolor: "#fffaf4",
                        overflow: "hidden",
                    },
                }}
            >
                <Box
                    sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Box
                        sx={{
                            px: 2,
                            pt: 2.2,
                            pb: 1.4,
                            borderBottom: "1px solid rgba(230,81,0,0.18)",
                            bgcolor: "#fff",
                        }}
                    >
                        <Box>
                            <Typography
                                sx={{
                                    fontSize: "1.42rem",
                                    fontWeight: 950,
                                    color: "#0d47a1",
                                    lineHeight: 1.1,
                                }}
                            >
                                {categoryTitle}{" "}

                                <Box
                                    component="span"
                                    sx={{
                                        color: "#0d47a1",
                                    }}
                                >
                                    Insights
                                </Box>
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 0.46,
                                    ml: 0.2,
                                    fontSize: "0.75rem",
                                    color: "rgba(0,0,0,0.52)",
                                    lineHeight: 1.2,
                                    fontWeight: 700,
                                    letterSpacing: "0.02em",
                                }}
                            >
                                Ratings, reviews & popularity.
                            </Typography>
                        </Box>
                    </Box>

                    <Box
                        sx={{
                            flex: 1,
                            overflowY: "auto",
                            px: 2,
                            py: 1.7,
                            pb: "calc(24px + env(safe-area-inset-bottom))",
                        }}
                    >
                        {insightsLoading ? (
                            <Box
                                sx={{
                                    height: 280,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <CircularProgress size={28} />
                            </Box>
                        ) : !insights ? (
                            <Typography sx={{ color: "text.secondary" }}>
                                No insights available yet.
                            </Typography>
                        ) : (
                            <Stack spacing={2.1}>
                                <Box>
                                    <Typography
                                        sx={{
                                            fontSize: "0.72rem",
                                            fontWeight: 900,
                                            letterSpacing: "0.12em",
                                            color: "rgba(0,0,0,0.55)",
                                            textTransform: "uppercase",
                                            mb: 1,
                                        }}
                                    >
                                        Product ratings
                                    </Typography>

                                    <Stack spacing={1.15}>
                                        {insights.products.map((p) => (
                                            <Box
                                                key={p.id}
                                                sx={{
                                                    p: 1.15,
                                                    borderRadius: 2,
                                                    bgcolor: "#fff",
                                                    border: "1px solid rgba(13,71,161,0.10)",
                                                    boxShadow: "0 5px 12px rgba(13,71,161,0.06)",
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        fontSize: "0.95rem",
                                                        fontWeight: 900,
                                                        color: "#1e5bb8",
                                                        lineHeight: 1.2,
                                                    }}
                                                >
                                                    {p.name}
                                                </Typography>

                                                <Stack direction="row" alignItems="center" spacing={0.8}>
                                                    <Rating
                                                        value={Number(p.average_rating || 0)}
                                                        precision={0.1}
                                                        readOnly
                                                        size="small"
                                                    />

                                                    <Typography
                                                        sx={{
                                                            fontSize: "0.78rem",
                                                            fontWeight: 800,
                                                            color: "rgba(0,0,0,0.62)",
                                                        }}
                                                    >
                                                        {p.average_rating || 0}
                                                    </Typography>
                                                </Stack>

                                                <Typography
                                                    component="a"
                                                    href={`/reviews?category=${p.category}`}
                                                    sx={{
                                                        mt: 0.2,
                                                        display: "inline-block",
                                                        fontSize: "0.76rem",
                                                        fontWeight: 800,
                                                        color: "#e65100",
                                                        textDecoration: "none",
                                                    }}
                                                >
                                                    {p.total_reviews} reviews
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Stack>
                                </Box>

                                <Divider />

                                <Box>
                                    <Typography
                                        sx={{
                                            fontSize: "0.72rem",
                                            fontWeight: 900,
                                            letterSpacing: "0.12em",
                                            color: "rgba(0,0,0,0.55)",
                                            textTransform: "uppercase",
                                            mb: 1,
                                        }}
                                    >
                                        What customers are saying
                                    </Typography>

                                    {insights.random_reviews.length === 0 ? (
                                        <Typography
                                            sx={{
                                                fontSize: "0.86rem",
                                                color: "text.secondary",
                                            }}
                                        >
                                            No customer reviews yet.
                                        </Typography>
                                    ) : (
                                        <Stack spacing={1}>
                                            {insights.random_reviews.map((r) => (
                                                <Box
                                                    key={r.id}
                                                    sx={{
                                                        p: 1.15,
                                                        borderRadius: 2,
                                                        bgcolor: "#fff",
                                                        border: "1px solid rgba(230,81,0,0.14)",
                                                    }}
                                                >
                                                    <Stack direction="row" alignItems="center" spacing={0.6}>
                                                        <Rating
                                                            value={Number(r.rating || 0)}
                                                            readOnly
                                                            size="small"
                                                        />

                                                        <Typography
                                                            sx={{
                                                                fontSize: "0.74rem",
                                                                color: "rgba(0,0,0,0.55)",
                                                                fontWeight: 800,
                                                            }}
                                                        >
                                                            {r.product_name}
                                                        </Typography>
                                                    </Stack>

                                                    <Typography
                                                        sx={{
                                                            mt: 0.45,
                                                            fontSize: "0.86rem",
                                                            lineHeight: 1.35,
                                                            color: "#333",
                                                        }}
                                                    >
                                                        “{r.comment}”
                                                    </Typography>

                                                    <Typography
                                                        sx={{
                                                            mt: 0.45,
                                                            fontSize: "0.74rem",
                                                            color: "rgba(0,0,0,0.48)",
                                                            fontWeight: 700,
                                                        }}
                                                    >
                                                        — {r.display_name || "Fast Fuel customer"}
                                                    </Typography>
                                                </Box>
                                            ))}

                                            <Button
                                                component="a"
                                                href={category ? `/reviews?category=${category}` : "/reviews"}
                                                sx={{
                                                    alignSelf: "flex-start",
                                                    fontWeight: 900,
                                                    color: "#0d47a1",
                                                    px: 0,
                                                    textTransform: "uppercase",
                                                    fontSize: "0.76rem",
                                                    letterSpacing: "0.08em",
                                                }}
                                            >
                                                See more reviews
                                            </Button>
                                        </Stack>
                                    )}
                                </Box>

                                <Divider />

                                <Box>
                                    <Typography
                                        sx={{
                                            fontSize: "0.72rem",
                                            fontWeight: 900,
                                            letterSpacing: "0.12em",
                                            color: "rgba(0,0,0,0.55)",
                                            textTransform: "uppercase",
                                            mb: 1,
                                        }}
                                    >
                                        Most ordered
                                    </Typography>

                                    <Stack spacing={1.05}>
                                        {insights.products.map((p) => (
                                            <Box key={p.id}>
                                                <Stack
                                                    direction="row"
                                                    alignItems="center"
                                                    justifyContent="space-between"
                                                    sx={{ mb: 0.35 }}
                                                >
                                                    <Typography
                                                        sx={{
                                                            fontSize: "0.82rem",
                                                            fontWeight: 900,
                                                            color: "#333",
                                                            maxWidth: "72%",
                                                            overflow: "hidden",
                                                            textOverflow: "ellipsis",
                                                            whiteSpace: "nowrap",
                                                        }}
                                                    >
                                                        {p.name}
                                                    </Typography>

                                                    <Typography
                                                        sx={{
                                                            fontSize: "0.78rem",
                                                            fontWeight: 900,
                                                            color: "#e65100",
                                                        }}
                                                    >
                                                        {p.sales_percentage}%
                                                    </Typography>
                                                </Stack>

                                                <LinearProgress
                                                    variant="determinate"
                                                    value={p.sales_percentage}
                                                    sx={{
                                                        height: 8,
                                                        borderRadius: 999,
                                                        bgcolor: "rgba(13,71,161,0.10)",
                                                        "& .MuiLinearProgress-bar": {
                                                            borderRadius: 999,
                                                            bgcolor: "#e65100",
                                                        },
                                                    }}
                                                />
                                            </Box>
                                        ))}
                                    </Stack>
                                </Box>
                            </Stack>
                        )}
                    </Box>
                </Box>
            </Drawer>
        </Box>
    );
}