import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from "react";
import type { Meal } from "../context/context";

type UseHomeCartParams = {
    order: Meal[];
    setOrder: Dispatch<SetStateAction<Meal[]>>;
};

export function useHomeCart({ order, setOrder }: UseHomeCartParams) {
    const [subtotal, setSubtotal] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [checkout, setCheckout] = useState(0);

    const cartCount = useMemo(() => {
        return order.reduce((acc, it) => acc + (it.quantidade ?? 1), 0);
    }, [order]);

    const qtyMap = useMemo(() => {
        return order.reduce<Record<string, number>>((acc, item) => {
            const pid = String(item.id);
            const q = item.quantidade ?? 1;
            acc[pid] = (acc[pid] ?? 0) + q;
            return acc;
        }, {});
    }, [order]);

    function handleOrder(product: Meal) {
        setOrder((prev) => {
            const existingIndex = prev.findIndex(
                (p) => String(p.id) === String(product.id)
            );

            if (existingIndex === -1) {
                return [
                    ...prev,
                    {
                        ...product,
                        quantidade: 1,
                    },
                ];
            }

            const newOrder = [...prev];
            const currentQty = newOrder[existingIndex].quantidade ?? 0;

            newOrder[existingIndex] = {
                ...newOrder[existingIndex],
                quantidade: currentQty + 1,
            };

            return newOrder;
        });
    }

    function decItem(productId: string) {
        setOrder((prev) => {
            const existing = prev.find((p) => String(p.id) === productId);
            if (!existing) return prev;

            const q = existing.quantidade ?? 0;

            if (q <= 1) {
                return prev.filter((p) => String(p.id) !== productId);
            }

            return prev.map((p) =>
                String(p.id) === productId
                    ? { ...p, quantidade: (p.quantidade ?? 0) - 1 }
                    : p
            );
        });
    }

    function removeItem(productId: string) {
        setOrder((prev) => prev.filter((p) => String(p.id) !== productId));
    }

    useEffect(() => {
        let burgerCount = 0;
        let sideCount = 0;
        let beverageCount = 0;
        let subtotalCalc = 0;

        order.forEach((item) => {
            const quantity = item.quantidade ?? 0;
            const price = Number(item.price ?? 0);
            const category = (item.category || "").toLowerCase();

            subtotalCalc += quantity * price;

            if (category === "sandwiches") burgerCount += quantity;
            else if (category === "sides") sideCount += quantity;
            else if (category === "beverages") beverageCount += quantity;
        });

        const sets = Math.min(burgerCount, sideCount, beverageCount);
        const discountCalc = sets * 2;
        const base = Math.max(0, subtotalCalc - discountCalc);

        setSubtotal(subtotalCalc);
        setDiscount(discountCalc);
        setCheckout(base);
    }, [order]);

    return {
        cartCount,
        qtyMap,
        subtotal,
        discount,
        checkout,
        handleOrder,
        decItem,
        removeItem,
    };
}