import { useState, useEffect } from 'react';

export function useBionicText() {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const checkSettings = () => {
      const saved = localStorage.getItem('accessibilitySettings');
      if (saved) {
        try {
          const settings = JSON.parse(saved);
          setIsActive(!!settings.bionicText);
        } catch (e) {
          console.error("Error leyendo configuración biónica", e);
        }
      }
    };

    checkSettings(); // Leer al montar el componente
    window.addEventListener('storage', checkSettings); // Escuchar cambios en otras pestañas
    
    return () => window.removeEventListener('storage', checkSettings);
  }, []);

  return { isBionicActive: isActive };
}