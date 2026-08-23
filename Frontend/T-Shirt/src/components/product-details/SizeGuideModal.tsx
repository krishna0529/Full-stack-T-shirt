import { motion, AnimatePresence } from "framer-motion";
import { X, Ruler } from "lucide-react";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SizeGuideModal({ isOpen, onClose }: SizeGuideModalProps) {
  const sizeData = [
    { size: "XS", chest: '36"', length: '26"', shoulder: '18.5"' },
    { size: "S", chest: '38"', length: '27"', shoulder: '19.5"' },
    { size: "M", chest: '40"', length: '28"', shoulder: '20.5"' },
    { size: "L", chest: '42"', length: '29"', shoulder: '21.5"' },
    { size: "XL", chest: '44"', length: '30"', shoulder: '22.5"' },
    { size: "XXL", chest: '46"', length: '31"', shoulder: '23.5"' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-[var(--color-background)] border border-[var(--color-border)] p-6 shadow-2xl z-10 text-[var(--color-foreground)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[var(--color-border)]">
              <div className="flex items-center gap-2">
                <Ruler size={20} className="text-amber-500" />
                <h3 className="text-lg font-bold tracking-tight uppercase">Size Guide (Inches)</h3>
              </div>
              <button
                onClick={onClose}
                aria-label="Close size guide"
                className="p-1 rounded-full hover:bg-[var(--color-border)]/50 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Table */}
            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-[var(--color-border)] text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">
                    <th className="pb-3">Size</th>
                    <th className="pb-3">Chest</th>
                    <th className="pb-3">Length</th>
                    <th className="pb-3">Shoulder</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                  {sizeData.map((row) => (
                    <tr key={row.size} className="hover:bg-[var(--color-card)] transition-colors">
                      <td className="py-3 font-bold">{row.size}</td>
                      <td className="py-3 text-[var(--color-muted)]">{row.chest}</td>
                      <td className="py-3 text-[var(--color-muted)]">{row.length}</td>
                      <td className="py-3 text-[var(--color-muted)]">{row.shoulder}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Measurement Tip */}
            <div className="mt-6 p-4 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)] text-xs text-[var(--color-muted)] leading-relaxed">
              <p className="font-bold text-[var(--color-foreground)] mb-1">How to Measure:</p>
              <p>Chest: Measure around the fullest part of your chest under arms.</p>
              <p>Length: Measure from the highest point of the shoulder collar to the bottom hem.</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
