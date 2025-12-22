// src/hooks/useAppAlert.tsx
import { useMemo, useState } from "react";
import type { AlertColor } from "@mui/material/Alert";
import AppAlert from "../components/AppAlert";

type AlertPosition = {
  vertical: "top" | "bottom";
  horizontal: "left" | "center" | "right";
};

export function useAppAlert(
  defaultPosition: AlertPosition = { vertical: "bottom", horizontal: "center" }
) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<AlertColor>("info");

  function showAlert(msg: string, type: AlertColor = "info") {
    setMessage(msg);
    setSeverity(type);
    setOpen(true);
  }

  function closeAlert() {
    setOpen(false);
  }

  const AlertUI = useMemo(
    () => (
      <AppAlert
        open={open}
        message={message}
        severity={severity}
        onClose={closeAlert}
        position={defaultPosition}
      />
    ),
    [open, message, severity, defaultPosition]
  );

  return { showAlert, closeAlert, AlertUI };
}
