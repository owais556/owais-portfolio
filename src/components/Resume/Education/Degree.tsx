import type { Degree as DegreeType } from '@/data/resume/degrees';

interface DegreeProps {
  data: DegreeType;
}

export default function Degree({ data }: DegreeProps) {
  const details = [data.period, data.result].filter(Boolean).join(' · ');

  return (
    <article className="degree-container">
      <header>
        <h3 className="degree">{data.degree}</h3>
        <p className="school">
          {data.link ? <a href={data.link}>{data.school}</a> : data.school},{' '}
          <time dateTime={String(data.year)}>{data.year}</time>
        </p>
        {details && <p className="school">{details}</p>}
      </header>
    </article>
  );
}
