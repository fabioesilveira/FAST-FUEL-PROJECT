import { useEffect, useState, useRef, type MouseEvent } from "react";
import { api } from "../../api";
import { Box, Paper, Divider } from "@mui/material";
import Footer from "../../components/layout/footer/Footer";
import { useNavigate } from "react-router-dom";
import { useAppAlert } from "../../hooks/useAppAlert";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import NavbarAction from "../../components/layout/navbar/NavbarAction";
import OrderReviewModal, {
    type ReviewEligibleItem,
} from "../../components/OrderReviewModal";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import ProductsTitleBar from "../../components/TitleBar";
import GuestOrderFilters from "../../components/orders/guest/GuestOrderFilters";
import GuestOrderContent from "../../components/orders/guest/GuestOrderContent";
import TimelineMenu from "../../components/orders/shared/OrderTimelineMenu";

import type { Sale } from "../../components/orders/types";

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

export default function TrackOrderGuest() {
    useDocumentTitle("FastFuel • Track Order");

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const navigate = useNavigate();
    const inFlightRef = useRef(false);

    const { showAlert, AlertUI, ConfirmUI, confirmAlert } = useAppAlert({
        vertical: "top",
        horizontal: "center",
    });

    // STATE
    const [orderCodeFilter, setOrderCodeFilter] = useState("");
    const [emailFilter, setEmailFilter] = useState("");
    const [items, setItems] = useState<Sale[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    // Timeline
    const [tsAnchorEl, setTsAnchorEl] = useState<null | HTMLElement>(null);
    const [tsOrderId, setTsOrderId] = useState<number | null>(null);
    const tsOpen = Boolean(tsAnchorEl);

    // Reviews
    const [reviewOpen, setReviewOpen] = useState(false);
    const [eligibleItems, setEligibleItems] = useState<ReviewEligibleItem[]>([]);
    const [reviewIndex, setReviewIndex] = useState(0);
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewComment, setReviewComment] = useState("");
    const [reviewSubmitting, setReviewSubmitting] = useState(false);

    const currentReviewItem = eligibleItems[reviewIndex] ?? null;
    const selectedOrder = items.find((x) => x.id === tsOrderId);

    const canSearch = Boolean(orderCodeFilter.trim() && emailFilter.trim());

    // HANDLERS
    function handleReset() {
        setEmailFilter("");
        setOrderCodeFilter("");
        setItems([]);
        setHasSearched(false);
        resetReviewFlow();
    }

    const openTsMenu = (e: MouseEvent<HTMLElement>, orderId: number) => {
        setTsAnchorEl(e.currentTarget);
        setTsOrderId(orderId);
    };

    const closeTsMenu = () => {
        setTsAnchorEl(null);
        setTsOrderId(null);
    };

    function handleNotReceivedYet() {
        confirmAlert({
            title: "No problem!",
            message:
                "Please send us a message about your order. In the meantime, if you receive it later, you can come back here and mark it as received.",
            confirmText: "Contact us",
            cancelText: "Close",
            onConfirm: () => navigate("/contact-us"),
            onCancel: () => { },
        });
    }

    // API
    async function fetchOrders(opts?: { silent?: boolean }) {
        const silent = !!opts?.silent;

        const code = orderCodeFilter.trim();
        const email = emailFilter.trim().toLowerCase();

        if (!silent) setHasSearched(true);

        if (!code || !email) {
            setItems([]);
            return;
        }

        if (inFlightRef.current) return;
        inFlightRef.current = true;

        if (!silent) setLoading(true);

        try {
            const res = await api.post<Sale>("/sales/track", {
                order_code: code,
                email,
            });

            setItems(res.data ? [res.data] : []);
        } catch (e: any) {
            if (!silent) {
                if (e?.response?.status === 404) {
                    setItems([]);
                } else {
                    showAlert(
                        e?.response?.data?.msg || "Failed to load your order.",
                        "error"
                    );
                    setItems([]);
                }
            }
        } finally {
            if (!silent) setLoading(false);
            inFlightRef.current = false;
        }
    }

    async function confirmReceived(o: Sale) {
        try {
            await api.patch(`/sales/${o.id}/confirm-received`, {
                order_code: o.order_code,
                email: o.customer_email ?? emailFilter.trim(),
            });

            await loadEligibleReviewsForOrder(o);
            await fetchOrders({ silent: true });
        } catch {
            showAlert("Failed to confirm receipt", "error");
        }
    }

    async function loadEligibleReviewsForOrder(order: Sale) {
        try {
            const email = (order.customer_email ?? emailFilter)
                .trim()
                .toLowerCase();

            const res = await api.get("/reviews/eligible", {
                params: {
                    sale_id: order.id,
                    customer_email: email,
                },
            });

            const items = res.data?.eligible_items ?? [];

            if (items.length > 0) {
                setEligibleItems(items);
                setReviewIndex(0);
                setReviewRating(0);
                setReviewComment("");
                setReviewOpen(true);
            }
        } catch { }
    }

    async function handleReviewSubmit() {
        const currentItem = eligibleItems[reviewIndex];
        if (!currentItem || reviewRating < 1) return;

        setReviewSubmitting(true);

        try {
            await api.post("/reviews", {
                sale_id: currentItem.sale_id,
                product_id: currentItem.product_id,
                rating: reviewRating,
                comment: reviewComment.trim() || null,
                customer_email: String(
                    items[0]?.customer_email ?? emailFilter
                ).trim().toLowerCase(),
            });

            goToNextReviewItem();
        } catch (e: any) {
            showAlert(e?.response?.data?.msg || "Failed to send review.", "error");
        } finally {
            setReviewSubmitting(false);
        }
    }

    function handleReviewSkip() {
        goToNextReviewItem();
    }

    function resetReviewFlow() {
        setReviewOpen(false);
        setEligibleItems([]);
        setReviewIndex(0);
        setReviewRating(0);
        setReviewComment("");
        setReviewSubmitting(false);
    }

    function goToNextReviewItem() {
        const next = reviewIndex + 1;

        if (next >= eligibleItems.length) {
            resetReviewFlow();
            showAlert("Thanks for your feedback!", "success");
            return;
        }

        setReviewIndex(next);
        setReviewRating(0);
        setReviewComment("");
    }

    // EFFECTS
    useEffect(() => {
        const lastCode = localStorage.getItem("lastOrderCode") || "";
        const lastEmail = localStorage.getItem("lastOrderEmail") || "";

        if (!orderCodeFilter && lastCode) setOrderCodeFilter(lastCode);
        if (!emailFilter && lastEmail) setEmailFilter(lastEmail);
    }, []);

    useEffect(() => {
        if (!hasSearched || !canSearch) return;

        const id = setInterval(() => {
            if (document.visibilityState === "visible") {
                fetchOrders({ silent: true });
            }
        }, 8000);

        return () => clearInterval(id);
    }, [hasSearched, canSearch]);

    // RENDER
    return (
        <>
            {AlertUI}
            {ConfirmUI}
            <NavbarAction />
            <ProductsTitleBar title="Track Order" />

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
                        <GuestOrderFilters
                            emailFilter={emailFilter}
                            orderCodeFilter={orderCodeFilter}
                            loading={loading}
                            canSearch={canSearch}
                            tfBlueLabelSx={tfBlueLabelSx}
                            isMobile={isMobile}
                            onEmailChange={(value) => {
                                setEmailFilter(value);
                                setHasSearched(false);
                                setItems([]);
                            }}
                            onOrderCodeChange={(value) => {
                                setOrderCodeFilter(value);
                                setHasSearched(false);
                                setItems([]);
                            }}
                            onSearch={() => fetchOrders()}
                            onReset={handleReset}
                        />

                        <Divider sx={{ borderColor: "rgba(0, 0, 0, 0.45)", mb: 2 }} />

                        <GuestOrderContent
                            hasSearched={hasSearched}
                            loading={loading}
                            items={items}
                            isMobile={isMobile}
                            onOpenTimeline={openTsMenu}
                            onConfirmReceived={confirmReceived}
                            onNotReceivedYet={handleNotReceivedYet}
                        />
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
                                <GuestOrderFilters
                                    emailFilter={emailFilter}
                                    orderCodeFilter={orderCodeFilter}
                                    loading={loading}
                                    canSearch={canSearch}
                                    tfBlueLabelSx={tfBlueLabelSx}
                                    isMobile={isMobile}
                                    onEmailChange={(value) => {
                                        setEmailFilter(value);
                                        setHasSearched(false);
                                        setItems([]);
                                    }}
                                    onOrderCodeChange={(value) => {
                                        setOrderCodeFilter(value);
                                        setHasSearched(false);
                                        setItems([]);
                                    }}
                                    onSearch={() => fetchOrders()}
                                    onReset={handleReset}
                                />

                                <Divider sx={{ borderColor: "rgba(0, 0, 0, 0.45)" }} />

                                <GuestOrderContent
                                    hasSearched={hasSearched}
                                    loading={loading}
                                    items={items}
                                    isMobile={isMobile}
                                    onOpenTimeline={openTsMenu}
                                    onConfirmReceived={confirmReceived}
                                    onNotReceivedYet={handleNotReceivedYet}
                                />
                            </Paper>
                        </Box>
                    </Box>

                    <Footer />
                </Box>
            )}

            <TimelineMenu
                anchorEl={tsAnchorEl}
                open={tsOpen}
                onClose={closeTsMenu}
                order={selectedOrder}
            />

            <OrderReviewModal
                open={reviewOpen}
                item={currentReviewItem}
                currentIndex={reviewIndex}
                totalItems={eligibleItems.length}
                rating={reviewRating}
                comment={reviewComment}
                loading={reviewSubmitting}
                onClose={resetReviewFlow}
                onSkip={handleReviewSkip}
                onRatingChange={setReviewRating}
                onCommentChange={setReviewComment}
                onSubmit={handleReviewSubmit}
            />
        </>
    );
}