import { useEffect, useState, useRef, type MouseEvent } from "react";
import { api } from "../../api";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import {
    Box,
    Paper,
    Typography,
    TextField,
    Stack,
    Divider,
} from "@mui/material";
import NavbarAdmin from "../../components/layout/navbar/NavbarAdmin";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import Footer from "../../components/layout/footer/Footer";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import ProductsTitleBar from "../../components/TitleBar";
import AdminOrderTimelineMenu from "../../components/admin/orders/AdminOrderTimelineMenu";
import AdminOrderCard from "../../components/admin/orders/AdminOrderCard";


type Sale = {
    id: number;
    order_code: string;
    user_id: number | null;

    customer_name: string | null;
    customer_email: string | null;

    items: any;
    items_snapshot: any;

    subtotal: number;
    discount: number;
    total: number;

    status: "received" | "in_progress" | "sent" | "completed";

    accepted_at: string | null;
    sent_at: string | null;
    received_confirmed_at: string | null;

    created_at: string;
    updated_at: string;

    delivery_address: any; // JSON ou string JSON
    payment_status: string | null;
    payment_method: string | null;
};

const API = "/sales";


export default function AdminOrders() {
    useDocumentTitle("FastFuel • Adm - Orders");

    const [activeKey, setActiveKey] = useState<"received" | "in_progress" | "completed">(
        "received"
    );

    const [orderCodeFilter, setOrderCodeFilter] = useState("");
    const [emailFilter, setEmailFilter] = useState("");

    const [debouncedOrderCode, setDebouncedOrderCode] = useState("");
    const [debouncedEmail, setDebouncedEmail] = useState("");

    const [items, setItems] = useState<Sale[]>([]);
    const [loading, setLoading] = useState(false);

    const [tsAnchorEl, setTsAnchorEl] = useState<null | HTMLElement>(null);
    const [tsOrderId, setTsOrderId] = useState<number | null>(null);
    const tsOpen = Boolean(tsAnchorEl);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const openTsMenu = (e: MouseEvent<HTMLElement>, orderId: number) => {
        setTsAnchorEl(e.currentTarget);
        setTsOrderId(orderId);
    };

    const closeTsMenu = () => {
        setTsAnchorEl(null);
        setTsOrderId(null);
    };

    const selectedOrder = items.find((x) => x.id === tsOrderId);

    const inFlightRef = useRef(false);

    const tfBlueLabelSx = {
        "& label": { color: "#0d47a1" },
        "& label.Mui-focused": { color: "#0d47a1" },
        "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "#0d47a1" },
            "&:hover fieldset": { borderColor: "#123b7a" },
            "&.Mui-focused fieldset": { borderColor: "#0d47a1", borderWidth: 2 },
        },
    };

    useEffect(() => {
        const t = setTimeout(() => {
            setDebouncedOrderCode(orderCodeFilter.trim());
            setDebouncedEmail(emailFilter.trim());
        }, 400);

        return () => clearTimeout(t);
    }, [orderCodeFilter, emailFilter]);

    async function fetchOrders(opts?: { silent?: boolean }) {
        const silent = !!opts?.silent;

        // evita chamadas simultâneas (some com as “piscadas” e duplicação)
        if (inFlightRef.current) return;
        inFlightRef.current = true;

        if (!silent) setLoading(true);

        try {
            const buildParams = (status: string) => {
                const params = new URLSearchParams();
                params.set("status", status);

                if (debouncedOrderCode) params.set("order_code", debouncedOrderCode);
                if (debouncedEmail) params.set("email", debouncedEmail);

                return params.toString();
            };

            if (activeKey === "in_progress") {
                const [inprog, sent] = await Promise.all([
                    api.get<Sale[]>(`${API}?${buildParams("in_progress")}`),
                    api.get<Sale[]>(`${API}?${buildParams("sent")}`),
                ]);

                const merged = [...inprog.data, ...sent.data].sort(
                    (a, b) => +new Date(b.created_at) - +new Date(a.created_at)
                );

                setItems(merged);
                return;
            }

            const res = await api.get<Sale[]>(`${API}?${buildParams(activeKey)}`);
            setItems(res.data);
        } catch (e) {
            console.error(e);
            // no silent não mostra alert pra não incomodar
            if (!silent) alert("Failed to load orders");
        } finally {
            if (!silent) setLoading(false);
            inFlightRef.current = false;
        }
    }


    useEffect(() => {
        fetchOrders();
    }, [activeKey, debouncedOrderCode, debouncedEmail]);

    useEffect(() => {
        const tick = () => {
            if (document.visibilityState === "visible") {
                fetchOrders({ silent: true });
            }
        };

        const interval = setInterval(tick, 8000);
        return () => clearInterval(interval);
    }, [activeKey, debouncedOrderCode, debouncedEmail]);


    async function updateStatus(id: number, status: "in_progress" | "sent") {
        try {
            await api.patch(`${API}/${id}/status`, { status });
            await fetchOrders();
        } catch (e) {
            console.error(e);
            alert("Failed to update order status");
        }
    }


    if (isMobile) {
        return (
            <>
                <NavbarAdmin />
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
                            pb: "calc(100px + env(safe-area-inset-bottom))",
                            flex: 1,
                        }}
                    >
                        <Tabs
                            id="ff-admin-orders-tabs-mobile"
                            activeKey={activeKey}
                            onSelect={(k) => k && setActiveKey(k as any)}
                            className="ff-tabs"
                            fill
                        >
                            <Tab eventKey="received" title="Received" />
                            <Tab eventKey="in_progress" title="In progress" />
                            <Tab eventKey="completed" title="Completed" />
                        </Tabs>

                        <Box sx={{ mt: 1.5 }}>
                            <Stack direction="column" spacing={1.2}>
                                <TextField
                                    size="small"
                                    label="Filter by Order Code"
                                    value={orderCodeFilter}
                                    onChange={(e) =>
                                        setOrderCodeFilter(e.target.value.replace(/\D/g, ""))
                                    }
                                    inputProps={{ maxLength: 6, inputMode: "numeric" }}
                                    sx={tfBlueLabelSx}
                                    fullWidth
                                />

                                <TextField
                                    size="small"
                                    label="Filter by email"
                                    value={emailFilter}
                                    onChange={(e) => setEmailFilter(e.target.value)}
                                    sx={tfBlueLabelSx}
                                    fullWidth
                                />
                            </Stack>
                        </Box>

                        <Divider sx={{ my: 1.6, borderColor: "rgba(0, 0, 0, 0.45)" }} />

                        {loading ? (
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    textAlign: "center",
                                    py: 10,
                                }}
                            >
                                <Typography sx={{ color: "text.secondary" }}>
                                    Loading...
                                </Typography>
                            </Box>
                        ) : items.length === 0 ? (
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    textAlign: "center",
                                    py: 10,
                                    px: 2,
                                }}
                            >
                                <Typography
                                    sx={{
                                        color: "text.secondary",
                                        fontSize: "0.98rem",
                                        lineHeight: 1.6,
                                    }}
                                >
                                    No orders found.
                                </Typography>
                            </Box>
                        ) : (
                            <Stack spacing={1.2}>
                                {items.map((o) => (
                                    <AdminOrderCard
                                        key={o.id}
                                        order={o}
                                        activeKey={activeKey}
                                        onOpenTimeline={openTsMenu}
                                        onUpdateStatus={updateStatus}
                                    />
                                ))}
                            </Stack>
                        )}
                    </Box>

                    <Footer />
                </Box>

                <AdminOrderTimelineMenu
                    anchorEl={tsAnchorEl}
                    open={tsOpen}
                    onClose={closeTsMenu}
                    order={selectedOrder}
                />
            </>
        );
    }

    return (
        <>
            <NavbarAdmin />
            <ProductsTitleBar title="Orders" />

            <Box sx={{ minHeight: "100dvh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
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
                            position: "relative",
                            flex: 1,
                            minHeight: "100dvh",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "flex-start",
                            px: 2,
                            pt: { xs: "110px", md: "140px" },
                            pb: { xs: 1, md: 6 },
                            minWidth: 0,
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

                            <Tabs
                                id="ff-admin-orders-tabs"
                                activeKey={activeKey}
                                onSelect={(k) => k && setActiveKey(k as any)}
                                className="mb-2 ff-tabs"
                                fill
                            >
                                <Tab eventKey="received" title="Received" />
                                <Tab eventKey="in_progress" title="In progress" />
                                <Tab eventKey="completed" title="Completed" />
                            </Tabs>

                            <Stack
                                direction={{ xs: "column", sm: "row" }}
                                spacing={1.2}
                                alignItems={{ xs: "stretch", sm: "center" }}
                                justifyContent="space-between"
                                sx={{ mt: { xs: -2, sm: 0.5 } }}
                            >

                                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2}>
                                    <TextField
                                        size="small"
                                        label="Filter by Order Code"
                                        value={orderCodeFilter}
                                        onChange={(e) => setOrderCodeFilter(e.target.value.replace(/\D/g, ""))}
                                        inputProps={{ maxLength: 6, inputMode: "numeric" }}
                                        sx={[tfBlueLabelSx, { width: { xs: "100%", sm: 240 } }]}
                                    />

                                    <TextField
                                        size="small"
                                        label="Filter by email"
                                        value={emailFilter}
                                        onChange={(e) => setEmailFilter(e.target.value)}
                                        sx={[tfBlueLabelSx, { width: { xs: "100%", sm: 240 } }]}
                                    />
                                </Stack>
                            </Stack>

                            <Divider />

                            <Box sx={{ flex: 1, overflowY: "auto", pr: 0.5, minHeight: 0 }}>
                                {loading ? (
                                    <Box
                                        sx={{
                                            height: "100%",
                                            minHeight: 240,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            textAlign: "center",
                                            transform: "translateY(-10%)",
                                            px: 2,
                                        }}
                                    >
                                        <Typography sx={{ color: "text.secondary" }}>Loading...</Typography>
                                    </Box>
                                ) : items.length === 0 ? (
                                    <Box
                                        sx={{
                                            height: "100%",
                                            minHeight: 240,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            textAlign: "center",
                                            transform: "translateY(-10%)",
                                            px: 2,
                                        }}
                                    >
                                        <Typography sx={{ color: "text.secondary" }}>No orders found.</Typography>
                                    </Box>
                                ) : (
                                    <Stack spacing={1.4}>
                                        {items.map((o) => (
                                            <AdminOrderCard
                                                key={o.id}
                                                order={o}
                                                activeKey={activeKey}
                                                onOpenTimeline={openTsMenu}
                                                onUpdateStatus={updateStatus}
                                            />
                                        ))}
                                    </Stack>
                                )}
                            </Box>
                        </Paper>
                    </Box >
                </Box >
                <Footer />
            </Box >

            <AdminOrderTimelineMenu
                anchorEl={tsAnchorEl}
                open={tsOpen}
                onClose={closeTsMenu}
                order={selectedOrder}
            />
        </>
    );
}
