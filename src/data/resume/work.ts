/**
 * Conforms to https://jsonresume.org/schema/
 *
 * `url` and `startDate` are optional here (jsonresume treats them the same
 * way): a position without a public homepage or a not-yet-confirmed start
 * date still renders — the job card simply omits the link or the date range.
 */
export interface Position {
  name: string;
  position: string;
  url?: string;
  startDate?: string;
  endDate?: string;
  summary?: string;
  highlights?: string[];
}

const work: Position[] = [
  {
    name: 'Asim Higher Secondary School',
    position: 'Clerk',
    summary:
      'Clerk at Asim Higher Secondary School, working across administration, customer service, digital & IT support, and web development.',
  },
];

export default work;
