import * as React from "react";
import Link, { LinkProps } from "next/link";
import { cn } from "@/lib/utils";

type BaseButtonProps = {
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
};

type ButtonAsButton = BaseButtonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseButtonProps> & {
    asChild?: false;
  };

type ButtonAsLink = BaseButtonProps &
  Omit<LinkProps, keyof BaseButtonProps> &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
    asChild: true;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

const baseStyles = "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4a4e69] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

const variants = {
  default: "bg-gradient-to-r from-[#4a4e69] to-[#9a8c98] text-white hover:from-[#22223b] hover:to-[#4a4e69] shadow-md hover:shadow-lg",
  outline: "border-2 border-[#4a4e69] text-[#4a4e69] bg-transparent hover:bg-[#f2e9e4]",
  ghost: "text-[#4a4e69] hover:bg-[#f2e9e4]",
  secondary: "bg-[#f2e9e4] text-[#22223b] hover:bg-[#c9ada7]",
};

const sizes = {
  default: "h-10 px-4 py-2",
  sm: "h-9 px-3 text-sm",
  lg: "h-11 px-8",
  icon: "h-10 w-10",
};

const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (props, ref) => {
    const { className, variant = "default", size = "default", asChild, ...rest } = props;
    const classes = cn(baseStyles, variants[variant], sizes[size], className);

    if (asChild) {
      const { ...linkProps } = rest as Omit<ButtonAsLink, keyof BaseButtonProps | "asChild">;
      return (
        <Link
          className={classes}
          ref={ref as React.Ref<HTMLAnchorElement>}
          {...linkProps}
        />
      );
    }

    const { ...buttonProps } = rest as Omit<ButtonAsButton, keyof BaseButtonProps | "asChild">;
    return (
      <button
        type="button"
        className={classes}
        ref={ref as React.Ref<HTMLButtonElement>}
        {...buttonProps}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };

