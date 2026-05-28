import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const BottomSheet = ({ isOpen, onClose, title, children }: BottomSheetProps) => {
  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-50 bg-black/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="fixed bottom-0 left-0 right-0 rounded-t-3xl bg-white p-6 shadow-2xl"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-slate-200" />
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl bg-slate-100 p-2 text-slate-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default BottomSheet;
