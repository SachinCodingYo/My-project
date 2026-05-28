import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: "default" | "elevated" | "outlined";
  padding?: "none" | "sm" | "md" | "lg";
}

const variantStyles = {
  default: "bg-white shadow-soft border border-slate-100",
  elevated: "bg-white shadow-lg border border-slate-100",
  outlined: "bg-transparent border border-slate-200",
};

const paddingStyles = {
  none: "",
  sm: "p-3",
  md: "p-5",
  lg: "p-6",
};

const Card = ({
  children,
  className = "",
  variant = "default",
  padding = "md",
  ...props
}: CardProps) => {
  return (
    <div
      className={[
        "rounded-3xl",
        variantStyles[variant],
        paddingStyles[padding],
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
