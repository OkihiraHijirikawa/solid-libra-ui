import { cva } from "class-variance-authority";

export const iconButtonVariants = cva(
  `inline-flex items-center justify-center rounded-md text-sm font-medium 
   transition-colors focus-visible:outline-none focus-visible:ring-2 
   focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 
   disabled:pointer-events-none ring-offset-background cursor-pointer 
   relative overflow-hidden whitespace-nowrap`,
  {
    variants: {
      // variantClasses の内容
      variant: {
        brand:
          "bg-[var(--brand-color)] text-[var(--brand-color-text)] hover:bg-[var(--brand-color-hover)]",
        primary:
          "bg-[var(--lb-primary)] text-white hover:bg-[var(--lb-primary-hover)]",
        secondary:
          "bg-[var(--lb-secondary)] text-white hover:bg-[var(--lb-secondary-hover)]",
        warning:
          "bg-[var(--lb-warning)] text-white hover:bg-[var(--lb-warning-hover)]",
        danger:
          "bg-[var(--lb-danger)] text-white hover:bg-[var(--lb-danger-hover)]",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      // sizeClasses の内容
      size: {
        sm: "h-9 w-9",
        md: "h-10 w-10",
        lg: "h-12 w-12",
      },
    },
    // デフォルト値
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);
