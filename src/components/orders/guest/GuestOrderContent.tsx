import { Box, Stack, Typography } from "@mui/material";

import type { Sale } from "../types";
import GuestOrderCard from "./GuestOrderCard";

type Props = {
    hasSearched: boolean;
    loading: boolean;
    items: Sale[];
    isMobile: boolean;
    onOpenTimeline: (e: React.MouseEvent<HTMLElement>, orderId: number) => void;
    onConfirmReceived: (order: Sale) => void;
    onNotReceivedYet: () => void;
};

export default function GuestOrderContent({
    hasSearched,
    loading,
    items,
    isMobile,
    onOpenTimeline,
    onConfirmReceived,
    onNotReceivedYet,
}: Props) {
    if (isMobile) {
        if (!hasSearched) {
            return (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        px: 1,
                        py: 8,
                        pt: 12,
                    }}
                >
                    <Typography
                        sx={{
                            color: "text.secondary",
                            fontSize: "0.95rem",
                            lineHeight: 1.65,
                        }}
                    >
                        Enter your <b>Order Number</b> and <b>Email</b> to track your order status.
                    </Typography>
                </Box>
            );
        }

        if (loading) {
            return (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        py: 8,
                    }}
                >
                    <Typography sx={{ color: "text.secondary" }}>Loading...</Typography>
                </Box>
            );
        }

        if (items.length === 0) {
            return (
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        px: 1,
                        py: 8,
                    }}
                >
                    <Typography
                        sx={{
                            color: "text.secondary",
                            fontSize: "1rem",
                            textAlign: "center",
                        }}
                    >
                        No matching orders found.
                    </Typography>
                </Box>
            );
        }

        return (
            <Stack spacing={1.4}>
                {items.map((order) => (
                    <GuestOrderCard
                        key={order.id}
                        order={order}
                        onOpenTimeline={onOpenTimeline}
                        onConfirmReceived={onConfirmReceived}
                        onNotReceivedYet={onNotReceivedYet}
                    />
                ))}
            </Stack>
        );
    }

    return (
        <Box
            sx={{
                flex: 1,
                pr: 0.5,
                display: "flex",
                flexDirection: "column",
                minHeight: 0,
            }}
        >
            {!hasSearched ? (
                <Box
                    sx={{
                        flex: 1,
                        display: "flex",
                        alignItems: { xs: "center", md: "flex-start" },
                        justifyContent: "center",
                        px: 3,
                        textAlign: "center",
                        pt: { xs: 2, sm: 2, md: 15 },
                        pb: { xs: 2, sm: 29, md: 2 },
                    }}
                >
                    <Typography
                        sx={{
                            maxWidth: 520,
                            color: "text.secondary",
                            fontSize: "0.95rem",
                            lineHeight: 1.65,
                            textAlign: "center",
                            whiteSpace: { xs: "normal", sm: "nowrap" },
                        }}
                    >
                        Enter your <b>Order Number</b> and <b>Email</b> to track your order status.
                    </Typography>
                </Box>
            ) : loading ? (
                <Box
                    sx={{
                        flex: 1,
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "center",
                        textAlign: "center",
                        pt: { xs: 2, sm: 6, md: 10 },
                    }}
                >
                    <Typography sx={{ color: "text.secondary" }}>Loading...</Typography>
                </Box>
            ) : items.length === 0 ? (
                <Box
                    sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        px: 3,
                        gap: 2,
                        pb: { xs: 15, sm: 13, md: 12 },
                    }}
                >
                    <Typography
                        sx={{
                            color: "text.secondary",
                            fontSize: { xs: "0.98rem", sm: "1.1rem" },
                            textAlign: "center",
                        }}
                    >
                        No matching orders found.
                    </Typography>
                </Box>
            ) : (
                <Box sx={{ flex: 1, overflowY: "auto" }}>
                    <Stack spacing={1.4}>
                        {items.map((order) => (
                            <GuestOrderCard
                                key={order.id}
                                order={order}
                                onOpenTimeline={onOpenTimeline}
                                onConfirmReceived={onConfirmReceived}
                                onNotReceivedYet={onNotReceivedYet}
                            />
                        ))}
                    </Stack>
                </Box>
            )}
        </Box>
    );
}