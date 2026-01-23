import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

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
    width: "100%",
    minWidth: { xs: "unset", sm: 130, md: 140 },
    height: { xs: "auto", sm: 36, md: 38 },
    py: { xs: 1.15, sm: 0.9, md: 0.8 },
    px: { xs: 2.2, sm: 2.4 },
    borderRadius: "10px",
    fontWeight: 900,
    letterSpacing: { xs: "0.06em", sm: "0.08em" },
    fontSize: { xs: "0.68rem", sm: "0.75rem", md: "0.8rem" },
    whiteSpace: "nowrap",
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
          pb: { xs: 1.8, md: 2.4 },
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: { xs: "min(300px, 86vw)", sm: "auto" },
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            justifyContent: "center",
            gap: { xs: 1.1, md: 1.3 },
            mx: "auto",
          }}
        >
          <Button
            onClick={onCancel}
            variant="outlined"
            sx={{
              ...actionButtonSx,
              width: { xs: "100%", sm: "auto" },
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
              width: { xs: "100%", sm: "auto" },
              color: "#ffffff",
              backgroundColor: "#4a4a4a",
              "&:hover": { backgroundColor: "#3a3a3a" },
              "&:active": {
                transform: "translateY(1px)",
                boxShadow: "0 6px 14px rgba(0,0,0,0.18)",
              },
            }}
          >
            {confirmText}
          </Button>
        </Box>
      </DialogActions>

    </Dialog>
  );
}
