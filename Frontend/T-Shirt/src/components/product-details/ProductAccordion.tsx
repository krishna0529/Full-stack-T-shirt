import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface ProductAccordionProps {
  description: string;
  material?: string;
  fit?: string;
}

export default function ProductAccordion({
  description,
  material = "100% Organic Combed Cotton (280 GSM)",
  fit = "Oversized / Boxy Silhouette",
}: ProductAccordionProps) {
  const [openSection, setOpenSection] = useState<string | null>("description");

  const toggleSection = (id: string) => {
    setOpenSection((prev) => (prev === id ? null : id));
  };

  const sections = [
    {
      id: "description",
      title: "Description",
      content: (
        <div className="space-y-3 text-sm text-[var(--color-muted)] leading-relaxed">
          <p>{description}</p>
          <ul className="list-disc pl-4 space-y-1 text-xs">
            <li>Heavyweight premium jersey feel</li>
            <li>Reinforced rib collar that doesn't stretch out</li>
            <li>Pre-shrunk fabric to maintain fit after washing</li>
          </ul>
        </div>
      ),
    },
    {
      id: "material",
      title: "Material & Care",
      content: (
        <div className="space-y-2 text-xs text-[var(--color-muted)] leading-relaxed">
          <p><strong className="text-[var(--color-foreground)]">Fabric:</strong> {material}</p>
          <p><strong className="text-[var(--color-foreground)]">Silhouette:</strong> {fit}</p>
          <p><strong className="text-[var(--color-foreground)]">Wash Care:</strong> Machine wash cold with like colors. Do not bleach. Tumble dry low or line dry in shade. Warm iron inside out.</p>
        </div>
      ),
    },
    {
      id: "shipping",
      title: "Shipping & Returns",
      content: (
        <div className="space-y-2 text-xs text-[var(--color-muted)] leading-relaxed">
          <p>Standard delivery within 3-5 business days across India.</p>
          <p>7-day hassle-free returns and exchanges provided items are unworn with original tags intact.</p>
        </div>
      ),
    },
  ];

  return (
    <div className="mt-8 divide-y divide-[var(--color-border)] border-t border-b border-[var(--color-border)]">
      {sections.map((item) => {
        const isOpen = openSection === item.id;
        return (
          <div key={item.id} className="py-4">
            <button
              type="button"
              onClick={() => toggleSection(item.id)}
              className="flex w-full items-center justify-between text-left text-xs font-bold uppercase tracking-widest text-[var(--color-foreground)]"
            >
              <span>{item.title}</span>
              <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
                <ChevronDown size={16} />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="pt-3 pb-1">{item.content}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
