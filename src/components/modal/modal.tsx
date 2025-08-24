import { ReactNode } from 'react';
import { createPortal } from 'react-dom';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  const modalRoot = document.getElementById('modal-root');

  if (!modalRoot || !isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-auto p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 p-6 rounded-lg w-full max-w-md max-h-full overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white hover:text-red-500 text-xl font-bold"
          aria-label="Close modal"
        >
          X
        </button>

        {children}
      </div>
    </div>,
    modalRoot
  );
};

export default Modal;
