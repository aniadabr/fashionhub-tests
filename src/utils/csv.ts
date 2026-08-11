export function quoteCsvField(value: string): string {
  const needsQuoting =
    value.includes(',') || value.includes('"') || value.includes('\n');

  if (!needsQuoting) {
    return value;
  }

  const correctedValue = value.replace(/"/g, '""');
  return `"${correctedValue}"`;
}

export interface PrRecord {
  title: string;
  createdAt: string;
  author: string;
}

export function createCsv(records: PrRecord[]): string {
  const header = 'PR name,created date,author';

  const rows = records.map(
    (r) =>
      `${quoteCsvField(r.title)},${quoteCsvField(r.createdAt)},${quoteCsvField(r.author)}`,
  );

  return [header, ...rows].join('\n');
}
