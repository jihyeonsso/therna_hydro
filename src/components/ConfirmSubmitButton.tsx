"use client";

import { useFormStatus } from "react-dom";

export function ConfirmSubmitButton({
  children,
  className,
  pendingText = "처리 중...",
  confirmMessage,
  disabled = false,
}: {
  children: React.ReactNode;
  className?: string;
  pendingText?: string;
  confirmMessage: string;
  disabled?: boolean;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      aria-busy={pending}
      className={`${className} disabled:opacity-60`}
      onClick={(e) => {
        if (!window.confirm(confirmMessage)) {
          e.preventDefault();
        }
      }}
    >
      {pending ? pendingText : children}
    </button>
  );
}
