// src/hooks/useAppAlert.tsx
import { useMemo, useState } from "react";
import type { AlertColor } from "@mui/material/Alert";
import AppAlert from "../components/AppAlert";
import AppConfirm from "../components/AppConfirm";

type AlertPosition = {
  vertical: "top" | "bottom";
  horizontal: "left" | "center" | "right";
};

type ConfirmConfig = {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
};

export function useAppAlert(
  defaultPosition: AlertPosition = { vertical: "bottom", horizontal: "center" }
) {
  // SIMPLE ALERT (old behavior)
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

  // CONFIRM (new, only when you need Yes/No)
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState<string>("Confirm");
  const [confirmMessage, setConfirmMessage] = useState<string>("");
  const [confirmYes, setConfirmYes] = useState<string>("Yes");
  const [confirmNo, setConfirmNo] = useState<string>("No");
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);

  function confirmAlert(config: ConfirmConfig) {
    setConfirmTitle(config.title ?? "Confirm");
    setConfirmMessage(config.message);
    setConfirmYes(config.confirmText ?? "Yes");
    setConfirmNo(config.cancelText ?? "No");
    setConfirmAction(() => config.onConfirm);
    setConfirmOpen(true);
  }

  function closeConfirm() {
    setConfirmOpen(false);
    setConfirmAction(null);
  }

  function handleConfirmYes() {
    confirmAction?.();
    closeConfirm();
  }

  const ConfirmUI = useMemo(
    () => (
      <AppConfirm
        open={confirmOpen}
        title={confirmTitle}
        message={confirmMessage}
        confirmText={confirmYes}
        cancelText={confirmNo}
        onConfirm={handleConfirmYes}
        onCancel={closeConfirm}
      />
    ),
    [confirmOpen, confirmTitle, confirmMessage, confirmYes, confirmNo, confirmAction]
  );

  return { showAlert, closeAlert, AlertUI, confirmAlert, ConfirmUI };
}
