import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { Meal } from "../../context/context";
import HomeMiniCard from "./HomeMiniCard";

type Props = {
    driveModeActive: boolean;
    fastThruData: Meal[];
    qtyMap: Record<string, number>;
    cleanProductName: (name: string) => string;
    onOrder: (product: Meal) => void;
    onRemoveItem: (productId: string) => void;
};

export default function HomeFastThruSection({
    driveModeActive,
    fastThruData,
    qtyMap,
    cleanProductName,
    onOrder,
    onRemoveItem,
}: Props) {
    if (!driveModeActive) return null;

    return (
        <Box sx={{ mb: { xs: 1.5, md: 2 } }}>
            <Typography
                align="center"
                sx={{
                    mb: { xs: 3, md: 3 },
                    mt: { xs: -2.5, md: -4 },
                    fontFamily: "Titan One",
                    fontSize: { xs: "28px", md: "37px" },
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "#ff8a4c",
                    textShadow: "0 1px 3px rgba(30, 91, 184, 0.35)",
                    opacity: 0.95,
                }}
            >
                Quick add menu
            </Typography>

            <h2 className="h2-driveMode-desk">
                *Search by name or category, or browse the products page for full details.
            </h2>

            <Box
                sx={{
                    display: "grid",
                    gap: 2,
                    justifyContent: "center",
                    gridTemplateColumns: {
                        xs: "repeat(2, 143px)",
                        sm: "repeat(3, 143px)",
                        lg: "repeat(6, 143px)",
                    },
                }}
            >
                {fastThruData.map((product) => {
                    const pid = String(product.id);

                    return (
                        <HomeMiniCard
                            key={pid}
                            id={pid}
                            image={product.image}
                            title={cleanProductName(product.name)}
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