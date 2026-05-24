import {
    Box,
    Button,
    Paper,
    Stack,
    Typography,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { formatPhoneUS } from "./adminMessagesUtils";

type ContactMsg = {
    id: number;
    name: string;
    email: string;
    orderNumber: number;
    phone: string | null;
    subject: string;
    message: string;
    replied_at: string | null;
};

type Props = {
    message: ContactMsg;

    activeKey: "received" | "answered" | "contact";

    onOpenTimeline: (
        e: React.MouseEvent<HTMLElement>,
        msgId: number
    ) => void;

    onMarkAsAnswered: (id: number) => void;
};

export default function AdminMessageCard({
    message: m,
    activeKey,
    onOpenTimeline,
    onMarkAsAnswered,
}: Props) {
    return (
        <Paper
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
                            fontSize: { xs: 17, md: 18 },
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
                                onClick={() => onMarkAsAnswered(m.id)}
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
                                    "&:hover": {
                                        bgcolor: "#164a96",
                                    },
                                }}
                            >
                                Mark answered
                            </Button>
                        ) : (
                            <Typography
                                sx={{
                                    display: {
                                        xs: "none",
                                        sm: "inline-flex",
                                    },

                                    alignItems: "center",
                                    justifyContent: "center",

                                    fontSize: {
                                        xs: "0.62rem",
                                        sm: "0.68rem",
                                    },

                                    letterSpacing: "0.08em",
                                    textTransform: "uppercase",
                                    fontWeight: 900,

                                    color: "rgba(0,0,0,0.45)",
                                    bgcolor: "rgba(0,0,0,0.06)",

                                    px: { xs: 0.45, sm: 0.9 },
                                    py: 0,

                                    minWidth: {
                                        xs: 92,
                                        sm: 105,
                                    },

                                    height: {
                                        xs: 22,
                                        sm: 25,
                                    },

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
                            onClick={(e) => onOpenTimeline(e, m.id)}
                            endIcon={
                                <ExpandMoreIcon
                                    sx={{
                                        fontSize: {
                                            xs: 16,
                                            sm: 18,
                                        },
                                    }}
                                />
                            }
                            sx={{
                                minHeight: {
                                    xs: 20,
                                    sm: 22,
                                },

                                minWidth: "auto",

                                px: {
                                    xs: 0.4,
                                    sm: 1,
                                },

                                py: 0,

                                fontSize: {
                                    xs: "0.64rem",
                                    sm: "0.72rem",
                                },

                                letterSpacing: {
                                    xs: "0.06em",
                                    sm: "0.08em",
                                },

                                textTransform: "uppercase",
                                fontWeight: 900,
                                color: "rgba(0,0,0,0.65)",

                                "& .MuiButton-endIcon": {
                                    marginLeft: {
                                        xs: "2px",
                                        sm: "3px",
                                    },

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
                                    display: {
                                        xs: "none",
                                        sm: "block",
                                    },

                                    fontSize: "0.88rem",
                                    lineHeight: 1.25,

                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                }}
                                title={`${m.name} • ${m.email} • Phone: ${formatPhoneUS(m.phone)}${m.orderNumber
                                    ? ` • Order: ${m.orderNumber}`
                                    : ""
                                    }`}
                            >
                                <b>{m.name}</b> • {m.email} {" "}•{" "}

                                <span
                                    style={{
                                        color: "rgba(0,0,0,0.68)",
                                    }}
                                >
                                    Phone:
                                </span>{" "}

                                {formatPhoneUS(m.phone)}

                                {m.orderNumber
                                    ? ` • Order: ${m.orderNumber}`
                                    : ""}
                            </Typography>

                            {/* mobile */}
                            <Box
                                sx={{
                                    display: {
                                        xs: "block",
                                        sm: "none",
                                    },
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: "0.88rem",
                                        lineHeight: 1.25,
                                    }}
                                >
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
                                    <span
                                        style={{
                                            color: "rgba(0,0,0,0.68)",
                                        }}
                                    >
                                        Phone:
                                    </span>{" "}

                                    {formatPhoneUS(m.phone)}

                                    {m.orderNumber
                                        ? ` • Order: ${m.orderNumber}`
                                        : ""}
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
                            lineHeight: 1.38,
                            whiteSpace: "pre-wrap",
                            overflowWrap: "anywhere",
                            mt: 0,
                        }}
                    >
                        <b>Message:</b>{" "}

                        <span
                            style={{
                                fontWeight: 400,
                            }}
                        >
                            {m.message}
                        </span>
                    </Typography>
                </Box>
            </Stack>
        </Paper>
    );
}