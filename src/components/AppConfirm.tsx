import * as React from "react";
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
};

export default function AppConfirm({
  open,
  title = "Confirm",
  message,
  confirmText = "Yes",
  cancelText = "No",
  onConfirm,
  onCancel,
}: AppConfirmProps) {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "18px",
          border: "2px solid #e65100",
          boxShadow: "0 14px 30px rgba(230, 81, 0, 0.25)",
          backgroundColor: "#fff3e0",
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 900, color: "#e65100" }}>
        {title}
      </DialogTitle>

      <DialogContent>
        <Typography sx={{ fontWeight: 700, color: "#1f1f1f", lineHeight: 1.35 }}>
          {message}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 0, gap: 1 }}>
        <Button
          onClick={onCancel}
          variant="outlined"
          sx={{
            borderRadius: "10px",
            border: "2px solid #e65100",
            color: "#e65100",
            fontWeight: 900,
            textTransform: "none",
            "&:hover": { borderColor: "#b33f00", color: "#b33f00" },
          }}
        >
          {cancelText}
        </Button>

        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{
            borderRadius: "10px",
            backgroundColor: "#e65100",
            color: "#ffe0c7",
            fontWeight: 900,
            textTransform: "none",
            "&:hover": { backgroundColor: "#b33f00" },
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
