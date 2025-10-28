import { useCallback, useState } from 'react';

export function useSnackbar(timeout = 3000) {
  const [showSnackbar, setShowSnackbar] = useState(false);

  const triggerSnackbar = useCallback(() => {
    setShowSnackbar(true);
    const timer = setTimeout(() => setShowSnackbar(false), timeout);
    return () => clearTimeout(timer);
  }, [timeout]);

  return { showSnackbar, triggerSnackbar, setShowSnackbar };
}
