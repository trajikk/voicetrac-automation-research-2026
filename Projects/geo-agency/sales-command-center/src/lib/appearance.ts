export type FontFamily = "jakarta" | "inter" | "geist" | "manrope";
export type FontSize = "sm" | "md" | "lg" | "xl";

export const FONT_FAMILY_STORAGE_KEY = "scc-font-family";
export const FONT_SIZE_STORAGE_KEY = "scc-font-size";

export const DEFAULT_FONT_FAMILY: FontFamily = "jakarta";
export const DEFAULT_FONT_SIZE: FontSize = "md";

export const fontFamilyOptions: Array<{ value: FontFamily; label: string; preview: string }> = [
  { value: "jakarta", label: "Plus Jakarta Sans", preview: "Aa" },
  { value: "inter", label: "Inter", preview: "Aa" },
  { value: "geist", label: "Geist", preview: "Aa" },
  { value: "manrope", label: "Manrope", preview: "Aa" },
];

export const fontSizeOptions: Array<{ value: FontSize; label: string }> = [
  { value: "sm", label: "S" },
  { value: "md", label: "M" },
  { value: "lg", label: "L" },
  { value: "xl", label: "XL" },
];

export function isFontFamily(value: string | null): value is FontFamily {
  return value === "jakarta" || value === "inter" || value === "geist" || value === "manrope";
}

export function isFontSize(value: string | null): value is FontSize {
  return value === "sm" || value === "md" || value === "lg" || value === "xl";
}

/**
 * Inline script injected before hydration so the correct font/size attributes
 * are applied on the very first paint — avoids a flash of the wrong typeface.
 */
export const noFlashAppearanceScript = `
(function () {
  try {
    var font = localStorage.getItem('${FONT_FAMILY_STORAGE_KEY}') || '${DEFAULT_FONT_FAMILY}';
    var size = localStorage.getItem('${FONT_SIZE_STORAGE_KEY}') || '${DEFAULT_FONT_SIZE}';
    document.documentElement.setAttribute('data-font', font);
    document.documentElement.setAttribute('data-font-size', size);
  } catch (e) {}
})();
`;
