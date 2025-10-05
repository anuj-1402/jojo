export function parseDate(dateStr) {
    if (!dateStr) return null;
  
    // Trim and normalize separators
    const clean = dateStr.trim().replace(/\./g, '/').replace(/-/g, '/');
  
    // Match DD/MM/YYYY or D/M/YYYY
    const parts = clean.split('/');
    if (parts.length === 3) {
      const [day, month, year] = parts.map(p => p.padStart(2, '0'));
      return new Date(`${year}-${month}-${day}`);
    }
  
    // If already ISO-like or something else, try direct parse
    const d = new Date(clean);
    return isNaN(d) ? null : d;
  }

  