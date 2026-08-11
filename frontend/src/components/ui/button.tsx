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

/* Geometry and focus only. Colour, weight, transition and the hover states all
   come from the .btn* primitives below, which already gate their hovers behind
   (hover:hover) and (pointer:fine) — re-declaring them as `hover:` utilities
   here would fire on touch. */
const baseStyles = "inline-flex items-center justify-center gap-2 rounded-[var(--radius)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azure disabled:pointer-events-none disabled:opacity-50";

const variants = {
  default: "btn btn--primary",
  outline: "btn btn--secondary",
  ghost: "btn btn--ghost",
  secondary: "btn btn--secondary",
};

const sizes = {
  default: "h-10 px-4 py-2",
  sm: "h-8 px-2 text-body-sm",
  lg: "h-12 px-6 text-body",
  icon: "h-10 w-10 p-0",
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

