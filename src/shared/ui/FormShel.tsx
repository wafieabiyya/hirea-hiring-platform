"use client";

import { X } from "lucide-react";
import { FormEvent } from "react";

type Props = {
  title: string;
  onClose?: () => void;
  onSubmit?: (e: FormEvent<HTMLFormElement>) => void;
  children: React.ReactNode;
  primaryAction?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  className?: string;
  backButton?: React.ReactNode;
  rightInfo?: React.ReactNode;
  showCloseIcon?: boolean;
};

export default function FormShell({
  title,
  onClose,
  onSubmit,
  children,
  primaryAction,
  secondaryAction,
  className = "",
  backButton,
  rightInfo,
  showCloseIcon = false,
}: Props) {
  return (
    <form onSubmit={onSubmit} className={`flex h-full flex-col ${className}`}>
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#E0E0E0] bg-white px-6 py-4">
        {/* Kiri */}
        <div className="flex items-center gap-3">
          {backButton}
          <h2 className="text-lg font-bold">{title}</h2>
        </div>

        {/* Kanan */}
        <div className="flex items-center gap-3">
          {rightInfo && (
            <div className="text-xs text-gray-500">{rightInfo}</div>
          )}
          {showCloseIcon && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>

      {/* Footer */}
      {(primaryAction || secondaryAction) && (
        <div className="sticky bottom-0 border-t border-[#E0E0E0] bg-white px-6 py-4">
          <div className="flex items-center justify-end gap-2">
            {secondaryAction}
            {primaryAction}
          </div>
        </div>
      )}
    </form>
  );
}
