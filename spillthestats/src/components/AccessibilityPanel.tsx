import { useState, useEffect } from 'react';

type FontSize = 'small' | 'normal' | 'large' | 'extra-large';
type Contrast = 'normal' | 'high' | 'low';
type Colorblind = 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';
type Theme = 'light' | 'dark';

export type PanelState = 'closed' | 'minimized' | 'open';

interface Settings {
  fontSize: FontSize;
  contrast: Contrast;
  colorblind: Colorblind;
  theme: Theme;
  bionicText: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  fontSize: 'normal',
  contrast: 'normal',
  colorblind: 'none',
  theme: 'light',
  bionicText: false,
};

interface AccessibilityPanelProps {
  state?: PanelState;
  onStateChange?: (newState: PanelState) => void;
}

export const AccessibilityPanel = ({ state: controlledState, onStateChange }: AccessibilityPanelProps = {}) => {
  const [internalState, setInternalState] = useState<PanelState>('minimized');
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  const state = controlledState !== undefined ? controlledState : internalState;
  const setState = (newState: PanelState) => {
    if (onStateChange) onStateChange(newState);
    else setInternalState(newState);
  };

  // Cargar configuración guardada
  useEffect(() => {
    const saved = localStorage.getItem('accessibilitySettings');
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (e) {
        console.error('Error cargando settings', e);
      }
    }
  }, []);

  // Aplicar configuración al DOM
  useEffect(() => {
    localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
    const root = document.documentElement;

    // 1. Tamaño de letra
    const scales: Record<FontSize, number> = { small: 0.85, normal: 1, large: 1.2, 'extra-large': 1.5 };
    root.style.fontSize = `${16 * scales[settings.fontSize]}px`;

    // 2. Filtros (Contraste + Daltonismo combinados)
    const filters: string[] = [];
    if (settings.contrast === 'high') filters.push('contrast(1.5)');
    if (settings.contrast === 'low') filters.push('contrast(0.7) brightness(1.1)');

    const svgFilters: Record<Colorblind, string> = {
      none: '',
      protanopia: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'p\'><feColorMatrix type=\'matrix\' values=\'0.567 0.433 0 0 0 0.558 0.442 0 0 0 0 0.242 0.758 0 0 0 0 0 1 0\'/></filter></svg>#p")',
      deuteranopia: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'d\'><feColorMatrix type=\'matrix\' values=\'0.625 0.375 0 0 0 0.7 0.3 0 0 0 0 0.3 0.7 0 0 0 0 0 1 0\'/></filter></svg>#d")',
      tritanopia: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'t\'><feColorMatrix type=\'matrix\' values=\'0.95 0.05 0 0 0 0 0.433 0.567 0 0 0 0.475 0.525 0 0 0 0 0 1 0\'/></filter></svg>#t")',
      achromatopsia: 'grayscale(100%)',
    };
    if (settings.colorblind !== 'none') filters.push(svgFilters[settings.colorblind]);
    root.style.filter = filters.join(' ');

    // 3. Tema
    root.setAttribute('data-bs-theme', settings.theme);
  }, [settings]);

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem('accessibilitySettings');
  };

  const OptionButton = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
    <button className={`btn btn-sm ${active ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={onClick} type="button">
      {children}
    </button>
  );

  return (
    <div className="position-fixed top-50 end-0 translate-middle-y p-3" style={{ zIndex: 9999 }}>
      {state === 'minimized' && (
        <button
          className="btn btn-primary rounded-circle shadow d-flex align-items-center justify-content-center"
          style={{ width: '56px', height: '56px', fontSize: '1.75rem' }}
          onClick={() => setState('open')}
          aria-label="Abrir panel"
        >
          ♿
        </button>
      )}

      {state === 'open' && (
        <div className="card shadow-lg p-3" style={{ width: '320px', maxHeight: '80vh', overflowY: 'auto' }}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Accesibilidad</h5>
            <div className="d-flex gap-2">
              <button className="btn btn-sm btn-outline-secondary" onClick={() => setState('minimized')} aria-label="Minimizar">−</button>
              <button className="btn-close" aria-label="Cerrar" onClick={() => setState('closed')} />
            </div>
          </div>

          <div className="d-flex flex-column gap-3">
            {/* TAMAÑO DE LETRA */}
            <div>
              <label className="form-label fw-bold small mb-1">Tamaño de Letra</label>
              <div className="d-flex gap-2">
                <OptionButton active={settings.fontSize === 'small'} onClick={() => updateSetting('fontSize', 'small')}>A-</OptionButton>
                <OptionButton active={settings.fontSize === 'normal'} onClick={() => updateSetting('fontSize', 'normal')}>A</OptionButton>
                <OptionButton active={settings.fontSize === 'large'} onClick={() => updateSetting('fontSize', 'large')}>A+</OptionButton>
                <OptionButton active={settings.fontSize === 'extra-large'} onClick={() => updateSetting('fontSize', 'extra-large')}>A++</OptionButton>
              </div>
            </div>

            {/* CONTRASTE */}
            <div>
              <label className="form-label fw-bold small mb-1">Contraste</label>
              <div className="d-flex gap-2">
                <OptionButton active={settings.contrast === 'normal'} onClick={() => updateSetting('contrast', 'normal')}>Normal</OptionButton>
                <OptionButton active={settings.contrast === 'high'} onClick={() => updateSetting('contrast', 'high')}>Alto</OptionButton>
              </div>
            </div>

            {/* DALTONISMO */}
            <div>
              <label className="form-label fw-bold small mb-1">Daltonismo</label>
              <div className="d-flex flex-wrap gap-2">
                <OptionButton active={settings.colorblind === 'none'} onClick={() => updateSetting('colorblind', 'none')}>Normal</OptionButton>
                <OptionButton active={settings.colorblind === 'protanopia'} onClick={() => updateSetting('colorblind', 'protanopia')}>Protanopia</OptionButton>
                <OptionButton active={settings.colorblind === 'deuteranopia'} onClick={() => updateSetting('colorblind', 'deuteranopia')}>Deuteranopia</OptionButton>
                <OptionButton active={settings.colorblind === 'tritanopia'} onClick={() => updateSetting('colorblind', 'tritanopia')}>Tritanopia</OptionButton>
                <OptionButton active={settings.colorblind === 'achromatopsia'} onClick={() => updateSetting('colorblind', 'achromatopsia')}>Acromatopsia</OptionButton>
              </div>
            </div>

            {/* TEMA */}
            <div>
              <label className="form-label fw-bold small mb-1">Tema</label>
              <div className="d-flex gap-2">
                <OptionButton active={settings.theme === 'light'} onClick={() => updateSetting('theme', 'light')}>☀️ Claro</OptionButton>
                <OptionButton active={settings.theme === 'dark'} onClick={() => updateSetting('theme', 'dark')}>🌙 Oscuro</OptionButton>
              </div>
            </div>

            {/* NEURODIVERGENCIAS */}
            <div>
              <label className="form-label fw-bold small mb-1">Neurodivergencias</label>
              <div className="d-flex flex-column gap-2">
                <OptionButton
                  active={settings.contrast === 'low'}
                  onClick={() => updateSetting('contrast', settings.contrast === 'low' ? 'normal' : 'low')}
                >
                  Bajo Contraste
                </OptionButton>
                <OptionButton
                  active={settings.bionicText}
                  onClick={() => updateSetting('bionicText', !settings.bionicText)}
                >
                  Texto con Anclaje
                </OptionButton>
              </div>
            </div>

            {/* REINICIAR */}
            <button className="btn btn-outline-danger btn-sm mt-2" onClick={handleReset}>
              Reiniciar configuración
            </button>
          </div>
        </div>
      )}
    </div>
  );
};