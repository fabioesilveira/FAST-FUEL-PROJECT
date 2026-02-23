import { useEffect, useMemo, useState, useRef } from "react";
import { api } from "../../api";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import { Box, Paper, Typography, TextField, Button, Stack, Chip, Divider } from "@mui/material";
import NavbarAdmin from "../../components/NavbarAdmin";
import Footer from "../../components/Footer";

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

export default function AdminMessages() {
    const [activeKey, setActiveKey] = useState<"received" | "answered" | "contact">("received");
    const [emailFilter, setEmailFilter] = useState("");
    const [items, setItems] = useState<ContactMsg[]>([]);
    const [loading, setLoading] = useState(false);

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

        // evita chamadas simultâneas tira piscadas/duplicação)
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

                            display: { xs: "none", sm: "block" },

                            position: "absolute",
                            top: 0,
                            bottom: 0,
                            left: "50%",
                            transform: "translateX(-50%)",
                            zIndex: 0,

                            width: {
                                sm: "min(96vw, 1040px)",
                                md: 1300,
                            },
                            borderRadius: 20,
                            pointerEvents: "none",

                            backgroundImage: `
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
                                    fontSize: "2.3rem",
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
                                sx={{ mt: { xs: -4, sm: 0 } }}
                            >
                                <Chip
                                    label={activeKey === "answered" ? "Answered" : "Received"}
                                    size="small"
                                    sx={{
                                        display: { xs: "none", sm: "inline-flex" },
                                        fontSize: "0.72rem",
                                        letterSpacing: "0.1em",
                                        textTransform: "uppercase",
                                        bgcolor: "#1e5bb8",
                                        color: "#fff",
                                        fontWeight: 800,
                                        alignSelf: { xs: "flex-start", sm: "center" },
                                    }}
                                />

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
                                    <Typography align="center" sx={{ color: "text.secondary", mt: 3 }}>
                                        Loading...
                                    </Typography>
                                ) : items.length === 0 ? (
                                    <Typography align="center" sx={{ color: "text.secondary", mt: 3 }}>
                                        No messages found.
                                    </Typography>
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
                                                <Stack spacing={0.55}>
                                                    {/* TOP LINE: título + ação (alinhados na mesma altura) */}
                                                    <Stack
                                                        direction="row"
                                                        justifyContent="space-between"
                                                        alignItems="center"
                                                        gap={1}
                                                        sx={{ width: "100%" }}
                                                    >
                                                        <Typography
                                                            sx={{
                                                                fontWeight: 900,
                                                                color: "#e65100",
                                                                fontSize: "0.98rem",
                                                                lineHeight: 1.15,
                                                            }}
                                                            noWrap
                                                        >
                                                            #{m.id} — {m.subject}
                                                        </Typography>

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
                                                                    letterSpacing: "0.10em",

                                                                    fontSize: { xs: "0.70rem", sm: "0.78rem" },
                                                                    px: { xs: 1.3, sm: 1.9 },
                                                                    py: { xs: 0.55, sm: 0.8 },
                                                                    minHeight: { xs: 32, sm: 34 },

                                                                    "&:hover": { bgcolor: "#164a96" },
                                                                    flexShrink: 0,
                                                                }}
                                                            >
                                                                Mark answered
                                                            </Button>
                                                        ) : (
                                                            <Chip
                                                                label="Answered"
                                                                size="small"
                                                                sx={{
                                                                    bgcolor: "rgba(30, 91, 184, 0.12)",
                                                                    color: "#1e5bb8",
                                                                    fontWeight: 900,
                                                                    flexShrink: 0,
                                                                }}
                                                            />
                                                        )}
                                                    </Stack>

                                                    <Typography sx={{ color: "text.secondary", fontSize: "0.78rem", lineHeight: 1.25 }}>
                                                        Sent: {formatDate(m.created_at)}
                                                        {m.replied_at ? ` • Answered: ${formatDate(m.replied_at)}` : ""}
                                                    </Typography>

                                                    <Typography
                                                        sx={{
                                                            fontSize: "0.88rem",
                                                            lineHeight: 1.25,
                                                            mt: 0.5,
                                                        }}
                                                    >
                                                        <b>{m.name}</b> • {m.email}
                                                        {m.phone ? ` • ${m.phone}` : ""}
                                                        {m.orderNumber ? ` • Order: ${m.orderNumber}` : ""}
                                                    </Typography>


                                                    <Typography
                                                        sx={{
                                                            color: "#333",
                                                            fontSize: "0.90rem",
                                                            lineHeight: 1.45,
                                                            mt: 0.35,
                                                            fontWeight: 600,
                                                            whiteSpace: "pre-wrap",
                                                            overflowWrap: "anywhere",
                                                        }}
                                                    >
                                                        {m.message}
                                                    </Typography>
                                                </Stack>
                                            </Paper>

                                        ))}
                                    </Stack>
                                )}
                            </Box>
                        </Paper>
                    </Box>
                </Box>

                <Footer />
            </Box>
        </>
    );
}
