export interface Project {
  title: string;
  subtitle?: string;
  link?: string;
  image?: string;
  date?: string;
  desc: string;
  tech?: string[];
  featured?: boolean;
}

// `image` and `date` are optional: the card omits the thumbnail block or the
// year until confirmed assets and dates exist.
const data: Project[] = [
  {
    title: 'Operation Bunyan ul Marsoos',
    subtitle: 'University Competition Website',
    desc: 'A website built for a university competition.',
    featured: true,
  },
  {
    title: 'Personal Birthday Surprise Website',
    subtitle: 'Client Project',
    desc: 'A website built for a client.',
  },
];

export default data;
