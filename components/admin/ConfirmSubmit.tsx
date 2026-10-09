"use client";

export function ConfirmSubmit({
  children,
  message = "Yakin ingin menghapus? Tindakan ini tidak bisa dibatalkan.",
  className,
}: {
  children: React.ReactNode;
  message?: string;
  className?: string;
}) {
  return (
    <button
      type="submit"
      onClick={(event) => {
        if (!window.confirm(message)) {
          event.preventDefault();
        }
      }}
      className={className}
    >
      {children}
    </button>
  );
}
