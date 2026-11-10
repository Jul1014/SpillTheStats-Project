import React, { useState, useEffect } from 'react';

type FontSize = 'small' | 'normal' | 'large' | 'extra-large';
type Contrast = 'normal' | 'high';
type Colorblind = 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';
type Theme = 'light' | 'dark';

interface Settings {
  fontSize: FontSize;
  contrast: Contrast;
  colorblind: Colorblind;
  theme: Theme;
}

const DEFAULT_SETTINGS: Settings = {
  fontSize: 'normal',
  contrast: 'normal',
  colorblind: 'none',
  theme: 'light',
};

interface AccessibilityPanelProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

export const AccessibilityPanel = ({ isOpen: controlledOpen, onToggle }: AccessibilityPanelProps = {}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  // Si viene un estado controlado desde App.tsx, úsalo; si no, usa el interno
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setIsOpen = onToggle ?? (() => setInternalOpen(prev => !prev));

  // Cargar configuración inicial desde localStorage
  useEffect(() => {
    const saved = localStorage.getItem('accessibilitySettings');
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (e) {
        console.error('Error al cargar configuración de accesibilidad', e);
      }
    }
  }, []);

  // Aplicar cambios al DOM y guardar en localStorage cuando cambian los settings
  useEffect(() => {
    localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
    applySettingsToDOM(settings);
  }, [settings]);

  const applySettingsToDOM = (s: Settings) => {
    const root = document.documentElement;
    const body = document.body;

    // --- Tamaño de letra ---
    const scales: Record<FontSize, number> = { small: 0.85, normal: 1, large: 1.2, 'extra-large': 1.5 };
    const multiplier = scales[s.fontSize];
    
    root.style.fontSize = `${16 * multiplier}px`; 

    // --- Filtros (Contraste + Daltonismo) ---
    const filters: string[] = [];
    if (s.contrast === 'high') filters.push('contrast(1.5)');
    
    const svgFilters: Record<Colorblind, string> = {
      none: '',
      protanopia: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'p\'><feColorMatrix type=\'matrix\' values=\'0.567 0.433 0.000 0 0 0.558 0.442 0.000 0 0 0.000 0.242 0.758 0 0 0.000 0.000 0.000 1.000 0\'/></filter></svg>#p")',
      deuteranopia: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'d\'><feColorMatrix type=\'matrix\' values=\'0.625 0.375 0.000 0 0 0.700 0.300 0.000 0 0 0.000 0.300 0.700 0 0 0.000 0.000 0.000 1.000 0\'/></filter></svg>#d")',
      tritanopia: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'t\'><feColorMatrix type=\'matrix\' values=\'0.950 0.050 0.000 0 0 0.000 0.433 0.567 0 0 0.000 0.475 0.525 0 0 0.000 0.000 0.000 1.000 0\'/></filter></svg>#t")',
      achromatopsia: 'grayscale(100%)',
    };
    if (s.colorblind !== 'none') filters.push(svgFilters[s.colorblind]);

    root.style.filter = filters.join(' ');

    // --- Tema ---
    root.setAttribute('data-color-scheme', s.theme);
  };

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem('accessibilitySettings');
  };

  // Componente auxiliar para botones de opción
  const OptionButton = ({ 
    active, 
    onClick, 
    children 
  }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
    <button 
      className={`btn btn-sm ${active ? 'btn-primary' : 'btn-outline-secondary'}`}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );

  return (
    // 👇 CAMBIO CLAVE: top-50 end-0 translate-middle-y lo centra verticalmente
    <div className="position-fixed top-50 end-0 translate-middle-y p-3" style={{ zIndex: 9999 }}>
      {!isOpen ? (
        <button
          className="btn btn-primary rounded-circle shadow d-flex align-items-center justify-content-center"
          style={{ width: '56px', height: '56px', fontSize: '1.75rem' }}
          onClick={setIsOpen}
          aria-label="Abrir panel de accesibilidad"
        >
          ♿
        </button>
      ) : (
        <div className="card shadow-lg p-3" style={{ width: '320px' }}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Accesibilidad</h5>
            <div className="d-flex gap-2">
              {/* 👇 NUEVO: Botón de minimizar (colapsa pero deja el ♿ visible) */}
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={setIsOpen}
                aria-label="Minimizar panel"
                title="Minimizar"
              >
                −
              </button>
              {/* Botón de cerrar (hace lo mismo en este diseño simple) */}
              <button
                className="btn-close"
                aria-label="Cerrar panel"
                onClick={setIsOpen}
              />
            </div>
          </div>

          <div className="d-flex flex-column gap-3">
            {/* Tamaño de Letra */}
            <div>
              <label className="form-label fw-bold small">Tamaño de Letra</label>
              <div className="d-flex gap-2">
                <OptionButton active={settings.fontSize === 'small'} onClick={() => updateSetting('fontSize', 'small')}>A-</OptionButton>
                <OptionButton active={settings.fontSize === 'normal'} onClick={() => updateSetting('fontSize', 'normal')}>A</OptionButton>
                <OptionButton active={settings.fontSize === 'large'} onClick={() => updateSetting('fontSize', 'large')}>A+</OptionButton>
                <OptionButton active={settings.fontSize === 'extra-large'} onClick={() => updateSetting('fontSize', 'extra-large')}>A++</OptionButton>
              </div>
            </div>

            {/* Contraste */}
            <div>
              <label className="form-label fw-bold small">Contraste</label>
              <div className="d-flex gap-2">
                <OptionButton active={settings.contrast === 'normal'} onClick={() => updateSetting('contrast', 'normal')}>Normal</OptionButton>
                <OptionButton active={settings.contrast === 'high'} onClick={() => updateSetting('contrast', 'high')}>Alto</OptionButton>
              </div>
            </div>

            {/* Daltonismo */}
            <div>
              <label className="form-label fw-bold small">Daltonismo</label>
              <div className="d-flex flex-wrap gap-2">
                <OptionButton active={settings.colorblind === 'none'} onClick={() => updateSetting('colorblind', 'none')}>Normal</OptionButton>
                <OptionButton active={settings.colorblind === 'protanopia'} onClick={() => updateSetting('colorblind', 'protanopia')}>Protanopia</OptionButton>
                <OptionButton active={settings.colorblind === 'deuteranopia'} onClick={() => updateSetting('colorblind', 'deuteranopia')}>Deuteranopia</OptionButton>
                <OptionButton active={settings.colorblind === 'tritanopia'} onClick={() => updateSetting('colorblind', 'tritanopia')}>Tritanopia</OptionButton>
                <OptionButton active={settings.colorblind === 'achromatopsia'} onClick={() => updateSetting('colorblind', 'achromatopsia')}>Acromatopsia</OptionButton>
              </div>
            </div>

            {/* Tema */}
            <div>
              <label className="form-label fw-bold small">Tema</label>
              <div className="d-flex gap-2">
                <OptionButton active={settings.theme === 'light'} onClick={() => updateSetting('theme', 'light')}>☀️ Claro</OptionButton>
                <OptionButton active={settings.theme === 'dark'} onClick={() => updateSetting('theme', 'dark')}>🌙 Oscuro</OptionButton>
              </div>
            </div>

            {/* Reiniciar */}
            <button className="btn btn-outline-danger btn-sm mt-2" onClick={handleReset}>
              Reiniciar configuración
            </button>
          </div>
        </div>
      )}
    </div>
  );
};