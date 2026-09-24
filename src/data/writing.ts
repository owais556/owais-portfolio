export interface WritingItem {
  title: string;
  url: string;
  date: string;
  description: string;
}

// External writing links live here, kept sorted newest first. Empty until
// there are pieces to list — the writing page hides its empty groups and the
// RSS feed emits an empty channel in the meantime.
const data: WritingItem[] = [];

export default data;
