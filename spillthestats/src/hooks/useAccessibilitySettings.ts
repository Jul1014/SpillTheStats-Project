import { useCallback, useEffect, useSyncExternalStore } from 'react';
import type {
  AccessibilitySettings,
  Colorblind,
  Contrast,
  FontSize,
  Theme,
} from '../types/accesibility';

const STORAGE_KEY = 'accessibilitySettings';

export const DEFAULT_ACCESSIBILITY_SETTINGS: AccessibilitySettings = {
  fontSize: 'normal',
  contrast: 'normal',
  colorblind: 'none',
  theme: 'light',
  bionicText: false,
};

const fontSizes: FontSize[] = ['small', 'normal', 'large', 'extra-large'];
const contrasts: Contrast[] = ['normal', 'high', 'low'];
const colorblindModes: Colorblind[] = [
  'none',
  'protanopia',
  'deuteranopia',
  'tritanopia',
  'achromatopsia',
];
const themes: Theme[] = ['light', 'dark'];

const listeners = new Set<() => void>();

function isOneOf<T extends string>(values: readonly T[], value: unknown): value is T {
  return typeof value === 'string' && values.some((option) => option === value);
}

function parseSettings(value: string | null): AccessibilitySettings {
  if (!value) return DEFAULT_ACCESSIBILITY_SETTINGS;

  try {
    const saved: unknown = JSON.parse(value);
    if (!saved || typeof saved !== 'object' || Array.isArray(saved)) {
      return DEFAULT_ACCESSIBILITY_SETTINGS;
    }

    const candidate = saved as Record<string, unknown>;
    return {
      fontSize: isOneOf(fontSizes, candidate.fontSize)
        ? candidate.fontSize
        : DEFAULT_ACCESSIBILITY_SETTINGS.fontSize,
      contrast: isOneOf(contrasts, candidate.contrast)
        ? candidate.contrast
        : DEFAULT_ACCESSIBILITY_SETTINGS.contrast,
      colorblind: isOneOf(colorblindModes, candidate.colorblind)
        ? candidate.colorblind
        : DEFAULT_ACCESSIBILITY_SETTINGS.colorblind,
      theme: isOneOf(themes, candidate.theme)
        ? candidate.theme
        : DEFAULT_ACCESSIBILITY_SETTINGS.theme,
      bionicText: typeof candidate.bionicText === 'boolean'
        ? candidate.bionicText
        : DEFAULT_ACCESSIBILITY_SETTINGS.bionicText,
    };
  } catch (error) {
    console.error('Error loading accessibility settings', error);
    return DEFAULT_ACCESSIBILITY_SETTINGS;
  }
}

function readSettings(): AccessibilitySettings {
  try {
    return parseSettings(
      typeof window === 'undefined' ? null : window.localStorage.getItem(STORAGE_KEY),
    );
  } catch (error) {
    console.error('Error reading accessibility settings', error);
    return DEFAULT_ACCESSIBILITY_SETTINGS;
  }
}

let settingsSnapshot = readSettings();

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

function replaceSettings(settings: AccessibilitySettings) {
  settingsSnapshot = settings;
  notifyListeners();
}

function reloadSettings() {
  const updatedSettings = readSettings();
  const isUnchanged =
    settingsSnapshot.fontSize === updatedSettings.fontSize &&
    settingsSnapshot.contrast === updatedSettings.contrast &&
    settingsSnapshot.colorblind === updatedSettings.colorblind &&
    settingsSnapshot.theme === updatedSettings.theme &&
    settingsSnapshot.bionicText === updatedSettings.bionicText;

  if (!isUnchanged) replaceSettings(updatedSettings);
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  if (typeof window !== 'undefined') {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY || event.key === null) reloadSettings();
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('accessibility-changed', reloadSettings);

    return () => {
      listeners.delete(listener);
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('accessibility-changed', reloadSettings);
    };
  }

  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return settingsSnapshot;
}

function persistSettings(settings: AccessibilitySettings) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving accessibility settings', error);
  }
}

function applySettings(settings: AccessibilitySettings) {
  const root = document.documentElement;
  const scales: Record<FontSize, number> = {
    small: 0.85,
    normal: 1,
    large: 1.2,
    'extra-large': 1.5,
  };
  root.style.fontSize = `${16 * scales[settings.fontSize]}px`;

  const filters: string[] = [];
  if (settings.contrast === 'high') filters.push('contrast(1.5)');
  if (settings.contrast === 'low') filters.push('contrast(0.7) brightness(1.1)');

  const colorblindFilters: Record<Colorblind, string> = {
    none: '',
    protanopia:
      'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'p\'><feColorMatrix type=\'matrix\' values=\'0.567 0.433 0 0 0 0.558 0.442 0 0 0 0 0.242 0.758 0 0 0 0 0 1 0\'/></filter></svg>#p")',
    deuteranopia:
      'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'d\'><feColorMatrix type=\'matrix\' values=\'0.625 0.375 0 0 0 0.7 0.3 0 0 0 0 0.3 0.7 0 0 0 0 0 1 0\'/></filter></svg>#d")',
    tritanopia:
      'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'t\'><feColorMatrix type=\'matrix\' values=\'0.95 0.05 0 0 0 0 0.433 0.567 0 0 0 0.475 0.525 0 0 0 0 0 1 0\'/></filter></svg>#t")',
    achromatopsia: 'grayscale(100%)',
  };
  if (settings.colorblind !== 'none') {
    filters.push(colorblindFilters[settings.colorblind]);
  }
  root.style.filter = filters.join(' ');
  root.setAttribute('data-bs-theme', settings.theme);
  window.dispatchEvent(new Event('accessibility-changed'));
}

export function useAccessibilitySettingsSnapshot() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function useAccessibilitySettings() {
  const settings = useAccessibilitySettingsSnapshot();

  useEffect(() => {
    applySettings(settings);
  }, [settings]);

  const updateSetting = useCallback(
    <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => {
      const updatedSettings = { ...settingsSnapshot, [key]: value };
      replaceSettings(updatedSettings);
      persistSettings(updatedSettings);
    },
    [],
  );

  const resetSettings = useCallback(() => {
    replaceSettings(DEFAULT_ACCESSIBILITY_SETTINGS);
    persistSettings(DEFAULT_ACCESSIBILITY_SETTINGS);
  }, []);

  return { settings, updateSetting, resetSettings };
}
