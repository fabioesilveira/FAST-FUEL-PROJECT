import Box from "@mui/material/Box";
import type { Meal } from "../../context/context";
import HomeMiniCard from "./HomeMiniCard";
import HomeMiniCardMobile from "./HomeMiniCardMobile";
import { Divider, Typography } from "@mui/material";

const mobileProductNames: Record<string, string> = {
    "1": "Pit Stop",
    "2": "Turbo Bacon",
    "3": "Double Gear",
    "4": "Monster",
    "11": "Fries",
    "12": "Onion Rings",
    "13": "Salad",
    "14": "Cheese Sticks",
    "15": "Milkshake",
    "16": "Sundae",
    "17": "Cookies",
};

type Props = {
    isMobile: boolean;
    driveModeActive: boolean;
    fastThruData: Meal[];
    qtyMap: Record<string, number>;
    cleanProductName: (name: string) => string;
    onOrder: (product: Meal) => void;
    onRemoveItem: (productId: string) => void;
};

export default function HomeFastThruSection({
    isMobile,
    driveModeActive,
    fastThruData,
    qtyMap,
    cleanProductName,
    onOrder,
    onRemoveItem,
}: Props) {
    if (!driveModeActive) return null;

    const MiniCard = isMobile
        ? HomeMiniCardMobile
        : HomeMiniCard;

    return (
        <Box sx={{ mb: { xs: 1.5, md: 2 } }}>
            <Box
                sx={{
                    width: {
                        xs: "calc(100% - 32px)",
                        sm: "calc(100% - 48px)",
                    },

                    maxWidth: {
                        xs: 430,
                        sm: 938,
                    },

                    mx: "auto",
                    mb: { xs: 2, md: 1.3 },

                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                }}
            >
                <Divider
                    sx={{
                        width: {
                            xs: 20,
                            sm: 28,
                        },
                        flexShrink: 0,
                        borderColor: "rgba(13,71,161,.18)",
                    }}
                />

                <Typography
                    sx={{
                        fontSize: {
                            xs: "0.75rem",
                            sm: "0.78rem",
                        },
                        fontWeight: 800,
                        letterSpacing: "0.12em",
                        color: "#0d47a1",
                        textTransform: "uppercase",
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                    }}
                >
                    Menu
                </Typography>

                <Divider
                    sx={{
                        flex: 1,
                        minWidth: 0,
                        borderColor: "rgba(13,71,161,.18)",
                    }}
                />
            </Box>
            <Box
                sx={{
                    display: "grid",
                    justifyContent: "center",
                    width: "100%",
                    mx: "auto",

                    gridTemplateColumns: {
                        xs: "repeat(3, minmax(0, 1fr))",
                        sm: "repeat(3, 143px)",
                        lg: "repeat(6, 143px)",
                    },

                    columnGap: {
                        xs: "clamp(8px, 2.5vw, 14px)",
                        sm: 2,
                    },

                    rowGap: {
                        xs: 1.5,
                        sm: 2,
                    },

                    maxWidth: {
                        xs: 430,
                        sm: "none",
                    },

                    px: {
                        xs: 0.5,
                        sm: 0,
                    },
                }}
            >
                {fastThruData.map((product) => {
                    const pid = String(product.id);

                    return (
                        <MiniCard
                            key={pid}
                            id={pid}
                            image={product.image}
                            title={
                                isMobile
                                    ? mobileProductNames[pid] ?? cleanProductName(product.name)
                                    : cleanProductName(product.name)
                            }

                            secondaryLabel={`$${Number(product.price).toFixed(2)}`}
                            count={qtyMap[pid] ?? 0}
                            onClick={() => onOrder(product)}
                            onRemove={() => onRemoveItem(pid)}
                        />
                    );
                })}
            </Box>
            <Box
                sx={{
                    mt: { xs: 3, md: 4.5 },
                    mb: { xs: -1, md: -4.7 },
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <Typography
                    sx={{
                        color: "#e65100",
                        fontSize: "0.82rem",
                        fontWeight: 700,
                        letterSpacing: "0.05em",
                        opacity: 0.9,
                    }}
                >
                    © 2026 Fast Fuel. All rights reserved.
                </Typography>
            </Box>
        </Box>
    );
}