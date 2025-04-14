import { handleError } from './error-handling';

interface ExportOptions {
  fileName?: string;
  prettify?: boolean;
  download?: boolean;
}

export function exportToJSON<T>(
  data: T,
  options: ExportOptions = {}
): string {
  try {
    const {
      fileName = 'export.json',
      prettify = true,
      download = true
    } = options;

    // Convert data to JSON string
    const jsonString = prettify 
      ? JSON.stringify(data, null, 2)
      : JSON.stringify(data);

    // Create blob and URL
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    if (download) {
      // Create download link
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    // Clean up URL object
    setTimeout(() => URL.revokeObjectURL(url), 100);

    return url;
  } catch (error) {
    handleError(error, 'exportToJSON');
    throw new Error('Failed to export data to JSON');
  }
}

export function validateJSON(jsonString: string): boolean {
  try {
    JSON.parse(jsonString);
    return true;
  } catch {
    return false;
  }
}

export async function readJSONFile(file: File): Promise<unknown> {
  try {
    const text = await file.text();
    if (!validateJSON(text)) {
      throw new Error('Invalid JSON file');
    }
    return JSON.parse(text);
  } catch (error) {
    handleError(error, 'readJSONFile');
    throw new Error('Failed to read JSON file');
  }
}