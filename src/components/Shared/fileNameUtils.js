// src/Shared/fileNameUtils.js

/**
 * Converts stored filename:
 *   "14523301122024_marksheet_sem1.pdf"
 * → "marksheet sem1.pdf"
 *
 * But keeps non-timestamp files intact:
 *   "project_report_final.pdf"
 * → "project report final.pdf"
 */
export const formatFileNameForDisplay = (fileName) => {
  if (!fileName) return "";

  const str = String(fileName);

  // Find first underscore
  const firstUnderscore = str.indexOf("_");
  if (firstUnderscore > 0) {
    const prefix = str.substring(0, firstUnderscore);

    // Check if prefix is a timestamp (10–18 digits)
    if (/^\d{10,18}$/.test(prefix)) {
      const original = str.substring(firstUnderscore + 1);
      return original.replace(/_/g, " ");
    }
  }

  // Fallback: file has no timestamp → just prettify it
  return str.replace(/_/g, " ");
};
