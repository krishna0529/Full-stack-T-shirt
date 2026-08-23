import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ThemeToggle from "../theme/ThemeToggle";

interface AuthLayoutProps {
  children: React.ReactNode;
  imageSrc?: string;
  imageAlt?: string;
}

export default function AuthLayout({
  children,
  imageSrc = "/auth/login.jpg",
  imageAlt = "AGROX Fashion Editorial",
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full bg-[var(--color-background)] text-[var(--color-foreground)] transition-colors duration-300">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-12">

        {/* Left Column: High-Fashion Cover Image */}
        <div className="hidden lg:col-span-6 lg:block relative overflow-hidden bg-[var(--color-card)] border-r border-[var(--color-border)]">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

          <div className="absolute bottom-12 left-12 right-12 text-white">
            <span className="text-xs uppercase tracking-[0.3em] font-bold opacity-80 mb-2 block">
              Agrox Streetwear
            </span>
            <h2 className="text-4xl font-extrabold tracking-tight leading-tight">
              Wear Your <br /> Unique Identity.
            </h2>
          </div>
        </div>

        {/* Right Column: Form Container */}
        <div className="col-span-1 lg:col-span-6 flex flex-col justify-between p-6 sm:p-12 lg:p-16">

          {/* Top Bar */}
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="text-xl font-black tracking-[-0.06em] text-[var(--color-foreground)]"
            >
              AGROX.
            </Link>

            <div className="flex items-center gap-4">
              <ThemeToggle />

              <Link
                to="/"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors"
              >
                <ArrowLeft size={14} />
                <span>Shop</span>
              </Link>
            </div>
          </div>

          {/* Center Form Stage */}
          <div className="my-auto py-10 flex justify-center">
            <div className="w-full max-w-md">
              {children}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center lg:text-left text-xs text-[var(--color-muted)]">
            © {new Date().getFullYear()} AGROX Clothing. All rights reserved.
          </div>

        </div>

      </div>
    </div>
  );
}
