import { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

type Props = {
    open: boolean;
    loading?: boolean;
    onClose: () => void;
    onAdd: (orderNumber: string) => void;
};

export default function AddGuestOrderDialog({
    open,
    loading = false,
    onClose,
    onAdd,
}: Props) {
    const [orderNumber, setOrderNumber] = useState("");

    function handleClose() {
        if (loading) return;

        setOrderNumber("");
        onClose();
    }

    function handleSubmit() {
        const value = orderNumber.trim();

        if (!value) return;

        onAdd(value);
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="xs"
            PaperProps={{
                sx: {
                    bgcolor: "#f7f7f7",
                    border: "1px solid #c7c7c7",
                    borderRadius: 2,
                    boxShadow: "0 12px 28px rgba(0,0,0,0.14)",
                },
            }}
        >
            <DialogTitle
                sx={{
                    color: "#0d47a1",
                    fontWeight: 900,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    fontSize: "1.08rem",
                    mb: -1,

                }}
            >
                Add Guest Order
            </DialogTitle>

            <DialogContent>
                <Typography
                    sx={{
                        mb: 2,
                        color: "text.secondary",
                        fontSize: "0.94rem",
                        lineHeight: 1.5,
                    }}
                >
                    Enter the order number from your guest purchase. We'll make sure
                    it matches the email on your account before adding it.
                </Typography>

                <TextField
                    autoFocus
                    fullWidth
                    size="small"
                    label="Order Number"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleSubmit();
                        }
                    }}
                    sx={{
                        "& label": {
                            color: "#0d47a1",
                        },

                        "& label.Mui-focused": {
                            color: "#0d47a1",
                        },

                        "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                                borderColor: "#0d47a1",
                            },

                            "&:hover fieldset": {
                                borderColor: "#123b7a",
                            },

                            "&.Mui-focused fieldset": {
                                borderColor: "#0d47a1",
                                borderWidth: 2,
                            },
                        },
                    }}
                />
            </DialogContent>

            <DialogActions
                sx={{
                    px: 3,
                    pb: 2.5,
                    gap: 1,
                }}
            >
                <Button
                    onClick={handleClose}
                    variant="outlined"
                    disabled={loading}
                    sx={{
                        flex: 1,
                        height: 40,

                        fontWeight: 800,
                        textTransform: "uppercase",
                        border: "1.5px solid #0d47a1",
                        color: "#0d47a1",
                        borderRadius: "8px",
                    }}
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleSubmit}
                    disabled={loading || !orderNumber.trim()}
                    sx={{
                        flex: 1,
                        height: 40,
                        color: "#ffffff",
                        backgroundColor: "#0d47a1",

                        "&:hover": {
                            backgroundColor: "#0b3d8a",
                        },

                        "&:active": {
                            transform: "translateY(1px)",
                            boxShadow: "0 6px 14px rgba(13,71,161,0.18)",
                        },
                        fontWeight: 800,
                        textTransform: "uppercase",
                        borderRadius: "8px",

                    }}
                >
                    {loading ? "Adding..." : "Add Order"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}