import { useMemo } from "react";
import { type Meal } from "../context/context";

const TAX_RATE = 0.09;
const DELIVERY_FEE = 9.99;
const FREE_DELIVERY_AT = 30;

function money(n: number) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(n);
}

export function useCheckoutTotals(order: Meal[]) {
    const { subtotal, discount, total, totalItems } = useMemo(() => {
        let burgerCount = 0;
        let sideCount = 0;
        let beverageCount = 0;
        let subtotalCalc = 0;

        order.forEach((item) => {
            const qty = Number(item.quantidade ?? 1);
            const price = Number(item.price ?? 0);
            const category = String(item.category || "").toLowerCase();

            subtotalCalc += qty * price;

            if (category === "sandwiches") burgerCount += qty;
            else if (category === "sides") sideCount += qty;
            else if (category === "beverages") beverageCount += qty;
        });

        const sets = Math.min(burgerCount, sideCount, beverageCount);
        const discountCalc = sets * 2;
        const totalCalc = Math.max(0, subtotalCalc - discountCalc);

        const itemsCount = order.reduce(
            (sum, it) => sum + Number(it.quantidade ?? 1),
            0
        );

        return {
            subtotal: subtotalCalc,
            discount: discountCalc,
            total: totalCalc,
            totalItems: itemsCount,
        };
    }, [order]);

    const tax = useMemo(() => Number((total * TAX_RATE).toFixed(2)), [total]);

    const deliveryFee = useMemo(() => {
        if (total <= 0) return 0;
        return total >= FREE_DELIVERY_AT ? 0 : DELIVERY_FEE;
    }, [total]);

    const grandTotal = useMemo(
        () => Number((total + tax + deliveryFee).toFixed(2)),
        [total, tax, deliveryFee]
    );

    return {
        subtotal,
        discount,
        total,
        totalItems,
        tax,
        deliveryFee,
        grandTotal,

        subtotalLabel: money(subtotal),
        discountLabel: money(discount),
        taxLabel: money(tax),
        deliveryLabel: money(deliveryFee),
        grandTotalLabel: money(grandTotal),
    };
}