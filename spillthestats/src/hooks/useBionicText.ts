import { useAccessibilitySettingsSnapshot } from './useAccessibilitySettings';

export function useBionicText() {
  const settings = useAccessibilitySettingsSnapshot();
  return { isBionicActive: settings.bionicText };
}