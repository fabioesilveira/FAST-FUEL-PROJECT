import { Box, Stack, Typography } from "@mui/material";

import type { Sale } from "../types";
import LoggedOrderCard from "./LoggedOrderCard";

type Props = {
    loading: boolean;
    items: Sale[];
    activeKey: "in_progress" | "completed";
    isMobile: boolean;
    onOpenTimeline: (e: React.MouseEvent<HTMLElement>, orderId: number) => void;
    onConfirmReceived: (order: Sale) => void;
    onNotReceivedYet: () => void;
};

function CenterMessage({ children }: { children: React.ReactNode }) {
    return (
        <Box
            sx={{
                flex: 1,
                display: "flex",
                alignItems: { xs: "flex-start", sm: "center" },
                justifyContent: "center",
                px: 3,
                textAlign: "center",
                pt: { xs: 13, sm: 0 },
                pb: { xs: 6, sm: 22, md: 22 },
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
                    fontWeight: 700,
                }}
            >
                {children}
            </Typography>
        </Box>
    );
}

export default function LoggedOrdersContent({
    loading,
    items,
    activeKey,
    isMobile,
    onOpenTimeline,
    onConfirmReceived,
    onNotReceivedYet,
}: Props) {
    if (isMobile) {
        return (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
                {loading ? (
                    <CenterMessage>Loading...</CenterMessage>
                ) : items.length === 0 ? (
                    <CenterMessage>No orders found.</CenterMessage>
                ) : (
                    <Stack spacing={1.2}>
                        {items.map((order) => (
                            <LoggedOrderCard
                                key={order.id}
                                order={order}
                                activeKey={activeKey}
                                isMobile={isMobile}
                                onOpenTimeline={onOpenTimeline}
                                onConfirmReceived={onConfirmReceived}
                                onNotReceivedYet={onNotReceivedYet}
                            />
                        ))}
                    </Stack>
                )}
            </Box>
        );
    }

    return (
        <Box
            sx={{
                flex: 1,
                overflowY: "auto",
                pr: 0.5,
                display: "flex",
                flexDirection: "column",
            }}
        >
            {loading ? (
                <CenterMessage>Loading...</CenterMessage>
            ) : items.length === 0 ? (
                <CenterMessage>No orders found.</CenterMessage>
            ) : (
                <Stack spacing={1.4}>
                    {items.map((order) => (
                        <LoggedOrderCard
                            key={order.id}
                            order={order}
                            activeKey={activeKey}
                            isMobile={isMobile}
                            onOpenTimeline={onOpenTimeline}
                            onConfirmReceived={onConfirmReceived}
                            onNotReceivedYet={onNotReceivedYet}
                        />
                    ))}
                </Stack>
            )}
        </Box>
    );
}