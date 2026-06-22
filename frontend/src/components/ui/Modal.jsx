import React, { useEffect } from 'react';

const Modal = ({ open, onClose, children, closeOnBackdrop = true }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-teal-900/30 backdrop-blur-sm dark:bg-black/50"
        onClick={() => closeOnBackdrop && onClose?.()}
      />
      <div className="surface-card relative z-10 w-full max-w-sm rounded-2xl p-6">
        {children}
      </div>
    </div>
  );
};

export default Modal;
