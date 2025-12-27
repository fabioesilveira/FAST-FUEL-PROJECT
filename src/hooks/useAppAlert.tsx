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
  onConfirm: () => void; // continuar como guest
  onCancel: () => void;
  onDismiss?: () => void; // clique fora 
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

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("Confirm");
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmYes, setConfirmYes] = useState("Yes");
  const [confirmNo, setConfirmNo] = useState("No");

  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
  const [cancelAction, setCancelAction] = useState<(() => void) | null>(null);
  const [dismissAction, setDismissAction] = useState<(() => void) | null>(null);

  function confirmAlert(config: ConfirmConfig) {
    setConfirmTitle(config.title ?? "Confirm");
    setConfirmMessage(config.message);
    setConfirmYes(config.confirmText ?? "Yes");
    setConfirmNo(config.cancelText ?? "No");

    setConfirmAction(() => config.onConfirm);
    setCancelAction(() => config.onCancel);
    setDismissAction(() => config.onDismiss ?? null);

    setConfirmOpen(true);
  }

  function closeConfirmOnly() {
    setConfirmOpen(false);
    setConfirmAction(null);
    setCancelAction(null);
    setDismissAction(null);
  }

  function handleConfirmYes() {
    confirmAction?.();
    closeConfirmOnly();
  }

  function handleConfirmNo() {
    cancelAction?.();
    closeConfirmOnly();
  }

  function handleDismiss() {
    dismissAction?.();
    closeConfirmOnly();
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
        onCancel={handleConfirmNo}
        onDismiss={handleDismiss}
      />
    ),
    [
      confirmOpen,
      confirmTitle,
      confirmMessage,
      confirmYes,
      confirmNo,
      confirmAction,
      cancelAction,
      dismissAction,
    ]
  );

  return { showAlert, closeAlert, AlertUI, confirmAlert, ConfirmUI };
}
