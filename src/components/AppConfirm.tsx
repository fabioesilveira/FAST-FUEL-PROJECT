import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

type AppConfirmProps = {
    open: boolean;
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    onDismiss?: () => void;
};

export default function AppConfirm({
    open,
    title = "Confirm",
    message,
    confirmText = "Yes",
    cancelText = "No",
    onConfirm,
    onCancel,
    onDismiss,
}: AppConfirmProps) {
    return (
        <Dialog
            open={open}
            onClose={(_, reason) => {
                if (reason === "backdropClick" || reason === "escapeKeyDown") {
                    onDismiss?.();
                }
            }}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: "18px",
                    border: "1.5px solid rgba(0,0,0,0.14)",
                    boxShadow: "0 18px 40px rgba(0,0,0,0.18)",
                    backgroundColor: "#ffffff",
                    pb: 1.5
                },
            }}
        >
            <DialogTitle
                sx={{
                    fontWeight: 900,
                    color: "#111111",
                    textAlign: "center",
                    pt: 3,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                }}
            >
                {title}
            </DialogTitle>

            <DialogContent sx={{ pt: 1, pb: 1.5 }}>
                <Typography
                    sx={{
                        fontWeight: 600,
                        color: "#2b2b2b",
                        lineHeight: 1.45,
                        textAlign: "center",
                    }}
                >
                    {message}
                </Typography>
            </DialogContent>

            <DialogActions
                sx={{
                    p: 2,
                    pt: 1,
                    gap: 1.3,
                    justifyContent: "center",
                }}
            >
                <Button
                    onClick={onCancel}
                    variant="outlined"
                    sx={{
                        borderRadius: "10px",
                        border: "1.8px solid rgba(0,0,0,0.28)",
                        color: "#1f1f1f",
                        fontWeight: 800,
                        textTransform: "none",
                        px: 2.2,
                        "&:hover": {
                            borderColor: "rgba(0,0,0,0.45)",
                            backgroundColor: "rgba(0,0,0,0.04)",
                        },
                    }}
                >
                    {cancelText}
                </Button>

                <Button
                    onClick={onConfirm}
                    variant="contained"
                    sx={{
                        borderRadius: "10px",
                        fontWeight: 900,
                        textTransform: "none",
                        px: 2.4,
                        color: "#ffffff",

                        backgroundColor: "#4a4a4a",

                        "&:hover": {
                            backgroundColor: "#3a3a3a",

                        },

                        "&:active": {
                            transform: "translateY(1px)",
                            boxShadow: "0 6px 14px rgba(0,0,0,0.18)",
                        },
                    }}
                >
                    {confirmText}
                </Button>

            </DialogActions>
        </Dialog>
    );
}
