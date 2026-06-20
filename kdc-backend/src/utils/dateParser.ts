import AppError from './appError.ts';
export const parseDMYDate = (value: string) => {
  if (!value) return undefined;

  const parts = value.split('/');
  if (parts.length !== 3) {
    throw new AppError(`Invalid date format: ${value}`, 403);
  }

  const [day, month, year] = parts;

  const d = parseInt(day, 10);
  const m = parseInt(month, 10);
  const y = parseInt(year, 10);

  if (isNaN(d) || isNaN(m) || isNaN(y)) {
    throw new AppError(`Invalid date: ${value}`, 403);
  }

  const pad = (n: number) => String(n).padStart(2, '0');
  const date = new Date(`${y}-${pad(m)}-${pad(d)}T00:00:00.000Z`);

  if (isNaN(date.getTime())) {
    throw new AppError(`Invalid date: ${value}`, 403);
  }

  // Catch rollover: e.g. 31/6/2026 silently becoming July 1st
  if (
    date.getUTCDate() !== d ||
    date.getUTCMonth() + 1 !== m ||
    date.getUTCFullYear() !== y
  ) {
    throw new AppError(`Invalid date: ${value}`, 403);
  }

  return date;
};
