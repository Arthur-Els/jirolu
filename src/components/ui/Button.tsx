import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "emas" | "arang" | "garis" | "merah";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "emas",
  size = "md",
  className = "",
  children,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-xl motion-safe:transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2 motion-safe:active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none";

  const variantStyles = {
    emas: "bg-accent hover:bg-accent-2 text-accent-ink font-semibold",
    arang:
      "bg-paper-2 hover:bg-paper-3 text-ink border border-rule hover:border-accent",
    garis:
      "border border-rule hover:border-accent text-ink hover:bg-paper-2",
    merah:
      "border border-merah/70 text-merah hover:bg-merah/15 hover:border-merah hover:text-red-300",
  };

  const sizeStyles = {
    sm: "px-4 py-2 text-xs min-h-[36px]",
    md: "px-6 py-2.5 text-sm min-h-[44px]",
    lg: "px-8 py-3.5 text-[15px] min-h-[48px]",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
