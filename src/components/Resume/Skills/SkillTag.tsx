import type { CSSProperties } from 'react';

import type { Category, Skill } from '@/data/resume/skills';

interface SkillTagProps {
  data: Skill;
  categories: Category[];
}

export default function SkillTag({ data, categories }: SkillTagProps) {
  const { category, title } = data;

  // Get the primary category color
  const categoryColor = categories.find((cat) =>
    category.includes(cat.name),
  )?.color;

  return (
    <span
      className="skill-tag"
      style={
        {
          '--tag-color': categoryColor,
        } as CSSProperties
      }
    >
      <span className="skill-tag-name">{title}</span>
    </span>
  );
}
