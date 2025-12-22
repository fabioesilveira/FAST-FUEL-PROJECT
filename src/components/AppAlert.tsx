import * as React from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Slide from "@mui/material/Slide";
import type { AlertColor } from "@mui/material/Alert";

type AppAlertProps = {
  open: boolean;
  message: string;
  severity?: AlertColor;
  onClose: () => void;
  autoHideDuration?: number;
  position?: { vertical: "top" | "bottom"; horizontal: "left" | "center" | "right" };
};

function SlideUp(props: any) {
  return <Slide {...props} direction="up" />;
}

export default function AppAlert({
  open,
  message,
  severity = "info",
  onClose,
  autoHideDuration = 2600,
  position = { vertical: "bottom", horizontal: "center" },
}: AppAlertProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      anchorOrigin={position}
      TransitionComponent={SlideUp}
      onClose={(_, reason) => {
        if (reason === "clickaway") return;
        onClose();
      }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        sx={{
          borderRadius: "16px",
          fontWeight: 800,
          border: "2px solid #e65100",
          boxShadow: "0 10px 22px rgba(230, 81, 0, 0.25)",
          backgroundColor: "#fff3e0",
          color: "#1f1f1f",
          "& .MuiAlert-icon": { color: "#e65100" },

          "& .MuiAlert-action": { color: "#0d47a1" },

          //  “success/error/warning/info”
          "&.MuiAlert-filledSuccess": { backgroundColor: "#e8f5e9" },
          "&.MuiAlert-filledError": { backgroundColor: "#ffebee" },
          "&.MuiAlert-filledWarning": { backgroundColor: "#fff8e1" },
          "&.MuiAlert-filledInfo": { backgroundColor: "#e3f2fd" },
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
