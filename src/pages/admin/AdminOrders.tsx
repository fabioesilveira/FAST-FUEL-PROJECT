import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Chip,
  Divider,
} from "@mui/material";
import NavbarAdmin from "../../components/NavbarAdmin";
import Footer from "../../components/Footer";

type Sale = {
  id: number;
  order_code: string;
  user_id: number | null;

  customer_name: string | null;
  customer_email: string | null;

  items: any; // vem JSON do MySQL (às vezes string)
  subtotal: number;
  discount: number;
  total: number;

  status: "received" | "in_progress" | "sent" | "completed";

  accepted_at: string | null;
  sent_at: string | null;
  received_confirmed_at: string | null;

  created_at: string;
  updated_at: string;
};

const API = "http://localhost:3000/sales";

function formatDate(iso: string | null) {
  if (!iso) return "-";
  return new Date(iso).toLocaleString();
}

function safeParseItems(items: any) {
  try {
    if (typeof items === "string") return JSON.parse(items);
    return items ?? [];
  } catch {
    return [];
  }
}

export default function AdminOrders() {
  const [activeKey, setActiveKey] = useState<
    "received" | "in_progress" | "completed"
  >("received");

  const [orderCodeFilter, setOrderCodeFilter] = useState("");
  const [items, setItems] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(false);

  const statusQuery =
    activeKey === "completed" ? "completed" : activeKey; // igual

  const queryUrl = useMemo(() => {
    const params = new URLSearchParams();
    params.set("status", statusQuery);

    if (orderCodeFilter.trim()) params.set("order_code", orderCodeFilter.trim());

    return `${API}?${params.toString()}`;
  }, [statusQuery, orderCodeFilter]);

  async function fetchOrders() {
    setLoading(true);
    try {
      const res = await axios.get<Sale[]>(queryUrl);
      setItems(res.data);
    } catch (e) {
      console.error(e);
      alert("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryUrl]);

  async function updateStatus(id: number, status: "in_progress" | "sent") {
    try {
      await axios.patch(`${API}/${id}/status`, { status });

      // remove da lista atual (pra “migrar” de tab)
      setItems((prev) => prev.filter((o) => o.id !== id));
    } catch (e) {
      console.error(e);
      alert("Failed to update order status");
    }
  }

  function statusChip(status: Sale["status"]) {
    if (status === "received") {
      return (
        <Chip
          label="NEW"
          size="small"
          sx={{
            bgcolor: "rgba(46, 125, 50, 0.12)",
            color: "#2e7d32",
            fontWeight: 900,
            letterSpacing: "0.10em",
          }}
        />
      );
    }

    if (status === "in_progress") {
      return (
        <Chip
          label="IN PROGRESS"
          size="small"
          sx={{
            bgcolor: "rgba(30, 91, 184, 0.12)",
            color: "#1e5bb8",
            fontWeight: 900,
            letterSpacing: "0.10em",
          }}
        />
      );
    }

    if (status === "sent") {
      return (
        <Chip
          label="SENT"
          size="small"
          sx={{
            bgcolor: "rgba(237, 108, 2, 0.12)",
            color: "#ed6c02",
            fontWeight: 900,
            letterSpacing: "0.10em",
          }}
        />
      );
    }

    return (
      <Chip
        label="COMPLETED"
        size="small"
        sx={{
          bgcolor: "rgba(0,0,0,0.10)",
          color: "#333",
          fontWeight: 900,
          letterSpacing: "0.10em",
        }}
      />
    );
  }

  return (
    <>
      <NavbarAdmin />

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
              maxWidth: { xs: 520, md: 980 },
              borderRadius: 3,
              border: "1.5px solid rgba(230, 81, 0, 0.35)",
              bgcolor: "background.paper",
              p: { xs: 2.5, md: 4 },
              height: { xs: "calc(100dvh - 200px)", md: "calc(100vh - 220px)" },
              maxHeight: 720,
              boxShadow:
                "0 4px 14px rgba(230, 81, 0, 0.35), 0 8px 24px rgba(230, 81, 0, 0.25)",
              display: "flex",
              flexDirection: "column",
              gap: 2,
              overflow: "hidden",
            }}
          >
            <Typography
              variant="h4"
              align="center"
              sx={{
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#e65100",
                fontWeight: 800,
                textShadow: "1px 1px 0 rgba(230, 81, 0, 0.20)",
              }}
            >
              Orders
            </Typography>

            {/* Tabs */}
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

            {/* Filter */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.2}
              alignItems={{ xs: "stretch", sm: "center" }}
              justifyContent="space-between"
            >
              <Chip
                label={activeKey.replace("_", " ").toUpperCase()}
                size="small"
                sx={{
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
                label="Filter by Order Code"
                value={orderCodeFilter}
                onChange={(e) => setOrderCodeFilter(e.target.value)}
                sx={{ width: { xs: "100%", sm: 320 } }}
              />
            </Stack>

            <Divider />

            {/* LIST */}
            <Box sx={{ flex: 1, overflowY: "auto", pr: 0.5 }}>
              {loading ? (
                <Typography align="center" sx={{ color: "text.secondary", mt: 3 }}>
                  Loading...
                </Typography>
              ) : items.length === 0 ? (
                <Typography align="center" sx={{ color: "text.secondary", mt: 3 }}>
                  No orders found.
                </Typography>
              ) : (
                <Stack spacing={1.4}>
                  {items.map((o) => {
                    const cart = safeParseItems(o.items);
                    const count =
                      Array.isArray(cart)
                        ? cart.reduce((sum, it) => sum + (it.quantidade ?? it.quantity ?? 1), 0)
                        : 0;

                    return (
                      <Paper
                        key={o.id}
                        elevation={0}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          border: "1px solid rgba(230, 81, 0, 0.28)",
                          bgcolor: "#fff4e1",
                        }}
                      >
                        <Stack spacing={1}>
                          <Stack
                            direction={{ xs: "column", sm: "row" }}
                            justifyContent="space-between"
                            alignItems={{ xs: "flex-start", sm: "center" }}
                            gap={1}
                          >
                            <Box>
                              <Typography sx={{ fontWeight: 900, color: "#e65100" }}>
                                #{o.id} — Order {o.order_code}
                              </Typography>

                              <Typography sx={{ fontSize: "0.9rem" }}>
                                <b>{o.customer_name ?? "Guest"}</b>
                                {o.customer_email ? ` • ${o.customer_email}` : ""}
                                {o.user_id ? ` • User ID: ${o.user_id}` : " • Guest"}
                                {count ? ` • Items: ${count}` : ""}
                              </Typography>
                            </Box>

                            <Stack direction="row" spacing={1} alignItems="center">
                              {statusChip(o.status)}

                              {activeKey === "received" && (
                                <Button
                                  variant="contained"
                                  onClick={() => updateStatus(o.id, "in_progress")}
                                  sx={{
                                    borderRadius: 2,
                                    bgcolor: "#1e5bb8",
                                    color: "#fff",
                                    fontWeight: 900,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.10em",
                                    "&:hover": { bgcolor: "#164a96" },
                                  }}
                                >
                                  Accept
                                </Button>
                              )}

                              {activeKey === "in_progress" && (
                                <Button
                                  variant="contained"
                                  onClick={() => updateStatus(o.id, "sent")}
                                  sx={{
                                    borderRadius: 2,
                                    bgcolor: "#1e5bb8",
                                    color: "#fff",
                                    fontWeight: 900,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.10em",
                                    "&:hover": { bgcolor: "#164a96" },
                                  }}
                                >
                                  Mark sent
                                </Button>
                              )}
                            </Stack>
                          </Stack>

                          <Typography sx={{ color: "text.secondary", fontSize: "0.82rem" }}>
                            Created: {formatDate(o.created_at)}
                            {o.accepted_at ? ` • Accepted: ${formatDate(o.accepted_at)}` : ""}
                            {o.sent_at ? ` • Sent: ${formatDate(o.sent_at)}` : ""}
                            {o.received_confirmed_at
                              ? ` • Received: ${formatDate(o.received_confirmed_at)}`
                              : ""}
                          </Typography>

                          <Typography sx={{ fontWeight: 900, color: "#333" }}>
                            Total: ${Number(o.total).toFixed(2)}
                            {Number(o.discount) > 0
                              ? ` (Discount: -$${Number(o.discount).toFixed(2)})`
                              : ""}
                          </Typography>
                        </Stack>
                      </Paper>
                    );
                  })}
                </Stack>
              )}
            </Box>
          </Paper>
        </Box>

        <Footer />
      </Box>
    </>
  );
}
