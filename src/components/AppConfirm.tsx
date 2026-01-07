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

  const actionButtonSx = {
    minWidth: { xs: 120, sm: 130, md: 140 },
    height: { xs: 34, sm: 36, md: 38 },
    borderRadius: "10px",
    fontWeight: 900,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    fontSize: { xs: "0.72rem", sm: "0.75rem", md: "0.8rem" },
  };

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
          borderRadius: { xs: "14px", md: "18px" },
          border: "1.5px solid rgba(0,0,0,0.14)",
          boxShadow: "0 18px 40px rgba(0,0,0,0.18)",
          backgroundColor: "#ffffff",
          pb: { xs: 2, md: 2 },
          pt: { xs: 1, md: 1 },
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 900,
          color: "#111111",
          textAlign: "center",
          pt: { xs: 2.2, md: 3 },
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          fontSize: { xs: "0.95rem", sm: "1rem", md: "1.05rem" },
        }}
      >
        {title}
      </DialogTitle>

      <DialogContent sx={{ pt: { xs: 0.5, md: 1 }, pb: { xs: 1, md: 1.5 } }}>
        <Typography
          sx={{
            fontWeight: 600,
            color: "#2b2b2b",
            lineHeight: 1.45,
            textAlign: "center",
            fontSize: { xs: "0.85rem", sm: "0.88rem", md: "0.95rem" },
          }}
        >
          {message}
        </Typography>
      </DialogContent>

      <DialogActions
        sx={{
          p: { xs: 1.5, md: 2 },
          pt: 1,
          gap: { xs: 1, md: 1.3 },
          justifyContent: "center",
        }}
      >
        <Button
          onClick={onCancel}
          variant="outlined"
          sx={{
            ...actionButtonSx,
            border: "1.8px solid rgba(0,0,0,0.28)",
            color: "#1f1f1f",
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
            ...actionButtonSx,
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
