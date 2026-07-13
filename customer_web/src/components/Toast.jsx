import { useEffect, useState } from 'react';

let queue = [];
let subs = [];

function notify() { subs.forEach((fn) => fn([...queue])); }

export function showToast(message, type = 'info') {
  const id = Date.now() + Math.random();
  queue.push({ id, message, type });
  notify();
  setTimeout(() => {
    queue = queue.filter((t) => t.id !== id);
    notify();
  }, 3200);
}

export function ToastContainer() {
  const [toasts, setToasts] = useState([]);
  useEffect(() => {
    const fn = (t) => setToasts(t);
    subs.push(fn);
    return () => { subs = subs.filter((s) => s !== fn); };
  }, []);
  if (!toasts.length) return null;
  return (
    <div className="toast-wrap">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`}>{t.message}</div>
      ))}
    </div>
  );
}
