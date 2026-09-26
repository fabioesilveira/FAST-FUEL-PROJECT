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
  position?: {
    vertical: "top" | "bottom";
    horizontal: "left" | "center" | "right";
  };
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
          borderRadius: "10px",
          fontWeight: 800,
          border: "1px solid #c7c7c7",
          boxShadow: "0 12px 28px rgba(0,0,0,0.14)",

          color: "#0d47a1",
          backgroundColor: "#f7f7f7",

          "& .MuiAlert-message": {
            color: "#0d47a1",
          },

          "& .MuiAlert-icon": {
            color: "#0d47a1",
          },

          "& .MuiAlert-action": {
            color: "#0d47a1",
          },

          "&.MuiAlert-filledSuccess": {
            backgroundColor: "#f7f7f7",
            color: "#0d47a1",
          },

          "&.MuiAlert-filledError": {
            backgroundColor: "#f7f7f7",
            color: "#0d47a1",
          },

          "&.MuiAlert-filledWarning": {
            backgroundColor: "#f7f7f7",
            color: "#0d47a1",
          },

          "&.MuiAlert-filledInfo": {
            backgroundColor: "#f7f7f7",
            color: "#0d47a1",
          },
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}