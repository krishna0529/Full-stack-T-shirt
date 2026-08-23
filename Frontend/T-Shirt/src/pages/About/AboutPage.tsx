import { useEffect, useRef } from "react";
import developerImg from "../../assets/developer.jpg";
import {
  Code2,
  Server,
  Database,
  ShoppingCart,
  Shield,
  CreditCard,
  Package,
  BarChart2,
  Users,
  Truck,
  GitBranch,
  ExternalLink,
  Mail,
  ChevronRight,
  Layers,
  Zap,
} from "lucide-react";

/* ─── Tech Stack ─────────────────────────────────────────────── */
const stack = [
  {
    icon: "⚛️",
    label: "React.js",
    desc: "Component-based UI with hooks, lazy-loading & Suspense",
    color: "#61DAFB",
  },
  {
    icon: "🎨",
    label: "Tailwind CSS",
    desc: "Utility-first CSS for rapid, responsive design",
    color: "#38BDF8",
  },
  {
    icon: "☕",
    label: "Java",
    desc: "Core backend language – type-safe, performant, scalable",
    color: "#F89820",
  },
  {
    icon: "🍃",
    label: "Spring Boot",
    desc: "REST APIs, Security (JWT), Validation & Auto-config",
    color: "#6DB33F",
  },
  {
    icon: "🐬",
    label: "MySQL",
    desc: "Relational database – products, orders, users & payments",
    color: "#00758F",
  },
  {
    icon: "🔗",
    label: "Hibernate",
    desc: "ORM layer – entity mapping, lazy fetch & cascade ops",
    color: "#BCAE79",
  },
  {
    icon: "🧩",
    label: "Microservices",
    desc: "Modular service architecture – Auth, Product, Order, Payment",
    color: "#A78BFA",
  },
];

/* ─── Features ───────────────────────────────────────────────── */
const features = [
  {
    icon: <ShoppingCart size={20} />,
    title: "Full E-Commerce Store",
    desc: "Product listing, filtering by category/size/color, slug-based product detail pages, and a fully functional cart system with persistent state.",
    color: "#F59E0B",
  },
  {
    icon: <Shield size={20} />,
    title: "Auth & Security",
    desc: "JWT-based authentication with email verification, forgot/reset password flows, role-based access (ADMIN / USER) using Spring Security.",
    color: "#10B981",
  },
  {
    icon: <CreditCard size={20} />,
    title: "Payment Integration",
    desc: "Online payment flow with success/failure handling, order number tracking, and payment status recording in the database.",
    color: "#3B82F6",
  },
  {
    icon: <Package size={20} />,
    title: "Order Management",
    desc: "Users can view order history, track shipment status in real-time, and get detailed order breakdowns including items, pricing & shipping.",
    color: "#8B5CF6",
  },
  {
    icon: <BarChart2 size={20} />,
    title: "Admin Analytics Dashboard",
    desc: "Revenue KPIs, order stats, top-selling products, payment summaries, return metrics and customer insights — all in one dashboard.",
    color: "#EC4899",
  },
  {
    icon: <Users size={20} />,
    title: "Customer Management",
    desc: "Admin can view, search and manage all registered customers, their orders, account status and activity.",
    color: "#F97316",
  },
  {
    icon: <Truck size={20} />,
    title: "Shipment & Inventory",
    desc: "Admin shipment tracking, inventory management per SKU/variant, low-stock alerts and product variant control (size, color, stock).",
    color: "#06B6D4",
  },
  {
    icon: <Layers size={20} />,
    title: "Coupon & Category System",
    desc: "Discount coupon creation & validation, dynamic category management, and admin product CRUD with image upload support.",
    color: "#84CC16",
  },
];

/* ─── How it Works ───────────────────────────────────────────── */
const steps = [
  {
    step: "01",
    title: "Browse & Discover",
    desc: "Users visit the store, filter T-shirts by category, size, or color, and explore product detail pages with variants.",
  },
  {
    step: "02",
    title: "Add to Cart & Wishlist",
    desc: "Items are added to the cart (stored in Zustand + backend) or saved to wishlist for later purchase.",
  },
  {
    step: "03",
    title: "Checkout & Pay",
    desc: "User fills shipping details, applies coupon codes, and completes payment through the integrated payment gateway.",
  },
  {
    step: "04",
    title: "Order & Track",
    desc: "After payment, a unique order is created in MySQL. Users track real-time status — Processing → Shipped → Delivered.",
  },
  {
    step: "05",
    title: "Admin Manages Everything",
    desc: "Admin controls products, inventory, orders, coupons, shipments, categories, and views analytics from the dashboard.",
  },
];

export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".fade-up").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] overflow-x-hidden">
      <style>{`
        .fade-up {
          opacity: 0;
          transform: translateY(32px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .fade-up.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .stagger-1 { transition-delay: 0.05s; }
        .stagger-2 { transition-delay: 0.15s; }
        .stagger-3 { transition-delay: 0.25s; }
        .stagger-4 { transition-delay: 0.35s; }
        .stagger-5 { transition-delay: 0.45s; }
        .stack-card:hover { transform: translateY(-6px) scale(1.02); }
        .stack-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .feature-card:hover { transform: translateY(-4px); }
        .feature-card { transition: transform 0.3s ease; }
        .glow-ring {
          animation: pulse-ring 3s ease-in-out infinite;
        }
        @keyframes pulse-ring {
          0%, 100% { box-shadow: 0 0 0 0 rgba(245,158,11,0.4); }
          50% { box-shadow: 0 0 0 16px rgba(245,158,11,0); }
        }
        .gradient-text {
          background: linear-gradient(135deg, #F59E0B, #EF4444, #A855F7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .orbit {
          animation: orbit-spin 8s linear infinite;
          transform-origin: center;
        }
        @keyframes orbit-spin {
          from { transform: rotate(0deg) translateX(80px) rotate(0deg); }
          to   { transform: rotate(360deg) translateX(80px) rotate(-360deg); }
        }
      `}</style>

      {/* ── HERO SECTION ─────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative pt-24 pb-20 px-6 flex flex-col items-center text-center overflow-hidden"
      >
        {/* Gradient bg blob */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div
            className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full blur-[120px] opacity-20"
            style={{
              background:
                "radial-gradient(ellipse, #F59E0B 0%, #EF4444 50%, transparent 100%)",
            }}
          />
        </div>

        <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-500 mb-4 border border-amber-500/30 px-4 py-1.5 rounded-full bg-amber-500/10">
          <Zap size={12} /> Full-Stack Project
        </span>

        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none mb-6">
          About This{" "}
          <span className="gradient-text">Project</span>
        </h1>
        <p className="max-w-2xl text-base md:text-lg text-[var(--color-muted)] leading-relaxed">
          A production-grade full-stack T-Shirt E-Commerce platform built with
          modern Java &amp; React technologies — featuring a complete storefront,
          admin dashboard, payments, and more.
        </p>

        {/* Down arrow */}
        <div className="mt-10 animate-bounce">
          <ChevronRight size={24} className="rotate-90 text-amber-500" />
        </div>
      </section>

      {/* ── DEVELOPER CARD ───────────────────────────────── */}
      <section className="px-6 pb-24 flex justify-center">
        <div className="fade-up max-w-4xl w-full rounded-3xl border border-amber-500/20 bg-gradient-to-br from-[var(--color-surface)] to-transparent p-8 md:p-12 flex flex-col md:flex-row items-center gap-10 shadow-2xl">
          {/* Photo */}
          <div className="relative flex-shrink-0">
            <div className="glow-ring w-44 h-44 md:w-52 md:h-52 rounded-full overflow-hidden border-4 border-amber-500 shadow-xl">
              <img
                src={developerImg}
                alt="Developer"
                className="w-full h-full object-cover object-top"
              />
            </div>
            {/* floating badge */}
            <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg whitespace-nowrap">
              👨‍💻 Full-Stack Dev
            </span>
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-black mb-2">
              The Developer
            </h2>
            <p className="text-amber-500 font-bold text-sm mb-4 uppercase tracking-widest">
              React · Spring Boot · MySQL
            </p>
            <p className="text-[var(--color-muted)] leading-relaxed mb-6 text-sm md:text-base">
              Passionate full-stack developer who designed and built this entire
              T-Shirt e-commerce platform from scratch — from database schema to
              pixel-perfect UI. This project demonstrates expertise in building
              scalable, secure, and production-ready web applications.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <a
                href="#"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--color-surface)] border border-slate-200 dark:border-slate-700 text-xs font-bold hover:border-amber-500 hover:text-amber-500 transition-colors"
              >
                <GitBranch size={14} /> GitHub
              </a>
              <a
                href="#"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--color-surface)] border border-slate-200 dark:border-slate-700 text-xs font-bold hover:border-blue-500 hover:text-blue-500 transition-colors"
              >
                <ExternalLink size={14} /> LinkedIn
              </a>
              <a
                href="#"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--color-surface)] border border-slate-200 dark:border-slate-700 text-xs font-bold hover:border-red-400 hover:text-red-400 transition-colors"
              >
                <Mail size={14} /> Contact
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── TECH STACK ───────────────────────────────────── */}
      <section className="px-6 pb-24 max-w-7xl mx-auto">
        <div className="fade-up text-center mb-12">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-500 mb-3">
            <Code2 size={14} /> Technology Stack
          </span>
          <h2 className="text-3xl md:text-4xl font-black">
            Built With Modern Tech
          </h2>
          <p className="text-[var(--color-muted)] mt-3 max-w-xl mx-auto text-sm">
            Every layer of this project uses industry-standard technologies
            chosen for performance, scalability, and developer experience.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {stack.map((tech, i) => (
            <div
              key={tech.label}
              className={`fade-up stagger-${Math.min(i + 1, 5)} stack-card rounded-2xl border border-slate-200 dark:border-slate-800 bg-[var(--color-surface)] p-5 cursor-default`}
              style={{ "--hover-color": tech.color } as React.CSSProperties}
            >
              <div className="text-3xl mb-3">{tech.icon}</div>
              <h3
                className="font-black text-lg mb-1"
                style={{ color: tech.color }}
              >
                {tech.label}
              </h3>
              <p className="text-[var(--color-muted)] text-xs leading-relaxed">
                {tech.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── ARCHITECTURE BANNER ──────────────────────────── */}
      <section className="px-6 pb-24 max-w-7xl mx-auto">
        <div className="fade-up rounded-3xl overflow-hidden border border-amber-500/20 bg-gradient-to-r from-amber-500/10 via-transparent to-purple-500/10 p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-2xl bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
                <Server size={40} className="text-amber-500" />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-black mb-2">
                REST API + Microservices Architecture
              </h3>
              <p className="text-[var(--color-muted)] text-sm leading-relaxed max-w-2xl">
                The backend is structured as independent service modules —{" "}
                <strong className="text-[var(--color-foreground)]">Auth Service</strong>,{" "}
                <strong className="text-[var(--color-foreground)]">Product Service</strong>,{" "}
                <strong className="text-[var(--color-foreground)]">Order Service</strong>, and{" "}
                <strong className="text-[var(--color-foreground)]">Payment Service</strong>.
                Each module handles its own domain logic, communicates via REST,
                and is secured through Spring Security with JWT tokens. Hibernate
                ORM maps Java entities to MySQL tables with full relationship
                support (OneToMany, ManyToOne, etc.).
              </p>
            </div>
            <div className="flex flex-col gap-2 flex-shrink-0">
              {["Auth Service", "Product Service", "Order Service", "Payment Service"].map(
                (s) => (
                  <span
                    key={s}
                    className="text-xs font-bold px-3 py-1.5 rounded-full border border-amber-500/30 text-amber-500 bg-amber-500/10 whitespace-nowrap"
                  >
                    {s}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────── */}
      <section className="px-6 pb-24 max-w-7xl mx-auto">
        <div className="fade-up text-center mb-12">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-500 mb-3">
            <Zap size={14} /> Project Features
          </span>
          <h2 className="text-3xl md:text-4xl font-black">
            What's Inside This Project?
          </h2>
          <p className="text-[var(--color-muted)] mt-3 max-w-xl mx-auto text-sm">
            A complete e-commerce ecosystem with everything you'd find in a
            real-world production store.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`fade-up stagger-${Math.min(i + 1, 5)} feature-card rounded-2xl border border-slate-200 dark:border-slate-800 bg-[var(--color-surface)] p-5`}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{
                  backgroundColor: f.color + "22",
                  color: f.color,
                  border: `1px solid ${f.color}44`,
                }}
              >
                {f.icon}
              </div>
              <h3 className="font-black text-sm mb-2">{f.title}</h3>
              <p className="text-[var(--color-muted)] text-xs leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────── */}
      <section className="px-6 pb-24 max-w-5xl mx-auto">
        <div className="fade-up text-center mb-12">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-500 mb-3">
            <Database size={14} /> User Journey
          </span>
          <h2 className="text-3xl md:text-4xl font-black">How It Works</h2>
          <p className="text-[var(--color-muted)] mt-3 max-w-xl mx-auto text-sm">
            The complete flow from browsing to delivery — how a user interacts
            with the platform.
          </p>
        </div>

        <div className="relative">
          {/* vertical line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-amber-500/50 via-purple-500/30 to-transparent hidden md:block" />

          <div className="space-y-6">
            {steps.map((s, i) => (
              <div
                key={s.step}
                className={`fade-up stagger-${Math.min(i + 1, 5)} flex items-start gap-6`}
              >
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                  <span className="text-amber-500 font-black text-lg">
                    {s.step}
                  </span>
                </div>
                <div className="flex-1 pt-3">
                  <h3 className="font-black text-base mb-1">{s.title}</h3>
                  <p className="text-[var(--color-muted)] text-sm leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA ───────────────────────────────────── */}
      <section className="px-6 pb-20 max-w-4xl mx-auto">
        <div className="fade-up text-center rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-purple-500/5 p-12">
          <div className="text-5xl mb-4">👕</div>
          <h2 className="text-3xl font-black mb-3">
            Full-Stack. Production-Ready. Open.
          </h2>
          <p className="text-[var(--color-muted)] text-sm max-w-lg mx-auto mb-8 leading-relaxed">
            This project showcases a complete end-to-end e-commerce solution —
            from database design to polished UI — built entirely by one
            developer using modern full-stack technologies.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-amber-500 text-white font-black text-sm hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/30"
          >
            <ShoppingCart size={16} />
            Explore the Store
          </a>
        </div>
      </section>
    </div>
  );
}
