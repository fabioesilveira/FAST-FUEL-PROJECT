import { useEffect, useMemo, useState, useRef, type MouseEvent } from "react";
import { api } from "../../api";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import { Box, Paper, Typography, TextField, Button, Stack, Divider } from "@mui/material";
import NavbarAdmin from "../../components/NavbarAdmin";
import Footer from "../../components/Footer";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Menu, MenuItem, ListItemText } from "@mui/material";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

type ContactMsg = {
    id: number;
    name: string;
    email: string;
    orderNumber: number;
    phone: string | null;
    subject: string;
    message: string;
    created_at: string;
    replied: number; // 0|1
    replied_at: string | null;
};

const API = "/contact-us";

function formatDate(iso: string | null) {
    if (!iso) return "-";
    return new Date(iso).toLocaleString();
}

function formatPhoneUS(phone: string | null) {
    const digits = String(phone ?? "").replace(/\D/g, "");
    if (!digits) return "—";

    const d = digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
    if (d.length !== 10) return phone;

    const a = d.slice(0, 3);
    const b = d.slice(3, 6);
    const c = d.slice(6);
    return `(${a}) ${b}-${c}`;
}


export default function AdminMessages() {
    useDocumentTitle("FastFuel • Adm - Messages");

    const [activeKey, setActiveKey] = useState<"received" | "answered" | "contact">("received");
    const [emailFilter, setEmailFilter] = useState("");
    const [items, setItems] = useState<ContactMsg[]>([]);
    const [loading, setLoading] = useState(false);

    const [tsAnchorEl, setTsAnchorEl] = useState<null | HTMLElement>(null);
    const [tsMsgId, setTsMsgId] = useState<number | null>(null);

    const tsOpen = Boolean(tsAnchorEl);
    const selectedMsg = items.find((x) => x.id === tsMsgId);

    const openTsMenu = (e: MouseEvent<HTMLElement>, msgId: number) => {
        setTsAnchorEl(e.currentTarget);
        setTsMsgId(msgId);
    };

    const closeTsMenu = () => {
        setTsAnchorEl(null);
        setTsMsgId(null);
    };

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

    const repliedValue = activeKey === "answered" ? 1 : 0;

    const queryUrl = useMemo(() => {
        const params = new URLSearchParams();
        params.set("replied", String(repliedValue));
        if (emailFilter.trim()) params.set("email", emailFilter.trim());
        return `${API}?${params.toString()}`;
    }, [repliedValue, emailFilter]);

    async function fetchMessages(opts?: { silent?: boolean }) {
        const silent = !!opts?.silent;

        if (inFlightRef.current) return;
        inFlightRef.current = true;

        if (!silent) setLoading(true);

        try {
            const res = await api.get<ContactMsg[]>(queryUrl);
            setItems(res.data);
        } catch (e) {
            console.error(e);
            if (!silent) alert("Failed to load messages");
        } finally {
            if (!silent) setLoading(false);
            inFlightRef.current = false;
        }
    }


    useEffect(() => {
        if (activeKey === "contact") return;

        fetchMessages();

        const tick = () => {
            if (document.visibilityState === "visible") {
                fetchMessages({ silent: true });
            }
        };

        const interval = setInterval(tick, 8000);
        return () => clearInterval(interval);
    }, [queryUrl, activeKey]);


    async function markAsAnswered(id: number) {
        try {
            await api.patch(`${API}/${id}/reply`);
            setItems((prev) => prev.filter((m) => m.id !== id));
        } catch (e) {
            console.error(e);
            alert("Failed to mark as answered");
        }
    }

    return (
        <>
            <NavbarAdmin />

            <Box
                sx={{
                    minHeight: { xs: "100svh", md: "100vh" },
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                }}
            >
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
                                        rgba(13,71,161,0.018) 0px,
                                        rgba(13,71,161,0.018) 10px,
                                        rgba(230,81,0,0.014) 10px,
                                        rgba(230,81,0,0.014) 20px
                                    )
                                    `,


                                sm: `
                                    linear-gradient(90deg,
                                        rgba(255,255,255,1) 0%,
                                        rgba(255,255,255,0.0) 14%,
                                        rgba(255,255,255,0.0) 86%,
                                        rgba(255,255,255,1) 100%
                                    ),
                                    repeating-linear-gradient(135deg,
                                        rgba(13,71,161,0.038) 0px,
                                        rgba(13,71,161,0.038) 10px,
                                        rgba(230,81,0,0.028) 10px,
                                        rgba(230,81,0,0.028) 20px
                                    )
                                    `,
                                md: `
                                    linear-gradient(90deg,
                                        rgba(255,255,255,1) 0%,
                                        rgba(255,255,255,0.0) 14%,
                                        rgba(255,255,255,0.0) 86%,
                                        rgba(255,255,255,1) 100%
                                    ),
                                    repeating-linear-gradient(135deg,
                                        rgba(13,71,161,0.038) 0px,
                                        rgba(13,71,161,0.038) 10px,
                                        rgba(230,81,0,0.028) 10px,
                                        rgba(230,81,0,0.028) 20px
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
                            pt: { xs: "110px", md: "120px" },
                            pb: 4,
                            overflow: "hidden",
                            minHeight: 0,
                        }}
                    >
                        <Paper
                            elevation={0}
                            sx={{
                                width: "100%",
                                maxWidth: { xs: 520, md: 980 },
                                borderRadius: 3,
                                border: "1.25px solid rgba(13, 71, 161, 0.28)",
                                boxShadow:
                                    "0 4px 12px rgba(13, 71, 161, 0.12), 0 10px 24px rgba(13, 71, 161, 0.08)",
                                bgcolor: "background.paper",
                                p: { xs: 2.5, md: 4 },

                                height: { xs: "calc(100dvh - 200px)", md: "calc(100vh - 220px)" },
                                maxHeight: 720,
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                                overflow: "hidden",
                                minHeight: 0,
                            }}
                        >
                            <Typography
                                variant="h4"
                                align="center"
                                sx={{
                                    letterSpacing: "0.14em",
                                    fontSize: { xs: "2.12rem", sm: "2.26rem", md: "2.28rem" },
                                    textTransform: "uppercase",
                                    color: "#0d47a1",
                                    fontWeight: 800,
                                    textShadow: "1px 1px 0 rgba(230, 81, 0, 0.20)",
                                    mt: { xs: 1, sm: 1, md: 1 },
                                    mb: { xs: 1, sm: 1, md: 1 },
                                }}
                            >
                                Messages
                            </Typography>

                            <Tabs
                                id="ff-admin-tabs"
                                activeKey={activeKey}
                                onSelect={(k) => {
                                    if (!k) return;
                                    setActiveKey(k as any);
                                }}
                                className="mb-2 ff-tabs"
                                fill
                            >
                                <Tab eventKey="received" title="Received" />
                                <Tab eventKey="answered" title="Answered" />
                                <Tab eventKey="contact" title="Contact-us" disabled />
                            </Tabs>

                            <Stack
                                direction={{ xs: "column", sm: "row" }}
                                spacing={1.2}
                                alignItems={{ xs: "stretch", sm: "center" }}
                                justifyContent="space-between"
                                sx={{ mt: { xs: -2, sm: 0.5 } }}
                            >

                                <TextField
                                    size="small"
                                    label="Filter by email"
                                    value={emailFilter}
                                    onChange={(e) => setEmailFilter(e.target.value)}
                                    sx={[tfBlueLabelSx, { width: { xs: "100%", sm: 320 } }]}
                                />
                            </Stack>

                            <Divider />

                            {/* LISTA COM SCROLL */}
                            <Box
                                sx={{
                                    flex: 1,
                                    overflowY: "auto",
                                    pr: 0.5,
                                    minHeight: 0,
                                    WebkitOverflowScrolling: "touch",
                                    overscrollBehavior: "contain",
                                }}
                            >

                                {loading ? (
                                    <Box
                                        sx={{
                                            minHeight: "100%",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            textAlign: "center",
                                            transform: "translateY(-18%)",
                                            py: 4,
                                        }}
                                    >
                                        <Typography sx={{ color: "text.secondary" }}>Loading...</Typography>
                                    </Box>
                                ) : items.length === 0 ? (
                                    <Box
                                        sx={{
                                            minHeight: "100%",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            textAlign: "center",
                                            transform: "translateY(-10%)",
                                            py: 4,
                                        }}
                                    >
                                        <Typography sx={{ color: "text.secondary" }}>No messages found.</Typography>
                                    </Box>
                                ) : (
                                    <Stack spacing={1.4}>
                                        {items.map((m) => (
                                            <Paper
                                                key={m.id}
                                                elevation={0}
                                                sx={{
                                                    p: 2,
                                                    borderRadius: 2,
                                                    border: "1px solid rgba(230, 81, 0, 0.28)",
                                                    bgcolor: "#fff4e1",
                                                }}
                                            >
                                                <Stack
                                                    sx={{ mt: { xs: 0, sm: -0.2, md: -0.2 } }}
                                                >
                                                    {/* HEADER */}
                                                    <Stack
                                                        direction="row"
                                                        justifyContent="space-between"
                                                        alignItems="center"
                                                        gap={1}
                                                        sx={{ width: "100%" }}
                                                    >
                                                        <Typography
                                                            sx={{
                                                                fontSize: 18,
                                                                fontWeight: 900,
                                                                color: "#1e5bb8",
                                                                lineHeight: 1.1,
                                                            }}
                                                        >
                                                            {m.subject}
                                                            <Box
                                                                component="span"
                                                                sx={{
                                                                    color: "rgba(0,0,0,0.40)",
                                                                    fontWeight: 800,
                                                                    fontSize: "0.84rem",
                                                                }}
                                                            >
                                                                {" "}• #{m.id}
                                                            </Box>
                                                        </Typography>

                                                        {/* RIGHT ACTIONS */}
                                                        <Stack
                                                            direction="row"
                                                            alignItems="center"
                                                            gap={0.6}
                                                            sx={{ flexShrink: 0, mt: 0.15 }}
                                                        >
                                                            {activeKey === "received" ? (
                                                                <Button
                                                                    variant="contained"
                                                                    onClick={() => markAsAnswered(m.id)}
                                                                    sx={{
                                                                        borderRadius: 2,
                                                                        bgcolor: "#1e5bb8",
                                                                        color: "#fff",
                                                                        fontWeight: 900,
                                                                        textTransform: "uppercase",
                                                                        letterSpacing: "0.08em",
                                                                        fontSize: { xs: "0.60rem", sm: "0.68rem" },
                                                                        px: { xs: 0.9, sm: 1.3 },
                                                                        py: 0,
                                                                        minWidth: { xs: 92, sm: 120 },
                                                                        height: { xs: 23, sm: 28 },
                                                                        lineHeight: 1,
                                                                        "&:hover": { bgcolor: "#164a96" },
                                                                    }}
                                                                >
                                                                    Mark answered
                                                                </Button>
                                                            ) : (
                                                                <Typography
                                                                    sx={{
                                                                        display: { xs: "none", sm: "inline-flex" },
                                                                        alignItems: "center",
                                                                        justifyContent: "center",
                                                                        fontSize: { xs: "0.62rem", sm: "0.68rem" },
                                                                        letterSpacing: "0.08em",
                                                                        textTransform: "uppercase",
                                                                        fontWeight: 900,
                                                                        color: "rgba(0,0,0,0.45)",
                                                                        bgcolor: "rgba(0,0,0,0.06)",
                                                                        px: { xs: 0.45, sm: 0.9 },
                                                                        py: 0,
                                                                        // minWidth: { xs: 92, sm: 120 },
                                                                        height: { xs: 20, sm: 22 },
                                                                        lineHeight: 1,
                                                                        borderRadius: 999,
                                                                        border: "1px solid rgba(0,0,0,0.10)",
                                                                        boxSizing: "border-box",
                                                                    }}
                                                                >
                                                                    Answered
                                                                </Typography>
                                                            )}

                                                            <Button
                                                                size="small"
                                                                onClick={(e) => openTsMenu(e, m.id)}
                                                                endIcon={<ExpandMoreIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />}
                                                                sx={{
                                                                    minHeight: { xs: 20, sm: 22 },
                                                                    minWidth: "auto",
                                                                    px: { xs: 0.4, sm: 1 },
                                                                    py: 0,
                                                                    fontSize: { xs: "0.64rem", sm: "0.72rem" },
                                                                    letterSpacing: { xs: "0.06em", sm: "0.08em" },
                                                                    textTransform: "uppercase",
                                                                    fontWeight: 900,
                                                                    color: "rgba(0,0,0,0.65)",
                                                                    "& .MuiButton-endIcon": {
                                                                        marginLeft: { xs: "2px", sm: "3px" },
                                                                        marginTop: "-2px",
                                                                    },
                                                                }}
                                                            >
                                                                Timeline
                                                            </Button>
                                                        </Stack>
                                                    </Stack>

                                                    {/* NAME / EMAIL / PHONE */}
                                                    <Box sx={{ mt: 1.1 }}>
                                                        <Stack spacing={0.15}>
                                                            <Box sx={{ mt: 0 }}>
                                                                {/* desktop */}
                                                                <Typography
                                                                    sx={{
                                                                        display: { xs: "none", sm: "block" },
                                                                        fontSize: "0.88rem",
                                                                        lineHeight: 1.25,
                                                                        whiteSpace: "nowrap",
                                                                        overflow: "hidden",
                                                                        textOverflow: "ellipsis",
                                                                    }}
                                                                    title={`${m.name} • ${m.email} • Phone: ${formatPhoneUS(m.phone)}${m.orderNumber ? ` • Order: ${m.orderNumber}` : ""
                                                                        }`}
                                                                >
                                                                    <b>{m.name}</b> • {m.email} {" "}•{" "}
                                                                    <span style={{ color: "rgba(0,0,0,0.68)" }}>Phone:</span>{" "}
                                                                    {formatPhoneUS(m.phone)}
                                                                    {m.orderNumber ? ` • Order: ${m.orderNumber}` : ""}
                                                                </Typography>

                                                                {/* mobile */}
                                                                <Box sx={{ display: { xs: "block", sm: "none" } }}>
                                                                    <Typography sx={{ fontSize: "0.88rem", lineHeight: 1.25 }}>
                                                                        <b>{m.name}</b> • {m.email}
                                                                    </Typography>

                                                                    <Typography
                                                                        sx={{
                                                                            fontSize: "0.86rem",
                                                                            lineHeight: 1.25,
                                                                            color: "rgba(0,0,0,0.70)",
                                                                            mt: 0.15,
                                                                        }}
                                                                    >
                                                                        <span style={{ color: "rgba(0,0,0,0.68)" }}>Phone:</span>{" "}
                                                                        {formatPhoneUS(m.phone)}
                                                                        {m.orderNumber ? ` • Order: ${m.orderNumber}` : ""}
                                                                    </Typography>
                                                                </Box>
                                                            </Box>
                                                        </Stack>
                                                    </Box>

                                                    {/* MESSAGE */}
                                                    <Box sx={{ mt: 0.9 }}>
                                                        <Typography
                                                            sx={{
                                                                color: "#333",
                                                                fontSize: "0.96rem",
                                                                lineHeight: 1.40,
                                                                whiteSpace: "pre-wrap",
                                                                overflowWrap: "anywhere",
                                                                mt: 0,
                                                            }}
                                                        >
                                                            <b>Message:</b>{" "}
                                                            <span style={{ fontWeight: 400 }}>{m.message}</span>
                                                        </Typography>
                                                    </Box>
                                                </Stack>
                                            </Paper>
                                        ))}
                                    </Stack>
                                )}
                            </Box>
                        </Paper>
                    </Box>
                </Box >

                <Footer />
            </Box >

            <Menu
                anchorEl={tsAnchorEl}
                open={tsOpen}
                onClose={closeTsMenu}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        border: "1px solid rgba(0,0,0,0.12)",
                        boxShadow: "0 8px 22px rgba(0,0,0,0.12)",
                        px: 0.5,
                        py: 0.6,
                        minWidth: 260,
                    },
                }}
            >
                <Box sx={{ px: 1.2, pb: 0.6 }}>
                    <Typography
                        sx={{
                            fontSize: "0.72rem",
                            fontWeight: 900,
                            letterSpacing: "0.10em",
                            color: "#0d47a1",
                        }}
                    >
                        TIMELINE
                    </Typography>
                </Box>

                <MenuItem disabled sx={{ opacity: 1, alignItems: "flex-start" }}>
                    <ListItemText
                        primaryTypographyProps={{
                            sx: { fontSize: "0.78rem", lineHeight: 1.25, color: "text.secondary" },
                        }}
                        primary={
                            (() => {
                                const currentStep = selectedMsg?.replied_at ? "answered" : "created";

                                const base = { fontSize: "0.78rem", lineHeight: 1.25 };

                                const sxStep = (step: typeof currentStep) => ({
                                    ...base,
                                    fontWeight: currentStep === step ? 900 : 500,
                                    color: currentStep === step ? "rgba(0,0,0,0.92)" : "rgba(0,0,0,0.68)",
                                });

                                return (
                                    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.35 }}>
                                        <Typography sx={sxStep("created")}>
                                            Created: {formatDate(selectedMsg?.created_at ?? null)}
                                        </Typography>

                                        {selectedMsg?.replied_at && (
                                            <Typography sx={sxStep("answered")}>
                                                Answered: {formatDate(selectedMsg.replied_at)}
                                            </Typography>
                                        )}
                                    </Box>
                                );
                            })()
                        }

                    />
                </MenuItem>

                <Box sx={{ px: 1.2, pt: 0.2 }}>
                    <Button
                        fullWidth
                        size="small"
                        onClick={closeTsMenu}
                        sx={{
                            fontWeight: 900,
                            textTransform: "uppercase",
                            letterSpacing: "0.10em",
                            fontSize: "0.72rem",
                        }}
                    >
                        Close
                    </Button>
                </Box>
            </Menu>
        </>
    );
}
