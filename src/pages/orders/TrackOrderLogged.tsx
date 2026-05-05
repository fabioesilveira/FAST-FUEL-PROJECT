import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import { api } from "../../api";
import { Box, Divider, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/layout/footer/Footer";
import { useAppAlert } from "../../hooks/useAppAlert";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import NavbarAction from "../../components/layout/navbar/NavbarAction";
import OrderReviewModal, {
    type ReviewEligibleItem,
} from "../../components/OrderReviewModal";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import ProductsTitleBar from "../../components/TitleBar";

import type { Sale } from "../../components/orders/types";
import LoggedOrdersTabs from "../../components/orders/logged/LoggedOrdersTabs";
import LoggedOrdersFilters from "../../components/orders/logged/LoggedOrdersFilters";
import LoggedOrdersContent from "../../components/orders/logged/LoggedOrdersContent";
import OrderTimelineMenu from "../../components/orders/shared/OrderTimelineMenu";

type LoggedUser = {
    id: number;
    userName?: string;
    fullName?: string;
    email?: string;
    type?: "admin" | "normal";
};

const API = "/sales";

const tfBlueLabelSx = {
    "& label": { color: "#0d47a1" },
    "& label.Mui-focused": { color: "#0d47a1" },
    "& .MuiOutlinedInput-root": {
        "& fieldset": { borderColor: "#0d47a1" },
        "&:hover fieldset": { borderColor: "#123b7a" },
        "&.Mui-focused fieldset": { borderColor: "#0d47a1", borderWidth: 2 },
    },
};

export default function OrdersLogged() {
    useDocumentTitle("FastFuel • Orders");

    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const inFlightRef = useRef(false);

    const { confirmAlert, showAlert, AlertUI, ConfirmUI } = useAppAlert({
        vertical: "top",
        horizontal: "center",
    });

    const [activeKey, setActiveKey] = useState<"in_progress" | "completed">(
        "in_progress"
    );
    const [orderCodeFilter, setOrderCodeFilter] = useState("");
    const [debouncedOrderCode, setDebouncedOrderCode] = useState("");
    const [items, setItems] = useState<Sale[]>([]);
    const [loading, setLoading] = useState(false);

    const [tsAnchorEl, setTsAnchorEl] = useState<HTMLElement | null>(null);
    const [tsOrderId, setTsOrderId] = useState<number | null>(null);

    const [reviewOpen, setReviewOpen] = useState(false);
    const [eligibleItems, setEligibleItems] = useState<ReviewEligibleItem[]>([]);
    const [reviewIndex, setReviewIndex] = useState(0);
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewComment, setReviewComment] = useState("");
    const [reviewSubmitting, setReviewSubmitting] = useState(false);

    const tsOpen = Boolean(tsAnchorEl);
    const selectedOrder = items.find((x) => x.id === tsOrderId);
    const currentReviewItem = eligibleItems[reviewIndex] ?? null;

    const loggedUser: LoggedUser | null = useMemo(() => {
        const rawAuth = localStorage.getItem("authUser");
        if (rawAuth) {
            try {
                const u = JSON.parse(rawAuth);
                if (u?.id) return u as LoggedUser;
            } catch { }
        }

        const idUser = localStorage.getItem("idUser");
        if (idUser) {
            return {
                id: Number(idUser),
                userName: localStorage.getItem("userName") || undefined,
                email: localStorage.getItem("emailUser") || undefined,
                type:
                    (localStorage.getItem("userType") as LoggedUser["type"]) || "normal",
            };
        }

        const rawUser = localStorage.getItem("user");
        if (rawUser) {
            try {
                const u = JSON.parse(rawUser);
                if (u?.id) return u as LoggedUser;
            } catch { }
        }

        return null;
    }, []);

    const isLogged =
        Number.isFinite(Number(loggedUser?.id)) && Number(loggedUser?.id) > 0;

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
                "Please send us a message about your order. In the meantime, if you receive it later, you can come back to Orders and mark it as received. We’ll get it on our end. Thanks!",
            confirmText: "Contact us",
            cancelText: "Close",
            onConfirm: () => navigate("/contact-us"),
            onCancel: () => { },
            onDismiss: () => { },
        });
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
        const nextIndex = reviewIndex + 1;

        if (nextIndex >= eligibleItems.length) {
            resetReviewFlow();
            showAlert("Thanks for your feedback!", "success");
            return;
        }

        setReviewIndex(nextIndex);
        setReviewRating(0);
        setReviewComment("");
    }

    function handleReviewSkip() {
        goToNextReviewItem();
    }

    async function fetchUserOrders(opts?: { silent?: boolean }) {
        if (!isLogged) return;

        const silent = !!opts?.silent;

        if (inFlightRef.current) return;
        inFlightRef.current = true;

        if (!silent) setLoading(true);

        try {
            const params = new URLSearchParams();

            if (activeKey === "completed") {
                params.set("status", "completed");
            } else {
                params.set("status", "received,in_progress,sent");
            }

            if (debouncedOrderCode) {
                params.set("order_code", debouncedOrderCode);
            }

            const res = await api.get<Sale[]>(
                `/sales/my-orders?${params.toString()}`
            );

            const sorted = [...res.data].sort(
                (a, b) => +new Date(b.created_at) - +new Date(a.created_at)
            );

            setItems(sorted);
        } catch (e) {
            console.error(e);
            if (!silent) showAlert("Failed to load your orders", "error");
        } finally {
            if (!silent) setLoading(false);
            inFlightRef.current = false;
        }
    }

    async function confirmReceived(o: Sale) {
        try {
            await api.patch(`${API}/${o.id}/confirm-received`, {
                order_code: o.order_code,
                email: o.customer_email,
            });

            await loadEligibleReviewsForOrder({
                ...o,
                status: "completed",
                received_confirmed_at: new Date().toISOString(),
            });

            await fetchUserOrders();
        } catch (e) {
            console.error(e);
            showAlert("Failed to confirm receipt", "error");
        }
    }

    async function loadEligibleReviewsForOrder(order: Sale) {
        try {
            const res = await api.get("/reviews/eligible", {
                params: {
                    sale_id: order.id,
                },
            });

            const eligible = Array.isArray(res.data?.eligible_items)
                ? res.data.eligible_items
                : [];

            if (eligible.length > 0) {
                setEligibleItems(eligible);
                setReviewIndex(0);
                setReviewRating(0);
                setReviewComment("");
                setReviewOpen(true);
            } else {
                showAlert("No items available for review in this order.", "info");
            }
        } catch (e: any) {
            console.error("ELIGIBLE REVIEWS ERROR:", e);
            console.error("ELIGIBLE REVIEWS DATA:", e?.response?.data);
            showAlert(e?.response?.data?.msg || "Failed to load review items.", "error");
        }
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
            });

            goToNextReviewItem();
        } catch (e: any) {
            console.error("CREATE REVIEW ERROR:", e);
            console.error("CREATE REVIEW DATA:", e?.response?.data);
            showAlert(e?.response?.data?.msg || "Failed to send review.", "error");
        } finally {
            setReviewSubmitting(false);
        }
    }

    useEffect(() => {
        const t = setTimeout(
            () => setDebouncedOrderCode(orderCodeFilter.trim()),
            350
        );

        return () => clearTimeout(t);
    }, [orderCodeFilter]);

    useEffect(() => {
        fetchUserOrders();
    }, [activeKey, debouncedOrderCode, isLogged]);

    useEffect(() => {
        if (!isLogged) return;

        const tick = () => {
            if (document.visibilityState === "visible") {
                fetchUserOrders({ silent: true });
            }
        };

        tick();

        const id = setInterval(tick, 5000);
        return () => clearInterval(id);
    }, [isLogged, activeKey, debouncedOrderCode]);

    if (!isLogged) {
        return (
            <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        display: "flex",
                        justifyContent: "center",
                        px: 2,
                        pt: { xs: "110px", md: "120px" },
                        pb: 4,
                    }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            width: "100%",
                            maxWidth: 740,
                            borderRadius: 3,
                            border: "1.5px solid rgba(230, 81, 0, 0.35)",
                            p: { xs: 2.5, md: 4 },
                            boxShadow:
                                "0 4px 14px rgba(230, 81, 0, 0.35), 0 8px 24px rgba(230, 81, 0, 0.25)",
                        }}
                    >
                        <Typography
                            align="center"
                            sx={{ color: "text.secondary", fontWeight: 700 }}
                        >
                            You’re not logged in. Use the Track Order page (code + email) for
                            guest tracking.
                        </Typography>
                    </Paper>
                </Box>

                <Footer />
            </Box>
        );
    }

    if (isMobile) {
        return (
            <>
                {AlertUI}
                {ConfirmUI}
                <NavbarAction />
                <ProductsTitleBar title="Orders" />

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
                            maxWidth: 560,
                            mx: "auto",
                            px: 2.4,
                            pt: "150px",
                            pb: "40px",
                            flex: 1,
                        }}
                    >
                        <LoggedOrdersTabs activeKey={activeKey} onChange={setActiveKey} />

                        <Box sx={{ mt: 1.5 }}>
                            <LoggedOrdersFilters
                                orderCodeFilter={orderCodeFilter}
                                onChange={setOrderCodeFilter}
                                tfBlueLabelSx={tfBlueLabelSx}
                            />
                        </Box>

                        <Divider
                            sx={{ my: 1.6, borderColor: "rgba(0, 0, 0, 0.45)" }}
                        />

                        <LoggedOrdersContent
                            loading={loading}
                            items={items}
                            activeKey={activeKey}
                            isMobile={isMobile}
                            onOpenTimeline={openTsMenu}
                            onConfirmReceived={confirmReceived}
                            onNotReceivedYet={handleNotReceivedYet}
                        />
                    </Box>

                    <Footer />
                </Box>

                <OrderTimelineMenu
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

    return (
        <>
            {AlertUI}
            {ConfirmUI}
            <NavbarAction />
            <ProductsTitleBar title="Orders" />

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
                                height: {
                                    xs: "calc(100svh - 200px)",
                                    md: "calc(100vh - 240px)",
                                },
                                maxHeight: 660,
                                mt: { sm: 5, md: 2.2 },
                                mb: { md: 1 },
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                                overflow: "hidden",
                            }}
                        >
                            <LoggedOrdersTabs activeKey={activeKey} onChange={setActiveKey} />

                            <LoggedOrdersFilters
                                orderCodeFilter={orderCodeFilter}
                                onChange={setOrderCodeFilter}
                                tfBlueLabelSx={tfBlueLabelSx}
                            />

                            <Divider sx={{ borderColor: "rgba(0, 0, 0, 0.45)" }} />

                            <LoggedOrdersContent
                                loading={loading}
                                items={items}
                                activeKey={activeKey}
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

            <OrderTimelineMenu
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