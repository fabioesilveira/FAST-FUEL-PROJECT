import { Chip } from "@mui/material";

type Props = {
    status: "received" | "in_progress" | "sent" | "completed";
};

const pillChipSx = {
    height: { xs: 20, sm: 22 },
    borderRadius: 999,
    fontWeight: 900,
    letterSpacing: "0.10em",
    fontSize: { xs: "0.62rem", sm: "0.68rem" },
    px: { xs: 0.45, sm: 0.9 },

    "& .MuiChip-label": {
        px: { xs: 0.6, sm: 1 },
        py: 0,
    },
};

export default function AdminOrderStatusChip({ status }: Props) {
    if (status === "received") {
        return (
            <Chip
                label="NEW"
                size="small"
                sx={{
                    ...pillChipSx,
                    bgcolor: "rgba(46, 125, 50, 0.12)",
                    color: "#2e7d32",
                    border: "1px solid rgba(46,125,50,0.18)",
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
                    ...pillChipSx,
                    bgcolor: "rgba(30, 91, 184, 0.12)",
                    color: "#1e5bb8",
                    border: "1px solid rgba(30,91,184,0.18)",
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
                    ...pillChipSx,
                    bgcolor: "rgba(237, 108, 2, 0.12)",
                    color: "#ed6c02",
                    border: "1px solid rgba(237,108,2,0.18)",
                }}
            />
        );
    }

    return (
        <Chip
            label="COMPLETED"
            size="small"
            sx={{
                ...pillChipSx,
                bgcolor: "rgba(0,0,0,0.06)",
                color: "rgba(0,0,0,0.55)",
                border: "1px solid rgba(0,0,0,0.10)",
            }}
        />
    );
}