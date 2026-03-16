export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) {
    return null;
  }

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[rgba(23,28,26,0.22)] px-4"
      onClick={handleOverlayClick}
      role="presentation"
    >
      <div className="app-surface relative w-full max-w-xl p-6">
        <button
          type="button"
          className="app-button absolute right-3 top-3 flex h-9 w-9 items-center justify-center p-0"
          onClick={onClose}
          aria-label="Close settings"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
        {children}
      </div>
    </div>
  );
}
