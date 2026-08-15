import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import {
    PaymentElement,
    useElements,
    useStripe,
} from "@stripe/react-stripe-js";

import {
    forwardRef,
    useImperativeHandle,
} from "react";


export type StripePaymentHandle = {
    confirmPayment: () => Promise<{
        success: boolean;
        paymentIntentId?: string;
        error?: string;
    }>;
};


type CheckoutPaymentSectionProps = {
    mobile?: boolean;
};


const CheckoutPaymentSection = forwardRef<
    StripePaymentHandle,
    CheckoutPaymentSectionProps
>(({ mobile = false }, ref) => {

    const stripe = useStripe();
    const elements = useElements();

    const sectionMargin = mobile ? 1 : 1.5;


    useImperativeHandle(ref, () => ({
        async confirmPayment() {

            if (!stripe || !elements) {
                return {
                    success: false,
                    error: "Payment system is still loading.",
                };
            }

            const { error, paymentIntent } =
                await stripe.confirmPayment({
                    elements,
                    redirect: "if_required",
                });


            if (error) {
                return {
                    success: false,
                    error:
                        error.message ||
                        "Payment failed.",
                };
            }


            if (paymentIntent?.status !== "succeeded") {
                return {
                    success: false,
                    error: "Payment was not completed.",
                };
            }


            return {
                success: true,
                paymentIntentId: paymentIntent.id,
            };
        },
    }));


    return (
        <Box sx={{ mb: sectionMargin }}>

            <Typography
                variant="subtitle1"
                align="center"
                sx={{
                    textTransform: "uppercase",
                    letterSpacing: "0.16em",
                    mb: 2,
                    fontWeight: 700,
                    position: "relative",

                    "&::after": {
                        content: '""',
                        display: "block",
                        width: 52,
                        height: 3,
                        borderRadius: 999,
                        bgcolor: "#0d47a1",
                        mx: "auto",
                        mt: 0.8,
                    },
                }}
            >
                Payment
            </Typography>


            <PaymentElement />

            <Typography
                align="center"
                sx={{
                    mt: 2,
                    fontSize: "0.77rem",
                    color: "text.secondary",
                    lineHeight: 1.6,
                }}
            >
                <strong>Test card:</strong> 4242 4242 4242 4242
                <br />

                <strong>Any</strong> future expiration date •{" "}
                <strong>Any</strong> 3-digit CVC
                <br />

                <strong>ZIP:</strong> enter any 5-digit ZIP code
            </Typography>

            <Typography
                align="center"
                sx={{
                    mt: 1,
                    mb: 1.5,
                    fontSize: "0.77rem",
                    color: "text.secondary",
                }}
            >
                Test payment only — <strong>no real payment is processed.</strong>
            </Typography>

        </Box>
    );
});


CheckoutPaymentSection.displayName =
    "CheckoutPaymentSection";


export default CheckoutPaymentSection;