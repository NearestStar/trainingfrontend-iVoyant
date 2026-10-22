import type { ButtonHTMLAttributes } from "react";
import styles from "./StudioButton.module.css";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "success"
  | "danger";

type StudioButtonProps =
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
  };

export default function StudioButton({
  variant = "primary",
  children,
  className = "",
  type = "button",
  ...props
}: StudioButtonProps) {
  return (
    <button
      type={type}
      className={`${styles.button} ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}