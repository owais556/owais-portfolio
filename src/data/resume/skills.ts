export interface Skill {
  title: string;
  category: string[];
}

export interface Category {
  name: string;
  color: string;
}

// The source resume lists skills without proficiency levels, so the schema
// carries none: every tag renders identically and nothing on the page asserts
// an unverified rating.
const skills: Skill[] = [
  // Documentation
  {
    title: 'Professional Documentation & MS Word',
    category: ['Documentation', 'Professional Skills'],
  },
  {
    title: 'Advanced MS Word Formatting',
    category: ['Documentation'],
  },
  {
    title: 'Reports & Correspondence',
    category: ['Communication', 'Documentation'],
  },
  // Administration
  {
    title: 'Administrative Organization',
    category: ['Administration', 'Professional Skills'],
  },
  {
    title: 'Record-Keeping',
    category: ['Administration'],
  },
  {
    title: 'Digital File Management',
    category: ['Administration', 'Digital Tools'],
  },
  // Communication
  {
    title: 'Client & Team Communication',
    category: ['Communication'],
  },
  {
    title: 'Customer Handling',
    category: ['Communication'],
  },
  // Training & Coordination
  {
    title: 'Training Delivery',
    category: ['Training & Coordination'],
  },
  {
    title: 'Coordination & Mentoring',
    category: ['Professional Skills', 'Training & Coordination'],
  },
  // Web Development
  {
    title: 'AI-Assisted Web Development',
    category: ['Web Development'],
  },
  {
    title: 'GitHub',
    category: ['Digital Tools', 'Web Development'],
  },
  {
    title: 'Vercel',
    category: ['Digital Tools', 'Web Development'],
  },
  // Content & Social Media
  {
    title: 'Social Media Management',
    category: ['Content & Social Media', 'Digital Tools'],
  },
  {
    title: 'Digital Content Creation',
    category: ['Content & Social Media'],
  },
].map((skill) => ({ ...skill, category: skill.category.sort() }));

/**
 * Build categories from skills, all using the accent color token.
 */
function buildCategories(skillsList: Skill[]): Category[] {
  const uniqueCategories = Array.from(
    new Set(skillsList.flatMap(({ category }) => category)),
  ).sort();

  return uniqueCategories.map((category) => ({
    name: category,
    color: 'var(--color-accent)',
  }));
}

const categories: Category[] = buildCategories(skills);

export { categories, skills };
