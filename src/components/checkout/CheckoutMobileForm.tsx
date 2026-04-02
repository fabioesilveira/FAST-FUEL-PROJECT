import Box from "@mui/material/Box";
import CheckoutOrderSummary from "./CheckoutOrderSummary";
import CheckoutContactSection from "./CheckoutContactSection";
import CheckoutDeliverySection from "./CheckoutDeliverySection";
import CheckoutPaymentSection from "./CheckoutPaymentSection";
import CheckoutMobileFooter from "./CheckoutMobileFooter";
import ProductsTitleBar from "../ProductsTitleBar";
import type { Meal } from "../../context/context";

type AddressState = {
    street: string;
    city: string;
    apt: string;
    state: string;
    zip: string;
    country: string;
};

type CheckoutMobileFormProps = {
    order: Meal[];
    totalItems: number;
    subtotalLabel: string;
    discount: number;
    discountLabel: string;
    taxLabel: string;
    deliveryFee: number;
    deliveryLabel: string;
    grandTotalLabel: string;
    resolveImgSrc: (img?: string) => string;
    imageStylesByIdOrderSummary: Record<string, React.CSSProperties>;
    cleanProductName: (name: string) => string;
    incItem: (productId: string) => void;
    decItem: (productId: string) => void;
    handleClearCart: () => void;
    fullName: string;
    email: string;
    isLogged: boolean;
    tfBlueLabelSx: any;
    onFullNameChange: (value: string) => void;
    onEmailChange: (value: string) => void;
    address: AddressState;
    streetText: string;
    onStreetTextChange: (value: string) => void;
    onAddressChange: React.Dispatch<React.SetStateAction<AddressState>>;
    submitting: boolean;
    orderLength: number;
    onPay: () => void;
};

export default function CheckoutMobileForm({
    order,
    totalItems,
    subtotalLabel,
    discount,
    discountLabel,
    taxLabel,
    deliveryFee,
    deliveryLabel,
    grandTotalLabel,
    resolveImgSrc,
    imageStylesByIdOrderSummary,
    cleanProductName,
    incItem,
    decItem,
    handleClearCart,
    fullName,
    email,
    isLogged,
    tfBlueLabelSx,
    onFullNameChange,
    onEmailChange,
    address,
    streetText,
    onStreetTextChange,
    onAddressChange,
    submitting,
    orderLength,
    onPay,
}: CheckoutMobileFormProps) {
    return (
        <Box
            sx={{
                minHeight: "100dvh",
                display: "flex",
                flexDirection: "column",
                bgcolor: "#fff",
                position: "relative",
            }}
        >
            <ProductsTitleBar title="Checkout" />

            <Box
                sx={{
                    position: "relative",
                    zIndex: 1,
                    px: 2.5,
                    pt: "160px",
                    pb: "calc(110px + env(safe-area-inset-bottom))",
                    width: "100%",
                    maxWidth: 490,
                    mx: "auto",
                }}
            >
                <Box sx={{ pb: 2 }}>
                    <CheckoutOrderSummary
                        order={order}
                        totalItems={totalItems}
                        subtotalLabel={subtotalLabel}
                        discount={discount}
                        discountLabel={discountLabel}
                        taxLabel={taxLabel}
                        deliveryFee={deliveryFee}
                        deliveryLabel={deliveryLabel}
                        grandTotalLabel={grandTotalLabel}
                        resolveImgSrc={resolveImgSrc}
                        imageStylesByIdOrderSummary={imageStylesByIdOrderSummary}
                        cleanProductName={cleanProductName}
                        incItem={incItem}
                        decItem={decItem}
                        handleClearCart={handleClearCart}
                    />
                </Box>

                <CheckoutContactSection
                    fullName={fullName}
                    email={email}
                    isLogged={isLogged}
                    tfBlueLabelSx={tfBlueLabelSx}
                    onFullNameChange={onFullNameChange}
                    onEmailChange={onEmailChange}
                />

                <CheckoutDeliverySection
                    address={address}
                    streetText={streetText}
                    tfBlueLabelSx={tfBlueLabelSx}
                    mobile
                    onStreetTextChange={onStreetTextChange}
                    onAddressChange={onAddressChange}
                />

                <CheckoutPaymentSection
                    tfBlueLabelSx={tfBlueLabelSx}
                    mobile
                />
            </Box>

            <CheckoutMobileFooter
                grandTotalLabel={grandTotalLabel}
                submitting={submitting}
                orderLength={orderLength}
                onPay={onPay}
            />
        </Box>
    );
}