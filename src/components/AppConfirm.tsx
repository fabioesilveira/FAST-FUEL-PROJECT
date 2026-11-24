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
import type { SxProps, Theme } from "@mui/material/styles";
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
  message: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  onDismiss?: () => void;
  equalButtonWidth?: boolean;
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
  equalButtonWidth = false,
}: AppConfirmProps) {
  const actionButtonSx: SxProps<Theme> = {
    width: "100%",
    minWidth: 0,
    minHeight: { xs: 44, sm: 38, md: 36 },
    height: { xs: "auto", sm: 38, md: 36 },
    py: { xs: 0.75, sm: 0 },
    px: { xs: 0.8, sm: 2.6 },
    borderRadius: "8px",
    fontWeight: 900,
    letterSpacing: { xs: "0.015em", sm: "0.08em" },
    fontSize: { xs: "0.70rem", sm: "0.75rem", md: "0.8rem" },
    lineHeight: { xs: 1.15, sm: 1.2 },
    whiteSpace: { xs: "normal", sm: "nowrap" },
    textAlign: "center",
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
          width: { xs: "calc(100% - 16px)", sm: "100%" },
          transform: "translateY(-60px)",

          maxWidth: { xs: "calc(100% - 16px)", sm: 444 },
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
          px: { xs: 2.5, sm: 2.7, md: 3.1 },
          pt: { xs: 2.5, md: 2.7 },
          pb: { xs: 0.25, md: 0.3 },
        }}
      >
        {title}
      </DialogTitle>

      <DialogContent
        sx={{
          px: { xs: 1.8, sm: 2.6, md: 3 },
          pt: 0,
          pb: { xs: 1.55, md: 1.60 },
        }}
      >
        <Typography
          sx={{
            fontWeight: 500,
            color: "rgba(0,0,0,0.72)",
            lineHeight: { xs: 1.4, sm: 1.45 },
            textAlign: "center",
            fontSize: { xs: "0.84rem", sm: "0.88rem", md: "0.95rem" },
          }}
        >
          {message}
        </Typography>
      </DialogContent>

      <DialogActions
        sx={{
          px: { xs: 1.5, sm: 2.6, md: 3 },
          pt: 0,
          pb: { xs: 2.5, md: 2.7 },
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: equalButtonWidth ? { xs: 380, sm: 420 } : undefined,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: { xs: 1, sm: 1.3 },
            pb: { xs: 0.5, md: 0.5 },
            mx: "auto",
          }}
        >
          <Button
            onClick={onCancel}
            variant="outlined"
            sx={{
              ...actionButtonSx,
              flex: equalButtonWidth ? 1 : undefined,
              width: equalButtonWidth ? "100%" : "auto",
              minWidth: equalButtonWidth ? 0 : { xs: 130, sm: 130, md: 140 },
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
              flex: equalButtonWidth ? 1 : undefined,
              width: equalButtonWidth ? "100%" : "auto",
              minWidth: equalButtonWidth ? 0 : { xs: 130, sm: 130, md: 140 },
              color: "#ffffff",
              backgroundColor: "#0d47a1",
              "&:hover": { backgroundColor: "#0b3d8a" },
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