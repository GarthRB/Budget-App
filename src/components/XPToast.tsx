import { useEffect } from 'react';

interface XPToastProps {
  amount: number;
  onDismiss: () => void;
}

export function XPToast({ amount, onDismiss }: XPToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 2000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className="fixed top-6 right-6 z-50 bg-purple-600 text-white px-4 py-2 rounded-full font-bold shadow-lg animate-bounce">
      +{amount} XP ✨
    </div>
  );
}
