export function Section({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      {title && <p className="text-sm font-medium text-gray-800">{title}</p>}
      {children}
    </section>
  );
}

export function Row({
  label,
  children,
  required,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block text-sm text-[#404040]">
      <span className="inline-flex items-baseline gap-1">
        <span>{label}</span>
        {required && <span className="text-red-500">*</span>}
      </span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

export function Control({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`w-full ${className}`}>{children}</div>;
}

export function Input({
  className = "",
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...rest}
      className={`w-full rounded-md border-2 border-[#E0E0E0] px-3 py-2 mb-2 text-sm ${className}`}
    />
  );
}

export function Textarea({
  className = "",
  ...rest
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...rest}
      className={`w-full rounded-md border-2 border-[#E0E0E0] px-3 py-2 mb-2 text-sm ${className}`}
    />
  );
}

export const Form = { Section, Row, Control, Input, Textarea };
