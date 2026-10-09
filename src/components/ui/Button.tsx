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
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emas/50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none min-h-[44px]";

  const variantStyles = {
    emas: "bg-emas text-tinta font-semibold hover:bg-emas-muda shadow-[0_0_20px_rgba(212,175,55,0.25)] hover:shadow-[0_0_25px_rgba(212,175,55,0.45)] active:scale-[0.98]",
    arang:
      "bg-arang text-gading border border-perunggu/40 hover:border-emas/60 hover:bg-[#211c18] active:scale-[0.98]",
    garis:
      "border border-emas/70 text-emas hover:bg-emas/10 hover:border-emas active:scale-[0.98]",
    merah:
      "border border-merah/70 text-merah hover:bg-merah/15 hover:border-merah hover:text-red-300 active:scale-[0.98]",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs min-w-[36px]",
    md: "px-5 py-2.5 text-sm min-w-[44px]",
    lg: "px-6 py-3.5 text-base min-w-[48px]",
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
