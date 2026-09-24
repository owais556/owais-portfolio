import profile from '@/data/profile.json';

import type { StatData } from '../../components/Stats/types';

const data: StatData[] = [
  {
    key: 'location',
    label: 'Current city',
    value: profile.currentCity,
  },
];

export default data;
