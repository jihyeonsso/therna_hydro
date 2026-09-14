const STYLES: Record<string, string> = {
  success: "bg-primary-soft text-primary border-transparent",
  danger: "bg-danger-bg text-danger border-transparent",
  warning: "bg-warning-bg text-warning-text border-warning-border",
};

export function Banner({
  variant,
  children,
}: {
  variant: "success" | "danger" | "warning";
  children: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-lg border px-3.5 py-2.5 text-center text-[13px] font-semibold ${STYLES[variant]}`}
    >
      {children}
    </div>
  );
}
