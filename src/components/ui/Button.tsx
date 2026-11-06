import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "sage" | "dark" | "white";

const styles: Record<Variant, string> = {
  primary: "bg-brand text-black hover:bg-lime",
  outline: "border border-brand text-white hover:bg-brand hover:text-black",
  sage: "bg-white text-black hover:bg-brand",
  dark: "bg-black text-white hover:bg-white hover:text-black",
  white: "bg-white text-black hover:bg-brand",
};

export function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  className,
  ...rest
}: {
  href?: string;
  children: React.ReactNode;
  variant?: Variant;
  size?: "sm" | "md" | "lg";
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const cls = cn(
    "inline-flex items-center justify-center rounded-full font-mono font-medium tracking-[-0.2px] whitespace-nowrap transition-colors duration-300 ease-[var(--ease-framer)]",
    size === "sm" && "h-10 px-5 text-[15px]",
    size === "md" && "h-12 px-6 text-[16px] md:text-[17px] lg:text-[18px]",
    size === "lg" && "h-14 px-8 text-[18px]",
    styles[variant],
    className,
  );
  if (href) return <Link href={href} className={cls}>{children}</Link>;
  return <button className={cls} {...rest}>{children}</button>;
}
