export type FontSize = 'small' | 'normal' | 'large' | 'extra-large';
export type Contrast = 'normal' | 'high' | 'low';
export type Colorblind = 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';
export type Theme = 'light' | 'dark';

export interface AccessibilitySettings {
  fontSize: FontSize;
  contrast: Contrast;
  colorblind: Colorblind;
  theme: Theme;
  bionicText: boolean;
}