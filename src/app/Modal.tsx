interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ onClose, children }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center fanqie-bg-black-75" onClick={onClose}>
      <div className="bg-white p-4 rounded max-w-4xl max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export default Modal;
