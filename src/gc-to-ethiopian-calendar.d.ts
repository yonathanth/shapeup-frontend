declare module "gc-to-ethiopian-calendar" {
  export function convertToGC(day: number, month: number, year: number): Date;
  export function toEthiopianDateString(date?: string | number | Date): string;
  export function toEthiopianMonthString(date?: string | number | Date): string;
  export function toEthiopianDayString(date?: string | number | Date): string;
}
