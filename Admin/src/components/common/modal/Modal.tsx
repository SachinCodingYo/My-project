type Props = {
  children: React.ReactNode;
  onClose: () => void;
  width?: string;
};

const Modal = ({ children, onClose, width = "420px" }: Props) => {
  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        style={{ width }}
        className="
          bg-[#0f172a] 
          rounded-xl 
          p-6 
          max-h-[90vh] 
          overflow-y-auto 
          [scrollbar-width:none] 
          [&::-webkit-scrollbar]:hidden
        "
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;