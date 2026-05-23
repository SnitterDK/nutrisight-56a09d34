import type { ReactNode } from "react";

export function Section({
  id,
  eyebrow,
  title,
  subtitle,
  children,
  className = "",
}: {
  id?: string;
  eyebrow?: string;
  title?: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`container-page py-20 ${className}`}>
      {(eyebrow || title || subtitle) && (
        <div className="mx-auto mb-12 max-w-2xl text-center">
          {eyebrow && (
            <p className="mb-3 inline-block rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              {eyebrow}
            </p>
          )}
          {title && <h2 className="text-3xl font-bold md:text-4xl">{title}</h2>}
          {subtitle && <p className="mt-3 text-base text-muted-foreground md:text-lg">{subtitle}</p>}
        </div>
      )}
      {children}
    </section>
  );
}
