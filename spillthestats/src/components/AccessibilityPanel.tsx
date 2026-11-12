import { useState, type ReactNode } from 'react';
import { useAccessibilitySettings } from '../hooks/useAccessibilitySettings';

export type PanelState = 'closed' | 'minimized' | 'open';

interface OptionButtonProps {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}

const OptionButton = ({ active, onClick, children }: OptionButtonProps) => (
  <button className={`btn btn-sm ${active ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={onClick} type="button">
    {children}
  </button>
);

interface AccessibilityPanelProps {
  state?: PanelState;
  onStateChange?: (newState: PanelState) => void;
}

export const AccessibilityPanel = ({ state: controlledState, onStateChange }: AccessibilityPanelProps = {}) => {
  const [internalState, setInternalState] = useState<PanelState>('minimized');
  const { settings, updateSetting, resetSettings } = useAccessibilitySettings();

  const state = controlledState !== undefined ? controlledState : internalState;
  const setState = (newState: PanelState) => {
    if (onStateChange) onStateChange(newState);
    else setInternalState(newState);
  };

  return (
    <div className="position-fixed top-50 end-0 translate-middle-y p-3 accessibility-panel-container">
      {state === 'minimized' && (
        <button
          className="btn btn-primary rounded-circle shadow d-flex align-items-center justify-content-center accessibility-panel-trigger"
          onClick={() => setState('open')}
          aria-label="Abrir panel"
        >
          ♿
        </button>
      )}

      {state === 'open' && (
        <div className="card shadow-lg p-3 accessibility-panel-card">
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
            <button className="btn btn-outline-danger btn-sm mt-2" onClick={resetSettings}>
              Reiniciar configuración
            </button>
          </div>
        </div>
      )}
    </div>
  );
};