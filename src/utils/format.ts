import pc from 'picocolors';
import { SeverityLevel } from '../core/types.js';

export function formatSeverity(severity: SeverityLevel): string {
  switch (severity) {
    case 'CRITICAL':
      return pc.bgRed(pc.white(' CRITICAL '));
    case 'HIGH':
      return pc.red(' HIGH ');
    case 'MEDIUM':
      return pc.yellow(' MEDIUM ');
    case 'LOW':
      return pc.cyan(' LOW ');
    case 'INFO':
      return pc.dim(' INFO ');
  }
}

export function formatTable(headers: string[], rows: string[][]): string {
  const colWidths = headers.map((header, colIdx) => {
    const maxRowWidth = rows.reduce((max, row) => Math.max(max, (row[colIdx] || '').length), 0);
    return Math.max(header.length, maxRowWidth);
  });

  const headerRow = headers.map((h, i) => h.padEnd(colWidths[i])).join('  ');
  const divider = colWidths.map((w) => '─'.repeat(w)).join('  ');
  const dataRows = rows.map((row) =>
    row.map((cell, i) => (cell || '').padEnd(colWidths[i])).join('  ')
  );

  return [headerRow, divider, ...dataRows].join('\n');
}
