export function Modal({ isOpen, title, onClose }: { isOpen: boolean; title: string; onClose: () => void }) {
  if (!isOpen) return null;
  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        <h3>{title}</h3>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
