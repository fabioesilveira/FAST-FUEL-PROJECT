import { useEffect, useMemo, useState, useRef, type MouseEvent } from "react";
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
    Button,
    PaginationItem,
} from "@mui/material";
import NavbarAdmin from "../../components/layout/navbar/NavbarAdmin";
import Footer from "../../components/layout/footer/Footer";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import ProductsTitleBar from "../../components/TitleBar";
import AdminMessageTimelineMenu from "../../components/admin/messages/AdminMessageTimelineMenu";
import AdminMessageCard from "../../components/admin/messages/AdminMessageCard";

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

export default function AdminMessages() {
    useDocumentTitle("FastFuel • Adm - Messages");

    const [activeKey, setActiveKey] = useState<"received" | "answered" | "contact">("received");
    const [emailFilter, setEmailFilter] = useState("");
    const [items, setItems] = useState<ContactMsg[]>([]);
    const [loading, setLoading] = useState(false);

    const [tsAnchorEl, setTsAnchorEl] = useState<null | HTMLElement>(null);
    const [tsMsgId, setTsMsgId] = useState<number | null>(null);

    const MESSAGES_PER_PAGE = 15;
    const [page, setPage] = useState(1);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const tsOpen = Boolean(tsAnchorEl);
    const selectedMsg = items.find((x) => x.id === tsMsgId);

    const pageCount = Math.ceil(items.length / MESSAGES_PER_PAGE);

    const paginatedItems = items.slice(
        (page - 1) * MESSAGES_PER_PAGE,
        page * MESSAGES_PER_PAGE
    );

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

    function getVisiblePages() {
        const start = page < 3 ? 1 : page;
        const end = Math.min(start + 2, pageCount);

        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }

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

    useEffect(() => {
        setPage(1);
    }, [activeKey, emailFilter]);


    async function markAsAnswered(id: number) {
        try {
            await api.patch(`${API}/${id}/reply`);
            setItems((prev) => prev.filter((m) => m.id !== id));
        } catch (e) {
            console.error(e);
            alert("Failed to mark as answered");
        }
    }

    if (isMobile) {
        return (
            <>
                <NavbarAdmin />
                <ProductsTitleBar title="Messages" />

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
                            pb: "calc(85px + env(safe-area-inset-bottom))",
                            flex: 1,
                        }}
                    >
                        <Tabs
                            id="ff-admin-tabs-mobile"
                            activeKey={activeKey}
                            onSelect={(k) => {
                                if (!k) return;
                                setActiveKey(k as any);
                            }}
                            className="ff-tabs"
                            fill
                        >
                            <Tab eventKey="received" title="Received" />
                            <Tab eventKey="answered" title="Answered" />
                            <Tab eventKey="contact" title="Contact-us" disabled />
                        </Tabs>

                        <Box sx={{ mt: 1.5 }}>
                            <TextField
                                size="small"
                                label="Filter by email"
                                value={emailFilter}
                                onChange={(e) => setEmailFilter(e.target.value)}
                                sx={tfBlueLabelSx}
                                fullWidth
                            />
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
                                    No messages found.
                                </Typography>
                            </Box>
                        ) : (
                            <Stack spacing={1.2}>
                                {paginatedItems.map((m) => (
                                    <AdminMessageCard
                                        key={m.id}
                                        message={m}
                                        activeKey={activeKey}
                                        onOpenTimeline={openTsMenu}
                                        onMarkAsAnswered={markAsAnswered}
                                    />
                                ))}
                                {pageCount > 1 && (
                                    <Box sx={{ display: "flex", justifyContent: "center", pt: 1.5, pb: 0 }}>
                                        <Stack direction="row" spacing={0.5} alignItems="center">
                                            <PaginationItem type="first" page={1} disabled={page === 1} onClick={() => setPage(1)} />

                                            <PaginationItem
                                                type="previous"
                                                page={page - 1}
                                                disabled={page === 1}
                                                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                                            />

                                            {getVisiblePages().map((pageNumber, index) => {
                                                const isLastVisible =
                                                    index === getVisiblePages().length - 1 &&
                                                    pageNumber < pageCount;

                                                return (
                                                    <Button
                                                        key={pageNumber}
                                                        onClick={() => setPage(pageNumber)}
                                                        sx={{
                                                            minWidth: 32,
                                                            minHeight: 32,
                                                            borderRadius: "50%",
                                                            color: "#0d47a1",
                                                            fontWeight: 800,
                                                            px: 0,
                                                            ...(pageNumber === page && {
                                                                bgcolor: "rgba(230,81,0,0.18)",
                                                            }),
                                                        }}
                                                    >
                                                        {isLastVisible ? `${pageNumber}..` : pageNumber}
                                                    </Button>
                                                );
                                            })}

                                            <PaginationItem
                                                type="next"
                                                page={page + 1}
                                                disabled={page === pageCount}
                                                onClick={() => setPage((prev) => Math.min(prev + 1, pageCount))}
                                            />

                                            <PaginationItem type="last" page={pageCount} disabled={page === pageCount} onClick={() => setPage(pageCount)} />
                                        </Stack>
                                    </Box>
                                )}
                            </Stack>
                        )}
                    </Box>

                    <Footer />
                </Box>

                <AdminMessageTimelineMenu
                    anchorEl={tsAnchorEl}
                    open={tsOpen}
                    onClose={closeTsMenu}
                    message={selectedMsg}
                />
            </>
        );
    }

    return (
        <>
            <NavbarAdmin />
            <ProductsTitleBar title="Messages" />

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
                                mt: { sm: 5, md: 2.2 },
                                mb: { md: 1 },
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                                overflow: "hidden",
                            }}
                        >


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
                                        {paginatedItems.map((m) => (
                                            <AdminMessageCard
                                                key={m.id}
                                                message={m}
                                                activeKey={activeKey}
                                                onOpenTimeline={openTsMenu}
                                                onMarkAsAnswered={markAsAnswered}
                                            />
                                        ))}
                                        {pageCount > 1 && (
                                            <Box sx={{ display: "flex", justifyContent: "center", pt: 1.5, pb: 1 }}>
                                                <Stack direction="row" spacing={0.5} alignItems="center">
                                                    <PaginationItem type="first" page={1} disabled={page === 1} onClick={() => setPage(1)} />

                                                    <PaginationItem
                                                        type="previous"
                                                        page={page - 1}
                                                        disabled={page === 1}
                                                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                                                    />

                                                    {getVisiblePages().map((pageNumber, index) => {
                                                        const isLastVisible =
                                                            index === getVisiblePages().length - 1 &&
                                                            pageNumber < pageCount;

                                                        return (
                                                            <Button
                                                                key={pageNumber}
                                                                onClick={() => setPage(pageNumber)}
                                                                sx={{
                                                                    minWidth: 32,
                                                                    minHeight: 32,
                                                                    borderRadius: "50%",
                                                                    color: "#0d47a1",
                                                                    fontWeight: 800,
                                                                    px: 0,
                                                                    ...(pageNumber === page && {
                                                                        bgcolor: "rgba(230,81,0,0.18)",
                                                                    }),
                                                                }}
                                                            >
                                                                {isLastVisible ? `${pageNumber}..` : pageNumber}
                                                            </Button>
                                                        );
                                                    })}

                                                    <PaginationItem
                                                        type="next"
                                                        page={page + 1}
                                                        disabled={page === pageCount}
                                                        onClick={() => setPage((prev) => Math.min(prev + 1, pageCount))}
                                                    />

                                                    <PaginationItem type="last" page={pageCount} disabled={page === pageCount} onClick={() => setPage(pageCount)} />
                                                </Stack>
                                            </Box>
                                        )}
                                    </Stack>
                                )}
                            </Box>
                        </Paper>
                    </Box>
                </Box >

                <Footer />
            </Box >

            <AdminMessageTimelineMenu
                anchorEl={tsAnchorEl}
                open={tsOpen}
                onClose={closeTsMenu}
                message={selectedMsg}
            />
        </>
    );
}
