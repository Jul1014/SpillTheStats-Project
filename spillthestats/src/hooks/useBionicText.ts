import { useState, useEffect } from 'react';

export function useBionicText() {
  const [isBionicActive, setIsBionicActive] = useState(false);

  useEffect(() => {

    const checkSettings = () => {
      const saved = localStorage.getItem('accessibilitySettings');
      if (saved) {
        try {
          const settings = JSON.parse(saved);
          setIsBionicActive(!!settings.bionicText);
        } catch (e) {
          console.error("Error leyendo configuración bionic text", e);
        }
      }
    };

    checkSettings();
    
    window.addEventListener('accessibility-changed', checkSettings);
    window.addEventListener('storage', checkSettings);
    
    return () => {
      window.removeEventListener('accessibility-changed', checkSettings);
      window.removeEventListener('storage', checkSettings);
    };
  }, []);

  return { isBionicActive };
}