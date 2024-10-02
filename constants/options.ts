export const medFormOptions = [
  { label: 'Cairan', value: 'cairan' },
  { label: 'Kapsul', value: 'kapsul' },
  { label: 'Tablet', value: 'tablet' },
  { label: 'Suntikan', value: 'suntikan' },
  { label: 'Bubuk', value: 'bubuk' },
  { label: 'Patch', value: 'patch' },
  { label: 'Gel', value: 'gel' },
];

export const dosageOptions = {
  cairan: [
    { label: '¼ sendok makan', value: '¼ sendok makan', dose_quantity: 3.75 },
    { label: '½ sendok makan', value: '½ sendok makan', dose_quantity: 7.5 },
    { label: '1 sendok makan', value: '1 sendok makan', dose_quantity: 15 },
    { label: '2 sendok makan', value: '2 sendok makan', dose_quantity: 30 },
    { label: '3 sendok makan', value: '3 sendok makan', dose_quantity: 45 },
    { label: '4 sendok makan', value: '4 sendok makan', dose_quantity: 60 },
    { label: '½ sendok teh', value: '½ sendok teh', dose_quantity: 2.5 },
    { label: '1 sendok teh', value: '1 sendok teh', dose_quantity: 5 },
    { label: '2 sendok teh', value: '2 sendok teh', dose_quantity: 10 },
    { label: '3 sendok teh', value: '3 sendok teh', dose_quantity: 15 },
    { label: '4 sendok teh', value: '4 sendok teh', dose_quantity: 20 },
  ],
  kapsul: [
    { label: '1 kapsul', value: '1 kapsul', dose_quantity: 1 },
    { label: '2 kapsul', value: '2 kapsul', dose_quantity: 2 },
    { label: '3 kapsul', value: '3 kapsul', dose_quantity: 3 },
    { label: '4 kapsul', value: '4 kapsul', dose_quantity: 4 },
  ],
  tablet: [
    { label: '½ tablet', value: '½ tablet', dose_quantity: 0.5 },
    { label: '1 tablet', value: '1 tablet', dose_quantity: 1 },
    { label: '2 tablet', value: '2 tablet', dose_quantity: 2 },
  ],
  suntikan: [
    { label: '1 ampul', value: '1 ampul', dose_quantity: 1 },
    { label: '2 ampul', value: '2 ampul', dose_quantity: 2 },
    { label: '3 ampul', value: '3 ampul', dose_quantity: 3 },
  ],
  bubuk: [
    { label: '½ sendok takar', value: '½ sendok takar', dose_quantity: 2.5 },
    { label: '1 sendok takar', value: '1 sendok takar', dose_quantity: 5 },
    { label: '2 sendok takar', value: '2 sendok takar', dose_quantity: 10 },
    { label: '¼ sendok makan', value: '¼ sendok makan', dose_quantity: 3.75 },
    { label: '½ sendok makan', value: '½ sendok makan', dose_quantity: 7.5 },
    { label: '1 sendok makan', value: '1 sendok makan', dose_quantity: 15 },
    { label: '2 sendok makan', value: '2 sendok makan', dose_quantity: 30 },
    { label: '3 sendok makan', value: '3 sendok makan', dose_quantity: 45 },
    { label: '4 sendok makan', value: '4 sendok makan', dose_quantity: 60 },
  ],
  patch: [
    { label: '1 patch', value: '1 patch', dose_quantity: 1 },
    { label: '2 patch', value: '2 patch', dose_quantity: 2 },
    { label: '3 patch', value: '3 patch', dose_quantity: 3 },
  ],
  gel: [
    { label: '½ aplikator', value: '½ aplikator', dose_quantity: 0.5 },
    { label: '1 aplikator', value: '1 aplikator', dose_quantity: 1 },
    { label: '2 aplikator', value: '2 aplikator', dose_quantity: 2 },
    { label: '3 aplikator', value: '3 aplikator', dose_quantity: 3 },
  ],
};

export const frequencyOptions = [
  { label: '1x sehari', value: '1x sehari', times_per_day: 1, interval_days: 1 },
  { label: '2x sehari', value: '2x sehari', times_per_day: 2, interval_days: 1 },
  { label: '3x sehari', value: '3x sehari', times_per_day: 3, interval_days: 1 },
  { label: '4x sehari', value: '4x sehari', times_per_day: 4, interval_days: 1 },
  { label: '1x per 2 hari', value: '1x per 2 hari', times_per_day: 1, interval_days: 2 },
  { label: '1x per 3 hari', value: '1x per 3 hari', times_per_day: 1, interval_days: 3 },
  { label: '1x per minggu', value: '1x per minggu', times_per_day: 1, interval_days: 7 },
  { label: '1x per bulan', value: '1x per bulan', times_per_day: 1, interval_days: 30 },
  { label: 'Setiap 6 jam', value: 'Setiap 6 jam', times_per_day: 4, interval_days: 1 },
  { label: 'Setiap 8 jam', value: 'Setiap 8 jam', times_per_day: 3, interval_days: 1 },
  { label: 'Setiap 12 jam', value: 'Setiap 12 jam', times_per_day: 2, interval_days: 1 },
];
