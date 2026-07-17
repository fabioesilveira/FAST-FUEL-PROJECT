import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { Meal } from "../../context/context";
import HomeMiniCard from "./HomeMiniCard";
import HomeMiniCardMobile from "./HomeMiniCardMobile";

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
            <Typography
                align="center"
                sx={{
                    mb: { xs: 3.5, md: 3.2 },
                    mt: { xs: 8.1, sm: -1, md: -2.8 },
                    fontFamily: "Titan One",
                    fontSize: { xs: "22px", sm: "24px", md: "27px" },
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "#ff8a4c",
                    textShadow: "0 1px 2px rgba(30, 91, 184, 0.35)",
                    opacity: 0.95,
                }}
            >
                Click to add menu
            </Typography>

            <h2 className="h2-driveMode-desk">
                *Search by name or category, or browse the products page for full details.
            </h2>

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
        </Box>
    );
}