import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Zoom from "@mui/material/Zoom";
import Backdrop from "@mui/material/Backdrop";
import type { TransitionProps } from "@mui/material/transitions";
import React from "react";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Zoom ref={ref} {...props} />;
});

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
    height: { xs: 40, sm: 38, md: 36 },
    py: 0,
    px: { xs: 2.2, sm: 2.4 },
    borderRadius: "8px",
    fontWeight: 900,
    letterSpacing: { xs: "0.06em", sm: "0.08em" },
    fontSize: { xs: "0.68rem", sm: "0.75rem", md: "0.8rem" },
    whiteSpace: "nowrap",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      transitionDuration={{ enter: 160, exit: 120 }}
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 160,
        sx: {
          bgcolor: "rgba(0,0,0,0.35)",
          transition: "opacity 160ms ease",
        },
      }}
      onClose={(_, reason) => {
        if (reason === "backdropClick" || reason === "escapeKeyDown") {
          onDismiss?.();
        }
      }}
      maxWidth="xs"
      fullWidth
      sx={{
        zIndex: 9000,
        "& .MuiBackdrop-root": { zIndex: 9000 },
        "& .MuiDialog-container": { zIndex: 9001 },
        "& .MuiPaper-root": { zIndex: 9002 },
      }}
      PaperProps={{
        sx: {
          borderRadius: "10px",
          border: "1px solid #c7c7c7",
          boxShadow: "0 12px 28px rgba(0,0,0,0.14)",
          backgroundColor: "#f7f7f7",
          pt: 0,
          pb: 0,
          willChange: "transform, opacity",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 900,
          color: "#0d47a1",
          textAlign: "center",
          letterSpacing: "0.10em",
          textTransform: "uppercase",
          fontSize: { xs: "0.95rem", sm: "1rem", md: "1.03rem" },
          px: { xs: 2.7, sm: 2.7, md: 3.1 },
          pt: { xs: 2.4, md: 2.7 },
          pb: { xs: 0.4, md: 0.7 },
        }}
      >
        {title}
      </DialogTitle>

      <DialogContent
        sx={{
          px: { xs: 2.2, sm: 2.6, md: 3 },
          pt: 0,
          pb: { xs: 1.25, md: 1.35 },
        }}
      >
        <Typography
          sx={{
            fontWeight: 500,
            color: "rgba(0,0,0,0.72)",
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
          px: { xs: 2.2, sm: 2.6, md: 3 },
          pt: 0,
          pb: { xs: 2.4, md: 2.7 },
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
            pb: { xs: 0.7, md: 0.5 },
            mx: "auto",
          }}
        >
          <Button
            onClick={onCancel}
            variant="outlined"
            sx={{
              ...actionButtonSx,
              width: { xs: "100%", sm: "auto" },
              border: "1.5px solid #0d47a1",
              color: "#0d47a1",
              "&:hover": {
                borderColor: "#0d47a1",
                backgroundColor: "rgba(13,71,161,0.05)",
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
              backgroundColor: "#0d47a1",
              "&:hover": {
                backgroundColor: "#0b3d8a",
              },
              "&:active": {
                transform: "translateY(1px)",
                boxShadow: "0 6px 14px rgba(13,71,161,0.18)",
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