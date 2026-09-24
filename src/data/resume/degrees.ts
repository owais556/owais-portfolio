export interface Degree {
  school: string;
  degree: string;
  link?: string;
  year: number;
  period?: string;
  result?: string;
}

const degrees: Degree[] = [
  {
    school: 'Allama Iqbal Open University, Islamabad',
    degree: 'Higher Secondary School Certificate (Intermediate) — General',
    year: 2025,
    period: '2021 – 2025',
    result: '982 / 1400 — 70.1%',
  },
  {
    school: 'Allama Iqbal Open University — Board of Secondary Education',
    degree: 'Matriculation',
    year: 2020,
    period: '2018 – 2020',
    result: '696 / 1100 — 63% (Grade B)',
  },
];

export default degrees;
