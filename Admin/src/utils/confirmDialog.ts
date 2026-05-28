import Swal from "sweetalert2";

type ActionType =
  | "delete"
  | "disable"
  | "remove"
  | "archive"
  | "block"
  | "deactivate"
  | "approve";

const actionConfig: Record<ActionType, { title: string; text: string; confirmText: string }> = {
  delete: {
    title: "Delete Item?",
    text: "This action cannot be undone.",
    confirmText: "Delete",
  },
  disable: {
    title: "Disable Item?",
    text: "This item will no longer be active.",
    confirmText: "Disable",
  },
  remove: {
    title: "Remove Item?",
    text: "This item will be removed from the list.",
    confirmText: "Remove",
  },
  archive: {
    title: "Archive Item?",
    text: "This item will be moved to archive.",
    confirmText: "Archive",
  },
  block: {
    title: "Block User?",
    text: "This user will no longer be able to access the system.",
    confirmText: "Block",
  },
  deactivate: {
    title: "Deactivate Item?",
    text: "This item will be deactivated.",
    confirmText: "Deactivate",
  },
  approve: {
    title: "Approve Item?",
    text: "This action will approve the item.",
    confirmText: "Approve",
  },
};

export const confirmDialog = async (
  action: ActionType = "delete",
  customTitle?: string,
  customText?: string
) => {
  const config = actionConfig[action];

  const result = await Swal.fire({
    title: customTitle || config.title,
    text: customText || config.text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#6b7280",
    confirmButtonText: config.confirmText,
    cancelButtonText: "Cancel",
    background: "#020617",
    color: "#fff",
  });

  return result.isConfirmed;
};