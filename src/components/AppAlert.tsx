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
  autoHideDuration = 5000,
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
          border: "1.5px solid rgba(0,0,0,0.14)",
          boxShadow: "0 16px 34px rgba(0,0,0,0.18)",
          color: "#111111",

          // base neutral fill
          backgroundColor: "#ffffff",

          // icon + close button neutral
          "& .MuiAlert-icon": { color: "rgba(0,0,0,0.55)" },
          "& .MuiAlert-action": { color: "rgba(0,0,0,0.55)" },

          // subtle neutral tints per severity (still monochrome)
          "&.MuiAlert-filledSuccess": {
            backgroundColor: "#f5f5f5",
          },
          "&.MuiAlert-filledError": {
            backgroundColor: "#f3f3f3",
          },
          "&.MuiAlert-filledWarning": {
            backgroundColor: "#f6f6f6",
          },
          "&.MuiAlert-filledInfo": {
            backgroundColor: "#f4f4f4",
          },
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
